#!/usr/bin/env python3
"""Specialize the typed, pure Eshkol expressions in physics/ for JS and WGSL."""
import argparse
from pathlib import Path
import re

PHYSICS = Path(__file__).resolve().parents[1] / "physics"
TOKEN = re.compile(r";[^\n]*|[()]|[^\s();]+")
NUMBER = re.compile(r"-?\d+(?:\.\d+)?$")
OPS = {"+": "+", "-": "-", "*": "*", "/": "/", "=": "==", "<": "<",
       "<=": "<=", ">": ">", "and": "&&", "or": "||"}


def read_forms(path):
    """Read the symbols, numeric literals and lists used in pure function modules."""
    stack = [[]]
    for token in TOKEN.findall(path.read_text()):
        if token.startswith(";"):
            continue
        if token == "(":
            stack.append([])
        elif token == ")" and len(stack) > 1:
            form = stack.pop()
            stack[-1].append(form)
        elif token == ")":
            raise ValueError(f"{path}: unexpected ')'")
        else:
            stack[-1].append(token)
    if len(stack) != 1:
        raise ValueError(f"{path}: unterminated list")
    return stack[0]


def ident(name):
    return name.replace("-", "_")


class Backend:
    def __init__(self, wgsl):
        self.wgsl = wgsl
        self.constructors = {}
        self.accessors = {}
        self.functions = set()

    def type_name(self, name):
        return {"Vec3": "vec3<f32>", "real": "f32", "int": "i32", "boolean": "bool"}.get(name, name)

    def record(self, form):
        _, typename, (constructor, *fields), _, *accessors = form
        self.constructors[constructor] = self.type_name(typename) if self.wgsl else ident(constructor)
        for field, accessor in accessors:
            self.accessors[accessor] = field
        if self.wgsl:
            # Aggregate storage layout is declared in the host ABI template.
            return ""
        return f"function {ident(constructor)}({', '.join(fields)}) {{ return {{ {', '.join(fields)} }}; }}"

    def expression(self, form):
        if isinstance(form, str):
            return form if NUMBER.fullmatch(form) else ident(form)
        op, *operands = form
        args = [self.expression(x) for x in operands]
        if op in OPS:
            return "(" + f" {OPS[op]} ".join(args) + ")"
        if op == "if":
            test, yes, no = args
            if self.wgsl:
                # Only scalar/vector value expressions occur in let initializers.
                return f"select({no}, {yes}, {test})"
            return f"({test} ? {yes} : {no})"
        if op in self.accessors:
            return f"{args[0]}.{self.accessors[op]}"
        if op in self.constructors:
            callee = self.constructors[op]
        elif op in ("sqrt", "min", "max", "sin", "cos", "expt"):
            name = "pow" if op == "expt" else op
            callee = name if self.wgsl else f"Math.{name}"
        elif op == "modulo" and not self.wgsl:
            # Inputs to sample-unit are nonnegative integers.
            return f"({args[0]} % {args[1]})"
        elif op in self.functions:
            callee = ident(op)
        else:
            raise ValueError(f"unsupported pure Eshkol call {op!r}")
        return f"{callee}({', '.join(args)})"

    def body(self, expression, indent):
        lines = []
        if isinstance(expression, list) and expression[0] == "let*":
            _, bindings, result = expression
            for name, value in bindings:
                kw = "let" if self.wgsl else "const"
                lines.append(f"{indent}{kw} {ident(name)} = {self.expression(value)};")
            lines.extend(self.body(result, indent))
        elif isinstance(expression, list) and expression[0] == "if":
            _, test, yes, no = expression
            lines.append(f"{indent}if ({self.expression(test)}) {{")
            lines.extend(self.body(yes, indent + "  "))
            lines.append(f"{indent}}} else {{")
            lines.extend(self.body(no, indent + "  "))
            lines.append(f"{indent}}}")
        else:
            lines.append(f"{indent}return {self.expression(expression)};")
        return lines

    def compile(self, files):
        blocks = []
        for file in files:
            for form in read_forms(PHYSICS / file):
                if form[0] == "define-record-type":
                    block = self.record(form)
                elif form[0] == "define":
                    _, (name, *parameters), colon, result, expression = form
                    if colon != ":" or any(p[1] != ":" for p in parameters):
                        raise ValueError(f"{name}: expected explicit parameter and return types")
                    self.functions.add(name)
                    args = [ident(p[0]) for p in parameters]
                    if self.wgsl:
                        args = [f"{a}: {self.type_name(p[2])}" for a, p in zip(args, parameters)]
                        header = f"fn {ident(name)}({', '.join(args)}) -> {self.type_name(result)}"
                    else:
                        header = f"function {ident(name)}({', '.join(args)})"
                    block = "\n".join([header + " {", *self.body(expression, "  "), "}"])
                else:
                    raise ValueError(f"{file}: unsupported top-level form {form[0]}")
                if block:
                    blocks.append(block)
        return "\n\n".join(blocks)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="fail if generated files are stale")
    args = parser.parse_args()
    banner = "// Generated by scripts/build-physics.py from the .esk sources.\n"
    template = (PHYSICS / "dispatch.wgsl.in").read_text()
    wgsl = Backend(True).compile(["bodies.esk", "gravity.esk"])
    js = Backend(False).compile(["bodies.esk", "presets.esk"])
    types = """struct Body { position: vec3<f32>, mass: f32, velocity: vec3<f32>, radius: f32 }
struct Law { dt: f32, gravity: f32, softening: f32, collisions: bool }"""
    laws = types + "\n\n" + wgsl + "\n"
    products = {"laws.wgsl": laws,
                "nbody.wgsl": template.replace("// ESHKOL_FUNCTIONS", laws),
                "initial-laws.mjs": js + "\n\nexport { initial_body as initialBody };\n"}
    for filename, content in products.items():
        path = PHYSICS / filename
        if args.check:
            if not path.exists() or path.read_text() != banner + content:
                raise SystemExit(f"{filename} needs regeneration: python3 scripts/build-physics.py")
        else:
            path.write_text(banner + content)


if __name__ == "__main__":
    main()
