Fast water target (from three.js `webgl_shaders_ocean` example)
Link: https://threejs.org/examples/?q=water#webgl_shaders_ocean

Vertex shader (simple waves):
```glsl
uniform float time;
varying vec3 vNormal;
varying vec3 vPos;

void main() {
    vNormal = normal;
    vec3 pos = position;
    pos.z += sin( pos.x * 0.133 + time * 0.5 ) * 0.1;
    pos.z += sin( pos.y * 0.231 + time * 0.37 ) * 0.1;
    vPos = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
}
```

Fragment shader:
```glsl
uniform vec3 sunDirection;
uniform vec3 color;
uniform vec3 eye;
varying vec3 vNormal;
varying vec3 vPos;

void main() {
    vec3 n = normalize( vNormal );
    vec3 v = normalize( eye - vPos );
    vec3 l = normalize( sunDirection );
    float fresnel = pow( 1.0 - max( dot( v, n ), 0.0 ), 2.0 );
    float diffuse = max( dot( n, l ), 0.0 );
    float spec = pow( max( dot( reflect( -l, n ), v ), 0.0 ), 16.0 ) * 0.1;
    vec3 c = color * ( 0.6 + 0.4 * diffuse ) + vec3( spec ) + fresnel * 0.15;
    gl_FragColor = vec4( c, 0.85 );
}
```

Notes for future porter:
- Original demo runs on a planar grid; adapt to spherical ocean coordinates.
- Consider adding normal perturbation from a small normal map for more detail if desired.
- Hook uniforms: `time`, `sunDirection`, `eye`, `color` (water tint). Scale wave amplitude for planet radius.
