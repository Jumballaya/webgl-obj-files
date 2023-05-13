import { m4 } from "../../math/m4";
import { Material } from "../Material";
import fragShader from '../../shaders/basic/fragment.glsl?raw';
import vertShader from '../../shaders/basic/vertex.glsl?raw';
import { Vec4 } from "../../gl/types/uniform.type";
import { v3 } from "../../math/v3";

export class BasicMaterial extends Material {
    constructor(config: { color?: Vec4; }, gl: WebGL2RenderingContext) {
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
                u_world_inversed_transposed: {
                    type: 'mat4',
                    value: m4.identity(),
                },

                u_ambient_light_color: {
                    type: 'vec4',
                    value: [0.3, 0.3, 0.3, 1],
                },
                u_ambient_light_intensity: {
                    type: 'float',
                    value: 0.5,
                },
                u_reverse_directional_light_direction: {
                    type: 'vec3',
                    value: v3.normalize([0.5, 0.7, 1.0]),
                },
                u_directional_light_color: {
                    type: 'vec4',
                    value: [0.3, 0.3, 0.3, 1],
                },
                u_albedo: {
                    type: 'vec4',
                    value: config?.color ? config.color : [1.0, 1.0, 1.0, 1.0], 
                },
            }
        }, gl);
    }
}
