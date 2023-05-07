export class IndexBuffer {
    public count = 0;
    public buffer: WebGLBuffer;

    constructor(public data: number[], gl: WebGL2RenderingContext) {
        const buffer = gl.createBuffer();
        if (!buffer) {
            throw new Error('Failed to create index buffer');
        }
        this.count = data.length;
        this.buffer = buffer;

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.data), gl.STATIC_DRAW);
    }

    public bind(gl: WebGL2RenderingContext) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
    }
}
