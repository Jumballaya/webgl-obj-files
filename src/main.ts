import { Material } from './core/Material';
import { Object3D } from './core/Object3D';
import { World } from './core/World';
import { loadObjFile } from './formats/ObjParser';
import { ObjMaterial } from './formats/types/mtl.type';
import { Uniform } from './gl/types/uniform.type';
import './style.css'

import vertShader from './shaders/obj/vertex.glsl?raw';
import fragShader from './shaders/obj/fragment.glsl?raw';

const createMaterial = (mat: ObjMaterial, world: World): Material => {
    const unis: Record<string, Uniform> = {
        u_shininess: { type: 'float', value: mat.shininess },
        u_ambient: { type: 'vec3', value: mat.ambient },
        u_diffuse: { type: 'vec3', value: mat.diffuse },
        u_specular: { type: 'vec3', value: mat.specular },
        u_emissive: { type: 'vec3', value: mat.emissive },
        u_opacity: { type: 'float', value: mat.opacity },
    };
    return world.createMaterial({
        vertex: vertShader,
        fragment: fragShader,
        uniforms: unis,
    });
}

async function main() {
    const file = await loadObjFile('models/chair/chair.obj');
    console.log(file);
    const world = new World();
    const material = createMaterial(file.materials.Dblinn2SG, world);
    const geometry = world.createGeometry({
        a_position: {
            count: 3,
            type: 'float',
            data: file.geometries[0].data.position,
        },
        a_texCoord: {
            count: 2,
            type: 'float',
            data: file.geometries[0].data.texCoord,
        },
        a_normals: {
            count: 3,
            type: 'float',
            data: file.geometries[0].data.normal,
        }
    });

    const obj = new Object3D(geometry, material);
    world.addObject(obj);
}

main();
