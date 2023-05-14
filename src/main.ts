import { loadObjFile } from './formats/ObjParser';
import './style.css'

import vertShader from './shaders/obj/vertex.glsl?raw';
import fragShader from './shaders/obj/fragment.glsl?raw';

import { Object3D } from './core/Object3D';
import { Camera } from './core/Camera';
import { World } from './core/World';
import { Geometry } from './core/Geometry';
import { Group } from './core/Group';
import { v3 } from './math/v3';
import { ObjMaterial } from './formats/types/mtl.type';
import { Material } from './core/Material';
import { Uniform } from './gl/types/uniform.type';

const BASE = import.meta.env.BASE_URL;

const aspect = window.innerWidth / window.innerHeight;
let fov = 95 * Math.PI / 180;
let near = 0.1;
let far = 2000;
const camera = new Camera(fov, aspect, near, far, [0, 1, 0]);
camera.translation = [0, 4, -8];


const defaultImage = (): Promise<HTMLImageElement> => {
    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 2;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 2, 2);
    const src = canvas.toDataURL();
    const img = new Image();
    return new Promise(res => {
        img.src = src;
        img.addEventListener('load', () => res(img));
    });
} 

const loadTexture = (path: string): Promise<HTMLImageElement> => {
    const img = new Image();
    return new Promise(res => {
        img.src = path;
        img.addEventListener('load', () => res(img));
        img.addEventListener('error', async () => {
           res(await defaultImage()); 
        });
    });
}

const createMaterial = async (mat: ObjMaterial, world: World): Promise<Material> => {
    const unis: Record<string, Uniform> = {
        u_shininess: { type: 'float', value: mat.shininess },
        u_ambient: { type: 'vec3', value: mat.ambient },
        u_diffuse: { type: 'vec3', value: mat.diffuse },
        u_specular: { type: 'vec3', value: mat.specular },
        u_emissive: { type: 'vec3', value: mat.emissive },
        u_opacity: { type: 'float', value: mat.opacity },

        //u_map_diffuse: { type: 'sampler2D', value: await loadTexture(mat.textures.diffuse || '') },
        //u_map_specular: { type: 'sampler2D', value: await loadTexture(mat.textures.specular || '') },
        //u_map_bump: { type: 'sampler2D', value: await loadTexture(mat.textures.bump || '') },
    };
    return world.createMaterial({
        vertex: vertShader,
        fragment: fragShader,
        uniforms: unis,
    });
}

const createChairGeometry = async (world: World): Promise<Group> => {
    const obj = await loadObjFile(`${BASE}models/windmill/windmill.obj`);
    const data: Object3D[] = [];
    const materials: Record<string, Material> = {};
    for await (const k of Object.keys(obj.materials)) {
        const materialObjData = obj.materials[k];
        materials[k] = await createMaterial(materialObjData, world);
    }

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
            color: {
                count: 4,
                type: 'float',
                data: new Array(geo.data.normal).fill(Math.random()),
            }
        });
        geometry.translation = v3.mulScalar(obj.offset, 0.75);
        const material = materials[geo.material];
        data.push(new Object3D(geometry, material));
    }
    const group = world.createGroup(data);
    console.log(group);
    return group;
}

async function main() {
    const world = new World().setCamera(camera);
    const chairGroup = await createChairGeometry(world);
    const suzanneObj = chairGroup;

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
