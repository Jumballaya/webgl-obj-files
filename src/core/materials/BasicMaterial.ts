import { m4 } from "../../math/m4";
import { Material } from "../Material";
import fragShader from '../../shaders/obj/fragment.glsl?raw';
import vertShader from '../../shaders/obj/vertex.glsl?raw';
import { v3 } from "../../math/v3";

export class BasicMaterial extends Material {
    constructor(gl: WebGL2RenderingContext) {
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
                u_ambient_light: {
                    type: 'vec3',
                    value: [0.3, 0.3, 0.3],
                },
                u_light_direction: {
                    type: 'vec3',
                    value: v3.normalize([0.5, 0.7, 1.0]),
                },
                u_surfaceToView: {
                    type: 'vec3',
                    value: [0,0, -2],
                },

                u_shininess: { type: 'float', value: 0 },
                u_ambient: { type: 'vec3', value: [0.3, 0.3, 0.3] },
                u_diffuse: { type: 'vec3', value:  [0.3, 0.3, 0.3 ]},
                u_specular: { type: 'vec3', value: [0.3, 0.3, 0.3] },
                u_emissive: { type: 'vec3', value: [0.3, 0.3, 0.3] },
                u_opacity: { type: 'float', value: 100 },
                u_albedo: { type: 'vec3', value: [Math.random(), Math.random(), Math.random()] }
            }
        }, gl);
    }
}
