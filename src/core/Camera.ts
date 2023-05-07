import { Mat4, Vec3 } from "../gl/types/uniform.type";
import { m4 } from "../math/m4";
import { Transform } from "./types/transform.type";

type CameraProps = {
    fov: number;
    aspect: number;
    near: number;
    far: number;
    up: Vec3;
}

export class Camera {

    private transform: Transform = {
        translation: [0,0,0],
        rotation: [0,0,0],
        scale: [1,1,1],
    };

    private options: CameraProps;
    public projectionMatrix: Mat4 = m4.identity();
    public cameraMatrix: Mat4 = m4.identity();

    constructor(fov: number, aspect: number, near: number, far: number, up: Vec3) {
        this.options = { fov, aspect, near, far, up };
        this.updateProjectionMatrix();
    }

    public set fov(n: number) {
        this.options.fov = n;
        this.updateProjectionMatrix();
    }

    public get fov(): number {
        return this.options.fov;
    }

    public set aspect(n: number) {
        this.options.aspect = n;
        this.updateProjectionMatrix();
    }

    public get aspect(): number {
        return this.options.aspect;
    }

    public set near(n: number) {
        this.options.near = n;
        this.updateProjectionMatrix();
    }

    public get near(): number {
        return this.options.near;
    }

    public set far(n: number) {
        this.options.far = n;
        this.updateProjectionMatrix();
    }

    public get far(): number {
        return this.options.far;
    }

    public set up(v: Vec3) {
        this.options.up = v;
        this.updateProjectionMatrix();
    }

    public get up(): Vec3 {
        return this.options.up;
    }

    public set translation(t: Vec3) {
        this.transform.translation = t;
        this.updateCameraMatrix();
    }

    public get translation(): Vec3 {
        return this.transform.translation;
    }

    public set scale(s: Vec3) {
        this.transform.scale = s;
        this.updateCameraMatrix();
    }

    public set rotation(r: Vec3) {
        this.transform.rotation = r;
        this.updateCameraMatrix();
    }

    public rotateX(amount: number) {
        this.transform.rotation[0] = amount;
        this.updateCameraMatrix();
    }

    public rotateY(amount: number) {
        this.transform.rotation[1] = amount;
        this.updateCameraMatrix();
    }

    public rotateZ(amount: number) {
        this.transform.rotation[2] = amount;
        this.updateCameraMatrix();
    }

    public lookAt(pos: Vec3) {
        this.cameraMatrix = m4.lookAt(this.transform.translation, pos, this.up);
    }

    private updateCameraMatrix() {
        const { translation, rotation, scale } = this.transform;
        let matrix = m4.translate(this.cameraMatrix, translation);
        matrix = m4.xRotate(matrix, rotation[0]);
        matrix = m4.yRotate(matrix, rotation[1]);
        matrix = m4.zRotate(matrix, rotation[2]);
        matrix = m4.scale(matrix, scale);
        this.cameraMatrix = matrix;
    }

    private updateProjectionMatrix() {
        const { fov, aspect, near, far } = this.options;
        this.projectionMatrix = m4.perspective(fov, aspect, near, far);
    }

}
