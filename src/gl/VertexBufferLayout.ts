import { VertexBuffer } from "./VertexBuffer";
import { WebGLTypes } from "./types/webgl.type"

type VertexBufferElement = {
    type: WebGLTypes;
    count: number;
    normalized: boolean;
    data: number[];
    vertexBuffer: VertexBuffer;
}

export const getSizeOfType = (type: WebGLTypes): number => {
    switch (type) {
        case 'unsigned int':
        case 'float': return 4;

        case 'unsigned byte': return 1;
    }
}

export const getGLType = (type: WebGLTypes): number => {
    const gl = WebGL2RenderingContext;
    switch (type) {
        case 'float': return gl.FLOAT;
        case 'unsigned int': return gl.UNSIGNED_INT;
        case 'unsigned byte': return gl.UNSIGNED_BYTE;
    }
}

export class VertexBufferLayout {
    public stride = 0;
    public elements: VertexBufferElement[] = [];

    push(type: WebGLTypes, count: number, data: number[], vertexBuffer: VertexBuffer) {
        const size = getSizeOfType(type);
        this.elements.push({ type, count, normalized: false, data, vertexBuffer });
        this.stride += count * size;
    }
}
