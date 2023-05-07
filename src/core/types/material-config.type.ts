
import { Uniform } from "../../gl/types/uniform.type";

export type MaterialConfig = {
    fragment: string;
    vertex: string;
    uniforms?: Record<string, Uniform>;
}
