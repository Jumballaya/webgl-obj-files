import { VertexArray } from "../gl/VertexArray";
import { VertexBuffer } from "../gl/VertexBuffer";
import { VertexBufferLayout } from "../gl/VertexBufferLayout";
import { Vec3 } from "../gl/types/uniform.type";
import { GeometryConfig } from "./types/geometry-config.type";

let nextId = 0;
export class Geometry {

    private id = nextId++;

    public compiled = false;

    public vertexArray: VertexArray | null = null;
    public layout: VertexBufferLayout;

    public triangleCount = 0;

    public translation: Vec3 = [0,0,0];

    constructor(config: GeometryConfig, gl: WebGL2RenderingContext) {
        this.layout = new VertexBufferLayout();

        for (const entry of Object.values(config)) {
            const { type, count, data } = entry;
            const vertexBuffer = new VertexBuffer(data, gl);
            this.layout.push(type, count, data, vertexBuffer);
        }

        const { position } = config;

        if (position) {
            this.triangleCount = position.data.length / position.count;
        }

        this.vertexArray = new VertexArray(gl);
        this.vertexArray.setLayout(this.layout, gl);
        this.compiled = true;
    }

    public getId(): number {
        return this.id;
    }
    
    public bind(gl: WebGL2RenderingContext) {
        this.vertexArray?.bind(gl);
    }

}
