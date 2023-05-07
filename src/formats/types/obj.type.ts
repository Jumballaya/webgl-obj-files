import { Vec2, Vec3 } from "../../gl/types/uniform.type";

export type Line = EmptyLine | CommentLine | ObjectLine | VertexLine | VertexNormalLine | VertexTangentLine | FaceRow;

type EmptyLine = {
    type: 'empty';
    value: '\n';
};

type CommentLine = {
    type: 'comment';
    value: string;
}

type ObjectLine = {
    type: 'object';
    value: string;
}

type VertexLine = {
    type: 'vertex';
    value: Vec3;
}

type VertexNormalLine = {
    type: 'vertex-normal';
    value: Vec3;
}

type VertexTangentLine = {
    type: 'vertex-texture';
    value: Vec2;
}

type FaceRow = {
    type: 'face';
    value: number[][];
}

export type ObjectFile = {
    name: string;
    offset: Vec3;
    data: {
        position: number[];
        texCoord: number[];
        normal: number[];
    };
}