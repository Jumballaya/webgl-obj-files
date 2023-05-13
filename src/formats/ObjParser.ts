import { Vec2, Vec3 } from "../gl/types/uniform.type";
import { v3 } from "../math/v3";
import { Line, ObjectFile } from "./types/obj.type";

export async function loadObjFile(path: string): Promise<ObjectFile> {
    const name = path.split('/').at(-1)?.split('.obj')[0] || '';
    const basePath = path.split(`${name}.obj`)[0];
    const response = await fetch(path);
    const obj = await response.text();
    const lines = obj.split('\n');
    const parsedLines = lines.map(parseObjLine);

    // OBJ files are 1 based indices, so start with 1 item from each filled in
    const vertices: Vec3[] = [[0,0,0]];
    const normals: Vec3[] = [[0,0, 0]];
    const texCoords: Vec2[] = [[0,0]];

    const objVertexData = [
        vertices,
        texCoords,
        normals,
    ];

    let webglVertexData: [number[], number[], number[]] = [
        [], // position
        [], // texcoords
        [], // normals
    ]

    const geometries: any[] = [];
    let geometry: any;
    let material = 'default';
    let curObj = 'default';
    let groups: string[] = [];
    const materials: Set<string> = new Set();
    const materialLibs: string[] = [];

    function newGeometry() {
        if (geometry?.data?.position?.length) {
            geometry = undefined;
        }
        setGeometry();
    }

    function setGeometry() {
        if (!geometry) {
            const position: number[] = [];
            const texCoord: number[] = [];
            const normal: number[] = [];
            webglVertexData = [
                position,
                texCoord,
                normal
            ];
            geometry = {
                material,
                object: curObj,
                groups,
                data: {
                    position,
                    texCoord,
                    normal,
                },
            };
            geometries.push(geometry);
        }
    }

    function addVertex(vert: number[]) {
        for (let i = 0; i < vert.length; i++) {
            const objIndex = vert[i];
            const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
            webglVertexData[i].push(...objVertexData[i][index]);
        }
    }

    for (const line of parsedLines) {
        if (line.type === 'vertex') {
            vertices.push(line.value);
        }
        if (line.type === 'vertex-normal') {
            normals.push(line.value);
        }
        if (line.type === 'vertex-texture') {
            texCoords.push(line.value);
        }

        if (line.type === 'face') {
            setGeometry();
            const numTriangles = line.value.length - 2;
            for (let i = 0; i < numTriangles; i++) {
                addVertex(line.value[0]);
                addVertex(line.value[i + 1]);
                addVertex(line.value[i + 2]);
            }
        }

        if (line.type === 'use-material') {
            material = line.value;
            materials.add(material);
            newGeometry();
        }

        if (line.type === 'material-file') {
            materialLibs.push(`${basePath}${line.value}`);
        }

        if (line.type === 'object') {
            curObj = line.value;
            newGeometry();
        }

        if (line.type === 'groups') {
            groups = line.value;            
            newGeometry();
        }
    }

    const extents = getExtents(webglVertexData[0]);
    const range = v3.sub(extents.max, extents.min);

    const offset = v3.mulScalar(
        v3.add(extents.min, v3.mulScalar(range, 0.5)),
        -1,
    );

    const data = {
        position: webglVertexData[0],
        texCoord: webglVertexData[1],
        normal: webglVertexData[2],
    };

    return {
        name,
        offset,
        data,
        geometries,
        materialLibs,
        materials: Array.from(materials),
    };
}

function parseObjLine(input: string): Line {
    if (input.length <= 0) {
        return { type: 'empty', value: '\n' }; 
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
            return { type: 'empty', value: '\n' }; 
        }

        case 'm': {
            const key = input.slice(cursor, cursor + 6);
            if (key === 'mtllib') {
                cursor += 6;
                const value = input.slice(cursor).trim();
                return { type: 'material-file', value };
            }
            return { type: 'empty', value: '\n' }; 
        }

        default: {
            return { type: 'empty', value: '\n' }; 
        }
    }
}

function getExtents(positions: number[]): { min: Vec3; max: Vec3; } {
    const min = positions.slice(0, 3) as Vec3;
    const max = positions.slice(0, 3) as Vec3;

    for (let i = 3; i < positions.length; i += 3) {
        for (let j = 0; j < 3; j++) {
            const v = positions[i + j];
            min[j] = Math.min(v, min[j]);
            max[j] = Math.max(v, max[j]);
        }
    }

    return { min, max };
}
