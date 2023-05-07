#version 300 es

precision highp float;

layout(location=0) out vec4 outColor;

in vec2 v_texCoord;
in vec3 v_normal;

uniform vec4 u_ambient_light_color;
uniform float u_ambient_light_intensity;

uniform vec3 u_reverse_directional_light_direction;
uniform vec4 u_directional_light_color;
uniform vec4 u_albedo;

void main() {
    vec3 normal = normalize(v_normal);

    // Directional Light
    float direction_light_intensity = dot(normal, u_reverse_directional_light_direction) * 0.75;
     
    // Point Light

    vec4 color = u_albedo * u_ambient_light_intensity;
    color = color + ((u_ambient_light_color) * u_ambient_light_intensity);
    color = color + vec4(u_directional_light_color.rgb * direction_light_intensity, 1.0);
    outColor = color;
}
