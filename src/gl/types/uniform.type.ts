

export type Float = number;
export type Vec2 = [Float, Float];
export type Vec3 = [...Vec2, Float];
export type Vec4 = [...Vec3, Float];
export type Mat2 = [...Vec2, ...Vec2];
export type Mat3 = [...Vec3, ...Vec3, ...Vec3];
export type Mat4 = [...Vec4, ...Vec4, ...Vec4, ...Vec4];

export type Uniform = UniformFloat | UniformVec2 | UniformVec3 | UniformVec4 | UniformMat2 | UniformMat3 | UniformMat4 | UniformSampler2D;
export type UniformTypes = Uniform['type'];
export type UniformValues = Uniform['value'];
export type UniformWithPointer = Uniform & { location: WebGLUniformLocation };

type UniformFloat = {
    type: 'float';
    value: Float;
}

type UniformVec2 = {
    type: 'vec2';
    value: Vec2;
}

type UniformVec3 = {
    type: 'vec3';
    value: Vec3;
}

type UniformVec4 = {
    type: 'vec4';
    value: Vec4;
}

type UniformMat2 = {
    type: 'mat2';
    value: Mat2;
}

type UniformMat3 = {
    type: 'mat3';
    value: Mat3;
}

type UniformMat4 = {
    type: 'mat4';
    value: Mat4;
}

type UniformSampler2D = {
    type: 'sampler2D';
    value: HTMLImageElement;
}
