#version 300 es

precision highp float;

layout(location=0) out vec4 outColor;

in vec2 v_texCoord;
in vec3 v_normal;
in vec3 v_surfaceToView;

uniform vec3 u_diffuse;
uniform vec3 u_ambient;
uniform vec3 u_emissive;
uniform vec3 u_specular;
uniform float u_shininess;
uniform float u_opacity;

uniform vec3 u_ambient_light;
uniform vec3 u_light_direction;
uniform vec3 u_albedo;

void main() {
    vec3 normal = normalize(v_normal);

    vec3 surfaceToViewDir = normalize(v_surfaceToView);
    vec3 halfVector = normalize(u_light_direction + surfaceToViewDir);

    float fakeLight = dot(normal, u_light_direction) * 0.5 + 0.5;
    float specularLight = clamp(dot(normal, halfVector), 0.0, 1.0);

    vec3 effectiveDiffuse = u_diffuse * u_albedo.rgb;
     
    outColor = vec4(
        u_emissive +
        u_ambient * u_ambient_light +
        effectiveDiffuse * fakeLight +
        u_specular * pow(specularLight, u_shininess),
        u_opacity * 100.0);
}
