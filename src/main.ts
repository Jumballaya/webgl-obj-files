import { loadObjFile } from './formats/ObjParser';
import './style.css'

import { Object3D } from './core/Object3D';
import { Camera } from './core/Camera';
import { World } from './core/World';
import { Geometry } from './core/Geometry';
import { Group } from './core/Group';
import { Uniform } from './gl/types/uniform.type';
import { v3 } from './math/v3';

const BASE = import.meta.env.BASE_URL;

const aspect = window.innerWidth / window.innerHeight;
let fov = 60 * Math.PI / 180;
let near = 0.1;
let far = 2000;
const camera = new Camera(fov, aspect, near, far, [0, 1, 0]);
camera.translation = [0, 2, -10];

const createChairGeometry = async (world: World): Promise<Group> => {
    const obj = await loadObjFile(`${BASE}models/chair/chair.obj`);
    console.log(obj);

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
        data.push({
            u_albedo: {
                type: 'vec4',
                value: [Math.random(), Math.random(), Math.random(), 1],
            },
        })
    }
    const group = world.createGroup(geometries, data);
    group.translation = v3.mulScalar(obj.offset, 0.75);;
    return group;
}

async function main() {
    const world = new World().setCamera(camera);
    const chairMaterial = world.createBasicMaterial({ color: [1, 0.3, 0.7, 1.0] });
    const chairGeometry = await createChairGeometry(world);

    const suzanneObj = new Object3D(chairGeometry, chairMaterial);

    world.addObject(suzanneObj);

    let a = 0;
    camera.lookAt([0, 0, 0]);
    world.render((dt: number, objects) => {
        a += dt / 1000;

        for (const obj of objects) {
            obj.rotateY(a / 2);
        }
    });

}
main();
