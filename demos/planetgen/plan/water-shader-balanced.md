Balanced water target (from three.js `webgl_gpgpu_water` example)
Link: https://github.com/mrdoob/three.js/blob/master/examples/webgl_gpgpu_water.html

Key shaders to port (spherical adaptation needed later):

Heightmap simulation fragment (GPUComputationRenderer):
```glsl
// heightmapFragmentShader
uniform float time;
uniform float delta;
uniform float size;
uniform float viscosityConstant;
uniform vec2 mousePos;
uniform float mouseSize;

void main()	{
    vec2 cellSize = 1.0 / size;
    vec2 uv = gl_FragCoord.xy * cellSize;
    float hL = texture2D( heightmap, uv - vec2( cellSize.x, 0.0 ) ).x;
    float hR = texture2D( heightmap, uv + vec2( cellSize.x, 0.0 ) ).x;
    float hD = texture2D( heightmap, uv - vec2( 0.0, cellSize.y ) ).x;
    float hU = texture2D( heightmap, uv + vec2( 0.0, cellSize.y ) ).x;
    float hC = texture2D( heightmap, uv ).x;
    float laplacian = ( hL + hR + hD + hU - 4.0 * hC );
    float height = hC + delta * ( viscosityConstant * laplacian );
    // add drops from mouse
    float dist = distance( uv, mousePos );
    if ( dist < mouseSize ) {
        height += ( mouseSize - dist ) * 0.02;
    }
    gl_FragColor = vec4( height, 0.0, 0.0, 1.0 );
}
```

Water vertex shader:
```glsl
uniform sampler2D heightmap;
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
    vec3 newPosition = position;
    vec2 uv = position.xz * 0.5 + 0.5;
    float heightValue = texture2D( heightmap, uv ).x;
    newPosition.y += heightValue * 10.0;
    vNormal = normal;
    vPosition = newPosition;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}
```

Water fragment shader:
```glsl
uniform sampler2D heightmap;
uniform vec3 sunDirection;
uniform vec3 eye;
uniform vec3 waterColor;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vec3 toEye = normalize( eye - vPosition );
    vec3 norm = normalize( vNormal + vec3( texture2D( heightmap, vPosition.xz * 0.5 + 0.5 ).x * 0.5 ) );
    float fresnel = pow( 1.0 - max( dot( toEye, norm ), 0.0 ), 3.0 );
    float diffuse = max( dot( norm, sunDirection ), 0.0 );
    float spec = pow( max( dot( reflect( -sunDirection, norm ), toEye ), 0.0 ), 20.0 );
    vec3 color = waterColor * diffuse + vec3( spec ) + fresnel * 0.25;
    gl_FragColor = vec4( color, 0.9 );
}
```

Notes for future porter:
- Original uses planar grid + GPUComputationRenderer for heightmap; will need spherical mapping or local tangent tiles.
- Mouse/drop inputs can be replaced with wind/precip forcing.
- Height amplification and normals must be adjusted for sphere radius/scale.
