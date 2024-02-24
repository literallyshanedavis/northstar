const vertexShader = `
uniform sampler2D positions;
uniform vec2 nearFar;
uniform float pointSize;
uniform vec2 uMouse;
uniform float dispersionStrength;
varying vec3 vPosition;

varying float size;
void main() {

    //the mesh is a normalised square so the uvs = the xy positions of the vertices
    vec3 pos = texture( positions, position.xy ).xyz;
    vPosition = pos;

    // Calculate the displacement based on mouse position
    float distanceFromMouse = distance(vec2(pos.x, pos.y), uMouse);
    float dispersionFactor = 1.0 - smoothstep(0.0, 1.0, distanceFromMouse);
  
    // Disperse the particles away from the mouse
    // pos += dispersionFactor * normalize(pos - vec3(uMouse, 0.0)) * dispersionStrength;
  

    //pos now contains the position of a point in space that can be transformed
    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1. );

    //size
    gl_PointSize = size = max( 1., ( step( 1. - ( 1. / 512. ), position.x ) ) * pointSize );


}
`;

export default vertexShader;
