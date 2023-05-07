export class VertexBuffer {
    private buffer: WebGLBuffer;

    constructor(public data: number[], gl: WebGL2RenderingContext) {
        const buffer = gl.createBuffer();
        if (!buffer) {
            throw new Error('Failed to create vertex buffer');
        }
        this.buffer = buffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);
    }

    public bind(gl: WebGL2RenderingContext) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    }
}
