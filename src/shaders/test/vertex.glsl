#version 300 es

layout(location=0) in vec3 a_position;
layout(location=1) in vec2 a_texCoord;
layout(location=2) in vec3 a_normal;

out vec2 v_texCoord;
out vec3 v_normal;

uniform mat4 u_model_matrix;
uniform mat4 u_proj_matrix;
uniform mat4 u_view_matrix;

void main() {
    v_texCoord = a_texCoord;
    v_normal = a_normal;
    mat4 mvp = u_proj_matrix * u_view_matrix * u_model_matrix;
    gl_Position = mvp * vec4(a_position, 1.0);
}
