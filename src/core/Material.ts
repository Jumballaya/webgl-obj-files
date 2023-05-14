import { Uniform, UniformValues, UniformWithPointer } from "../gl/types/uniform.type";
import { MaterialConfig } from "./types/material-config.type";

let nextId = 0;

export class Material {
    private id = nextId++;

    private vertexShader: WebGLShader | null = null;
    private fragmentShader: WebGLShader | null = null;
    public program: WebGLProgram | null = null;
    private uniforms: Map<string, UniformWithPointer> = new Map();
    private config: MaterialConfig;

    public compiled = false;

    constructor(options: MaterialConfig, gl: WebGL2RenderingContext) {
        this.config = options;
        if (this.compiled) {
            throw new Error("Can't recompile materials");
        }
        const vertShader = this.createShader(gl, gl.VERTEX_SHADER, this.config.vertex);
        const fragShader = this.createShader(gl, gl.FRAGMENT_SHADER, this.config.fragment);
        if (!vertShader || !fragShader) {
            throw new Error('Unable to compile shaders');
        }

        this.vertexShader = vertShader;
        this.fragmentShader = fragShader;
        const program = this.createProgram(gl, this.vertexShader, this.fragmentShader);
        if (!program) {
            throw new Error('Unable to compile material');
        }

        this.program = program;

        gl.useProgram(program);
        this.compileUniforms(gl);
        this.compiled = true;
    }

    public getId() {
        return this.id;
    }

    public bind(gl: WebGL2RenderingContext) {
        gl.useProgram(this.program);
    }

    public updateUniform(name: string, uniform: Uniform, gl: WebGL2RenderingContext) {
        const found = this.uniforms.get(name);
        if (found) {
            this.setUniform(found, gl);
            found.value = uniform.value;
        }
    }

    public getUniform<T extends UniformValues>(name: string): T | null {
       const found = this.uniforms.get(name);
       if (found) {
           return found.value as T;
       }
       return null;
    }

    private compileUniforms(gl: WebGL2RenderingContext) {
        if (!this.program) {
            throw new Error('Unable to compile uniforms without a webgl program');
        }
        if (!this.config.uniforms) return;
        const uniforms = this.config.uniforms;
        for (const uName of Object.keys(uniforms)) {
            const uniform = uniforms[uName];
            const location = gl.getUniformLocation(this.program, uName);
            if (!location) {
                throw new Error(`Unable to get uniform location: ${uName}`);
            }
            const withPtr: UniformWithPointer = { ...uniform, location };
            this.setUniform(withPtr, gl);
            this.uniforms.set(uName, withPtr);
        }

    }

    private setUniform(uniform: UniformWithPointer, gl: WebGL2RenderingContext) {
        switch (uniform.type) {
            case 'float': {
                gl.uniform1f(uniform.location, uniform.value);
                break;
            }

            case 'vec2': {
                const { value, location } = uniform;
                gl.uniform2f(location, ...value);
                break;
            }

            case 'vec3': {
                const { value, location } = uniform;
                gl.uniform3f(location, ...value);
                break;
            }

            case 'vec4': {
                const { value, location } = uniform;
                gl.uniform4f(location, ...value);
                break;
            }

            case 'mat2': {
                const { value, location } = uniform;
                gl.uniformMatrix2fv(location, false, value);
                break;
            }

            case 'mat3': {
                const { value, location } = uniform;
                gl.uniformMatrix3fv(location, false, value);
                break;
            }
            
            case 'mat4': {
                const { value, location } = uniform;
                gl.uniformMatrix4fv(location, false, value);
                break;
            }

            case 'sampler2D': {
                const { value } = uniform;
                const texture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(
                    gl.TEXTURE_2D,
                    0,
                    gl.RGBA,
                    gl.RGBA,
                    gl.UNSIGNED_BYTE,
                    value,
                );
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.texParameteri(
                    gl.TEXTURE_2D,
                    gl.TEXTURE_MIN_FILTER,
                    gl.LINEAR_MIPMAP_LINEAR,
                );
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.uniform1i(uniform.location, 0);
            }

        }
    }

    private createShader(
        gl: WebGL2RenderingContext,
        type: number,
        source: string,
    ): WebGLShader | null {
       const shader = gl.createShader(type); 
       if (!shader) return null;

       gl.shaderSource(shader, source);
       gl.compileShader(shader);

       const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
       if (success) return shader;

       console.log(gl.getShaderInfoLog(shader));
       gl.deleteShader(shader);
       return null;
    }

    private createProgram(
        gl: WebGL2RenderingContext,
        vertexShader: WebGLShader,
        fragmentShader: WebGLShader
    ): WebGLProgram | null {
        const program = gl.createProgram();
        if (!program) return null;

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        const success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) return program;

        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
}
