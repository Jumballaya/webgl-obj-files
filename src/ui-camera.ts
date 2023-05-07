import { Camera } from "./core/Camera";


const aspect = window.innerWidth / window.innerHeight;
let fov = 60 * Math.PI / 180;
let near = 0.1;
let far = 2000;
const camera = new Camera(fov, aspect, near, far, [0, 1, 0]);
camera.translation = [0, 0, 0];

const state = {

    set fov(d: number) {
        camera.fov = d * Math.PI / 180;
    },
    get fov(): number {
        return camera.fov * 180 / Math.PI;
    },

    set aspect(d: number) {
        camera.aspect = d;
    },
    get aspect(): number {
        return camera.aspect;
    },

    set near(d: number) {
        camera.near = d;
    },
    get near(): number {
        return camera.near;
    },

    set far(d: number) {
        camera.far = d;
    },
    get far(): number {
        return camera.far;
    },
};


export function createUI() {
    const base = document.createElement('div');
    base.classList.add('ui-container');
    document.body.appendChild(base);

    const cameraSectionTitle = document.createElement('div');
    cameraSectionTitle.innerText = 'Camera Section';
    cameraSectionTitle.classList.add('section-title');
    base.appendChild(cameraSectionTitle);

    const fovContainer = document.createElement('div');
    fovContainer.classList.add('input-container');
    const fovLabel = document.createElement('label');
    fovLabel.innerText = 'FOV: ';
    const fovScroll = document.createElement('input');
    fovScroll.addEventListener('input', () => {
        state.fov = parseInt(fovScroll.value);
    });
    fovScroll.type = 'range';
    fovScroll.max = '100';
    fovScroll.min = '1';
    fovScroll.step = '1';
    fovScroll.value = state.fov.toString();
    fovContainer.appendChild(fovLabel);
    fovContainer.appendChild(fovScroll);
    base.appendChild(fovContainer);

    const nearContainer = document.createElement('div');
    nearContainer.classList.add('input-container');
    const nearLabel = document.createElement('label');
    nearLabel.innerText = 'Near: ';
    const nearScroll = document.createElement('input');
    nearScroll.addEventListener('input', () => {
        state.near = parseInt(nearScroll.value);
    });
    nearScroll.type = 'range';
    nearScroll.max = '10';
    nearScroll.min = '1';
    nearScroll.step = '0.01';
    nearScroll.value = state.near.toString();
    nearContainer.appendChild(nearLabel);
    nearContainer.appendChild(nearScroll);
    base.appendChild(nearContainer);

    const farContainer = document.createElement('div');
    farContainer.classList.add('input-container');
    const farLabel = document.createElement('label');
    farLabel.innerText = 'Far: ';
    const farScroll = document.createElement('input');
    farScroll.addEventListener('input', () => {
        state.far = parseInt(farScroll.value);
    });
    farScroll.type = 'range';
    farScroll.max = '50';
    farScroll.min = '1';
    farScroll.step = '1';
    farScroll.value = state.far.toString();
    farContainer.appendChild(farLabel);
    farContainer.appendChild(farScroll);
    base.appendChild(farContainer);

    return camera;
}
