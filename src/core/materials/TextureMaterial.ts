import { m4 } from "../../math/m4";
import { Material } from "../Material";
import fragShader from '../../shaders/test/fragment.glsl?raw';
import vertShader from '../../shaders/test/vertex.glsl?raw';

export class TextureMaterial extends Material {
    constructor(texture: HTMLImageElement, gl: WebGL2RenderingContext) {
        super({
            vertex: vertShader,
            fragment: fragShader,
            uniforms: {

                // MVP Matrix
                u_model_matrix: {
                    type: 'mat4',
                    value: m4.identity(),
                },
                u_view_matrix: {
                    type: 'mat4',
                    value: m4.identity(),
                },
                u_proj_matrix: {
                    type: 'mat4',
                    value: m4.identity(),
                },

                // Texture
                u_texture: {
                    type: 'sampler2D',
                    value: texture,
                },
            }
        }, gl);
    }
}
