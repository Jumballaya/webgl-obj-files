import { Uniform } from "../gl/types/uniform.type";
import { Geometry } from "./Geometry";


export class Group extends Geometry {

    private data: Array<Record<string, Uniform>> = [];
    private geometries: Array<Geometry> = [];

    constructor(geometries: Geometry[], data: Array<Record<string, Uniform>>, gl: WebGL2RenderingContext) {
        super({}, gl);

        for (let i = 0; i < geometries.length; i++) {
            const geo = geometries[i];
            const uni = data[i];
            this.data.push(uni);
            this.geometries.push(geo);
        }
    }

    get length(): number {
        return this.geometries.length;
    }

    public geometry(idx: number): Geometry | null {
        return this.geometries[idx] || null;
    }

    public uniforms(idx: number): Record<string, Uniform> | null {
       return this.data[idx]|| null;
    }
}
