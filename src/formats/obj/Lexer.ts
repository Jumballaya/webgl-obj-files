import { Vec2, Vec3 } from "../../gl/types/uniform.type";
import { Line } from "../types/obj.type";

export class ObjLexer {

    constructor(private text: string) {}

    public *parse(): Generator<Line, void, void> {
        const lines = this.text.split('\n');
        for (let line of lines) {
            yield this.parseObjLine(line);
        }
    }

    private parseObjLine(input: string): Line {
        if (input.length <= 0) {
            return { type: 'empty', value: '\0' }; 
        }
        let cursor = 0;
        switch (input[cursor]) {

            case '#': {
                cursor++;
                if (input[cursor] === ' ') cursor++;
                const comment = input.slice(cursor, input.length);
                return { type: 'comment', value: comment };
            }

            case 'o': {
                cursor++;
                if (input[cursor] === ' ') cursor++;
                const objectName = input.slice(cursor, input.length);
                return { type: 'object', value: objectName };
            }

            case 'g': {
                cursor++;
                const groupNames = input.slice(cursor).trim().split(' ');
                return { type: 'groups', value: groupNames };

            }

            case 'v': {
                cursor++;
                let type: Line['type'] = 'empty';
                if (input[cursor] === 'n') {
                    type = 'vertex-normal';
                    cursor++;
                } else if (input[cursor] === 't') {
                    type = 'vertex-texture';
                    cursor++;
                } else {
                    type = 'vertex';
                }
                if (input[cursor] === ' ') cursor++;

                const data = input.slice(cursor, input.length);
                const values = data.split(' ').map(Number);
                if (type === 'vertex-texture') {
                    return { type, value: values as Vec2 };
                }
                return { type, value: values as Vec3 };
            }

            case 'f': {
                cursor++;
                if (input[cursor] === ' ') cursor++;

                const data = input.slice(cursor, input.length);
                const values = data.split(' ').map(g => g.split('/').map(Number)) as [Vec3, Vec3, Vec3, Vec3];
                return { type: 'face', value: values };
            }

            case 'u': {
                const key = input.slice(cursor, cursor + 6);
                if (key === 'usemtl') {
                    cursor += 6;
                    const value = input.slice(cursor).trim();
                    return { type: 'use-material', value };
                }
                return { type: 'empty', value: '\0' }; 
            }

            case 'm': {
                const key = input.slice(cursor, cursor + 6);
                if (key === 'mtllib') {
                    cursor += 6;
                    const value = input.slice(cursor).trim();
                    return { type: 'material-file', value };
                }
                return { type: 'empty', value: '\0' }; 
            }

            default: {
                return { type: 'empty', value: '\0' }; 
            }
        }
    }
}
