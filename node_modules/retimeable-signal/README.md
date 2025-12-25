# retimeable-signal

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/retimeable-signal.svg?style=flat-square)](https://codecov.io/gh/achingbrain/retimeable-signal)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/retimeable-signal/js-test-and-release.yml?branch=main\&style=flat-square)](https://github.com/achingbrain/retimeable-signal/actions/workflows/js-test-and-release.yml?query=branch%3Amain)

> An AbortSignal that fires on a resetable timeout

# About

<!--

!IMPORTANT!

Everything in this README between "# About" and "# Install" is automatically
generated and will be overwritten the next time the doc generator is run.

To make changes to this section, please update the @packageDocumentation section
of src/index.js or src/index.ts

To experiment with formatting, please run "npm run docs" from the root of this
repo and examine the changes made.

-->

This module exports a `retimeableSignal` function that returns an
`AbortSignal` that fires an "abort" event after a specified number of ms.

It has been augmented with two additional methods `reset` and `clear` which
change the timeout time and prevent it from firing entirely.

## Example

```TypeScript
import { retimeableSignal } from 'retimeable-signal'

const signal = retimeableSignal(100)

//... time passes, reset timeout to now + 100ms
signal.reset(100)

// stop the signal from aborting at all
signal.clear()
```

## Prior art

This is module is inspired by the [retimer](https://www.npmjs.com/package/retimer)
module except that uses `setTimeout` which can cause a Node.js process to
stay open, this uses `AbortSignal.timeout` which does not.

# Install

```console
$ npm i retimeable-signal
```

## Browser `<script>` tag

Loading this module through a script tag will make its exports available as `RetimeableSignal` in the global namespace.

```html
<script src="https://unpkg.com/retimeable-signal/dist/index.min.js"></script>
```

# API Docs

- <https://achingbrain.github.io/retimeable-signal>

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](https://github.com/achingbrain/retimeable-signal/LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](https://github.com/achingbrain/retimeable-signal/LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
