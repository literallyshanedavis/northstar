const fragmentShader = /*glsl*/ `
uniform vec2 nearFar;
uniform vec3 small;
uniform vec3 big;
uniform vec2 uMouse;
varying float size;
varying vec3 vPosition;
void main()
{

// change color here

    vec3 normalizedPosition = normalize(vPosition);
    vec3 colorBasedOnPosition = vec3(normalizedPosition.x, normalizedPosition.y, normalizedPosition.x);

    gl_FragColor = vec4( big, 1. );


    if( size > 1. )
    {
        gl_FragColor = vec4( small * vec3( 1. - length( gl_PointCoord.xy-vec2(.5) ) )  * 1.5, .95 );
        // gl_FragColor = vec4( small * vec3( 1. - length( gl_PointCoord.xy-vec2(.5) ) ) * colorBasedOnPosition * 1.5, .95 );
    }

}
`;

export default fragmentShader;
