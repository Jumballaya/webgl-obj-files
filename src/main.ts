import { loadObjFile } from './formats/ObjParser';
import './style.css'

import { Object3D } from './core/Object3D';
import { Camera } from './core/Camera';
import { World } from './core/World';
import { Geometry } from './core/Geometry';
import { Group } from './core/Group';
import { Uniform, Vec3 } from './gl/types/uniform.type';
import { v3 } from './math/v3';
import { ObjMaterial } from './formats/types/mtl.type';

const BASE = import.meta.env.BASE_URL;

const aspect = window.innerWidth / window.innerHeight;
let fov = 95 * Math.PI / 180;
let near = 0.1;
let far = 2000;
const camera = new Camera(fov, aspect, near, far, [0, 1, 0]);
camera.translation = [0, 4, -8];

const createMaterialUniforms = (mat: ObjMaterial, albedo?: Vec3): Record<string, Uniform> => {
    return {
        u_shininess: { type: 'float', value: mat.shininess },
        u_ambient: { type: 'vec3', value: mat.ambient },
        u_diffuse: { type: 'vec3', value: mat.diffuse },
        u_specular: { type: 'vec3', value: mat.specular },
        u_emissive: { type: 'vec3', value: mat.emissive },
        u_opacity: { type: 'float', value: mat.opacity },
        u_albedo: { type: 'vec3', value: albedo ? albedo : [Math.random(),Math.random(),Math.random()] }
    } 
}

const createChairGeometry = async (world: World): Promise<Group> => {
    const obj = await loadObjFile(`${BASE}models/windmill/windmill.obj`);
    console.log(obj);

    const colors: Record<string, Vec3> = {
        'Object_7_Mesh_4': [1.0, 1.0, 1.0], // back bar and side-lever
        'Object_6_Mesh_3': [1.0, 1.0, 1.0], // Square in seat-back
        'Object_10_Mesh_7': [1.0, 1.0, 1.0], // rings on arms
        'Object_11_Mesh_8': [0.0, 0.0, 0.0], // Arms
        'Object_12_Mesh_9': [0.2, 0.7, 0.9], // Seat cushion
        'Object_13_Mesh_10': [1.0, 1.0, 1.0],

    };

    const geometries: Geometry[] = [];
    const data: Record<string, Uniform>[] = [];
    for (const geo of obj.geometries) {
        const geometry = world.createGeometry({
            position: {
                count: 3,
                type: 'float',
                data: geo.data.position,
            },
            texCoord: {
                count: 2,
                type: 'float',
                data: geo.data.texCoord,
            },
            normal: {
                count: 3,
                type: 'float',
                data: geo.data.normal,
            },
        });
        geometries.push(geometry);
        const matName =  geo.material;
        const material = obj.materials[matName];
        if (material) {
            console.log(geo.object)
            data.push(createMaterialUniforms(material, colors[geo.object]));
        } else {
            data.push({});
        }
    }
    const group = world.createGroup(geometries, data);
    group.translation = v3.mulScalar(obj.offset, 0.75);;
    return group;
}

async function main() {
    const world = new World().setCamera(camera);
    const chairMaterial = world.createBasicMaterial();
    const chairGeometry = await createChairGeometry(world);

    const suzanneObj = new Object3D(chairGeometry, chairMaterial);

    world.addObject(suzanneObj);

    let a = 0;
    camera.lookAt([0, 2, 0]);
    world.render((dt: number, objects) => {
        a += dt / 1000;

        for (const obj of objects) {
            obj.rotateY(a / 2);
        }
    });

}
main();
