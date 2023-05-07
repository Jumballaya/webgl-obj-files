import { Geometry } from "./Geometry";
import { Material } from "./Material";
import { Mat4, Uniform, Vec3 } from "../gl/types/uniform.type";
import { m4 } from "../math/m4";
import { Transform } from "./types/transform.type";

export class Object3D {
    public geometry: Geometry;
    public material: Material;
    transform: Transform = {
        translation: [0,0,0],
        rotation: [0,0,0],
        scale: [1,1,1],
    };
    private matrix: Mat4 = m4.identity();
    private invTransMatrix: Mat4 = m4.identity();

    public offset: Vec3 = [0,0,0];

    constructor(geometry: Geometry, material: Material) {
        this.geometry = geometry;
        this.material = material;
    }

    public set translation(t: Vec3) {
        this.transform.translation = t;
        this.updateMatrix();
    }

    public get translation(): Vec3 {
        return this.transform.translation;
    }

    public set scale(s: Vec3) {
        this.transform.scale = s;
        this.updateMatrix();
    }

    public set rotation(r: Vec3) {
        this.transform.rotation = r;
        this.updateMatrix();
    }
    
    public get rotation(): Vec3 {
        return this.transform.rotation;
    }

    public rotateX(amount: number) {
        this.transform.rotation[0] = amount;
        this.updateMatrix();
    }

    public rotateY(amount: number) {
        this.transform.rotation[1] = amount;
        this.updateMatrix();
    }

    public rotateZ(amount: number) {
        this.transform.rotation[2] = amount;
        this.updateMatrix();
    }

    get modelMatrix(): Mat4 {
        return this.matrix;
    }

    get inverseTransposedMatrix() {
        return this.invTransMatrix;
    }

    public update(prop: string, uniform: Uniform, gl: WebGL2RenderingContext) {
        this.material.updateUniform(prop, uniform, gl);
        this.updateMatrix();
    }

    public updateUniforms(uniforms: Record<string, Uniform>, gl: WebGL2RenderingContext) {
        for (const [k, u] of Object.entries(uniforms)) {
           this.update(k, u, gl); 
        }
    }

    public bindMaterial(gl: WebGL2RenderingContext) {
        this.material.bind(gl);
    }

    public bindGeometry(gl: WebGL2RenderingContext) {
        this.geometry.bind(gl);
    }

    private updateMatrix() {
        const { translation, rotation, scale } = this.transform;
        let matrix = m4.translate(m4.identity(), translation);
        matrix = m4.xRotate(matrix, rotation[0]);
        matrix = m4.yRotate(matrix, rotation[1]);
        matrix = m4.zRotate(matrix, rotation[2]);
        matrix = m4.scale(matrix, scale);
        matrix = m4.translate(matrix, this.geometry.translation);
        this.matrix = matrix;
        this.updateInverseTransposedMatrix();
    }

    private updateInverseTransposedMatrix() {
        let invTrans = m4.inverse(this.matrix);
        this.invTransMatrix = m4.transpose(invTrans);
    }
}
