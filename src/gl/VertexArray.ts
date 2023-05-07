import { VertexBufferLayout, getGLType } from "./VertexBufferLayout";



export class VertexArray {

    private vao: WebGLVertexArrayObject;

    constructor(gl: WebGL2RenderingContext) {
        const vao = gl.createVertexArray();
        if (!vao) {
            throw new Error('Failed to created Vertex Array Object');
        }
        this.vao = vao;
    }

    public setLayout(
        layout: VertexBufferLayout,
        gl: WebGL2RenderingContext,
    ) {
        this.bind(gl);

        let offset = 0;
        for (let i = 0; i < layout.elements.length; i++) {
            const el = layout.elements[i];
            el.vertexBuffer.bind(gl);
            gl.enableVertexAttribArray(i);
            gl.vertexAttribPointer(
                i,
                el.count,
                getGLType(el.type),
                el.normalized,
                0,
                offset,
            );
        }
    }

    public bind(gl: WebGL2RenderingContext) {
        gl.bindVertexArray(this.vao);
    }

    public cleanup(gl: WebGL2RenderingContext) {
        gl.deleteVertexArray(this.vao);
    }

}
