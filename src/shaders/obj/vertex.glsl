#version 300 es

layout(location=0) in vec4 a_position;
layout(location=1) in vec2 a_texCoord;
layout(location=2) in vec3 a_normal;

out vec2 v_texCoord;
out vec3 v_normal;
out vec3 v_surfaceToView;

uniform mat4 u_model_matrix;
uniform mat4 u_view_matrix;
uniform mat4 u_proj_matrix;

uniform vec3 u_surfaceToView;

void main() {
    vec4 worldPosition = u_model_matrix * a_position;
    gl_Position = u_proj_matrix * u_view_matrix * worldPosition;

    v_normal = mat3(u_model_matrix) * a_normal;
    v_texCoord = a_texCoord;
    v_surfaceToView = u_surfaceToView - worldPosition.xyz;
}
