import { Uniform, Vec3 } from "../gl/types/uniform.type";
import { m4 } from "../math/m4";
import { Camera } from "./Camera";
import { Geometry } from "./Geometry";
import { Material } from "./Material";
import { Object3D } from "./Object3D";
import { GeometryConfig } from "./types/geometry-config.type";
import { MaterialConfig } from "./types/material-config.type";
import { Group } from "./Group";

function makeDefaultCamera(): Camera {
    const defaultFov = 75 * Math.PI / 180;
    const defaultNear = 0.01;
    const defaultFar = 2000;
    const defaultAspect = 1;
    const defaultUp: Vec3 = [0, 1, 0];
    return new Camera(defaultFov, defaultAspect, defaultNear, defaultFar, defaultUp);
}

export class World {
    private canvas: HTMLCanvasElement;
    private ctx: WebGL2RenderingContext;

    private objects: Object3D[] = [];
    private camera: Camera;

    private running = true;
    private time: number = Date.now();

    constructor() {
        const [width, height] = [window.innerWidth, window.innerHeight];
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        document.body.appendChild(this.canvas);
        const ctx = this.canvas.getContext('webgl2');
        if (!ctx) {
            throw new Error('Could not create webgl2 context');
        }
        this.ctx = ctx;
        this.camera = makeDefaultCamera();

        window.addEventListener('resize', this.resizeCanvas.bind(this));
    }

    public render(loop: (dt: number, objects: Object3D[]) => void) {
        const curT = Date.now();
        const dt = curT - this.time;
        this.time = curT;
        loop(dt, this.objects);
        this.renderFrame();
        if (this.running) {
            window.requestAnimationFrame(() => this.render(loop));
        }
    }

    public createGroup(data: Array<Object3D>): Group {
       return new Group(data); 
    }

    public createGeometry(layout: GeometryConfig): Geometry {
        const geo = new Geometry(layout, this.ctx);
        return geo;
    }

    public createMaterial(config: MaterialConfig): Material {
        const mat = new Material(config, this.ctx);
        return mat;
    }

    public addObject(obj: Object3D) {
        this.objects.push(obj);
    }

    public setCamera(camera: Camera): World {
        this.camera = camera;
        return this;
    }

    public setCanvas(canvas: HTMLCanvasElement): World {
        this.canvas = canvas;
        const ctx = this.canvas.getContext('webgl2');
        if (!ctx) {
            throw new Error('Could not create webgl2 context');
        }
        this.ctx = ctx;
        return this;
    }

    private renderFrame() {
        const gl = this.ctx;
        const canvas = this.canvas;
        const camera = this.camera;

        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(1,1,1,1);

        const uniforms: Record<string, Uniform> = {
            'u_view_matrix': {
                type: 'mat4',
                value: m4.inverse(camera.cameraMatrix),
            },
            'u_proj_matrix': {
                type: 'mat4',
                value: camera.projectionMatrix,
            },
            u_surfaceToView: {
                type: 'vec3',
                value: camera.translation,
            },
        };

        for (const obj of this.objects) {
            this.renderObject(obj, uniforms);
        }
    }

    private renderObject(obj: Object3D, uniforms: Record<string, Uniform>) {
        const gl = this.ctx;
        obj.bindGeometry(gl);
        obj.bindMaterial(gl)
        obj.updateUniforms(uniforms, gl);
        obj.updateUniforms({
            u_model_matrix: {
                type: 'mat4',
                value: obj.modelMatrix,
            }
        }, gl);
        gl.drawArrays(gl.TRIANGLES, 0, obj.geometry.triangleCount);

        if (obj instanceof Group) {
            for (const child of obj.children) {
                this.renderObject(child, uniforms);
            }
        }
    }

    private resizeCanvas() {
        const [h, w] = [window.innerHeight, window.innerWidth]
        this.ctx.canvas.width = w;
        this.ctx.canvas.height = h;
        this.camera.aspect = w / h;
    }
}
