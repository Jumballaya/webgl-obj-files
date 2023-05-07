
import { WebGLTypes } from "../../gl/types/webgl.type";

export type GeometryConfig = Record<string, {
    count: number;
    type: WebGLTypes;
    data: number[];
}>;
