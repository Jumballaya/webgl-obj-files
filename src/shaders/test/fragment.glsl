#version 300 es

precision highp float;

layout(location=0) out vec4 outColor;

in vec2 v_texCoord;

uniform sampler2D u_texture;

void main() {
    vec4 texel = texture(u_texture, v_texCoord);
    outColor = texel;
}
