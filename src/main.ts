import { loadObjFile } from './formats/ObjParser';
import './style.css'

import { Vec3 } from './gl/types/uniform.type';
import { Object3D } from './core/Object3D';
import { Camera } from './core/Camera';
import { World } from './core/World';
import { Geometry } from './core/Geometry';


const aspect = window.innerWidth / window.innerHeight;
let fov = 60 * Math.PI / 180;
let near = 0.1;
let far = 2000;
const camera = new Camera(fov, aspect, near, far, [0, 1, 0]);
camera.translation = [0, 2, -10];

const createChairGeometry = async (world: World): Promise<Geometry> => {
    const obj = await loadObjFile('/models/suzanne.obj');
    const geometry = world.createGeometry({
        position: {
            count: 3,
            type: 'float',
            data: obj.data.position,
        },
        texCoord: {
            count: 2,
            type: 'float',
            data: obj.data.texCoord,
        },
        normal: {
            count: 3,
            type: 'float',
            data: obj.data.normal,
        },
    });
    geometry.translation = obj.offset;
    return geometry;
}

const createIcosphereGeometry = async (world: World): Promise<Geometry> => {
    const obj = await loadObjFile('/models/teapot.obj');

    const geometry = world.createGeometry({
        position: {
            count: 3,
            type: 'float',
            data: obj.data.position,
        },
        texCoord: {
            count: 2,
            type: 'float',
            data: obj.data.texCoord,
        },
        normal: {
            count: 3,
            type: 'float',
            data: obj.data.normal,
        },
    });
    geometry.translation = obj.offset;
    return geometry;
}


async function main() {
    const world = new World().setCamera(camera);

    const icoMaterial = world.createBasicMaterial({ color: [0.4, 0.3, 0.7, 1.0] });
    const icoGeometry = await createIcosphereGeometry(world);

    for (let i = 0; i < 12; i++) {
        const angle = i * Math.PI * 2 / 12;
        const x = Math.cos(angle) * 5;
        const z = Math.sin(angle) * 5;
        const translation: Vec3 = [x, 0, z];
        const rotation: Vec3 = [0, Math.random() * 3, 0];
        const obj = new Object3D(icoGeometry, icoMaterial);
        obj.translation = translation;
        obj.rotation = rotation;
        obj.scale = [0.5, 0.5, 0.5];

        world.addObject(obj);
    }

    const chairMaterial = world.createBasicMaterial({ color: [1, 0, 0, 1] });
    const charGeometry = await createChairGeometry(world);
    const chairObj = new Object3D(charGeometry, chairMaterial);
    chairObj.scale = [0.5, 0.5, 0.5];

    world.addObject(chairObj);

    let a = 0;
    world.render((dt: number, objects) => {
        a += dt / 1000;
        // camera.translation = [Math.cos(-a) * 10, Math.cos(a) * 4, Math.sin(-a) * 10];
        camera.lookAt([0, 0, 0]);

        for (const obj of objects) {
            obj.rotateY(a / 2);
        }
    });

}
main();
