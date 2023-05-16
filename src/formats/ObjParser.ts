import { Vec2, Vec3 } from "../gl/types/uniform.type";
import { v3 } from "../math/v3";
import { parseMTL } from "./MtlParser";
import { ObjLexer } from "./obj/Lexer";
import { ObjMaterial } from "./types/mtl.type";
import { ObjectFile } from "./types/obj.type";

type Geo = {
    material: string;
    object: string;
    groups: string[],
    data: {
        position: number[],
        texCoord: number[],
        normal: number[],
        color: number[],
    };
}

export async function loadObjFile(path: string): Promise<ObjectFile> {
    const name = path.split('/').at(-1)?.split('.obj')[0] || '';
    const basePath = path.split(`${name}.obj`)[0];
    const response = await fetch(path);
    const obj = await response.text();
    const lexer = new ObjLexer(obj);
    const parsedLines = lexer.parse();

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

    const geometries: Geo[] = [];
    let material = 'default';
    let curObj = 'default';
    let groups: string[] = ['default'];
    const materialLibs: string[] = [];
    let geometry: Geo | undefined;

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
            const color: number[] = [];
            webglVertexData = [
                position,
                texCoord,
                normal,
            ];
            geometry = {
                material,
                object: curObj,
                groups,
                data: {
                    position,
                    texCoord,
                    normal,
                    color,
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
        if (line.type === 'material-file') {
            materialLibs.push(`${basePath}${line.value}`);
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
            if (geometry) geometry.material = material;
            newGeometry();
        }
        if (line.type === 'object') {
            curObj = line.value;
            if (geometry) geometry.material = material;
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

    const materialsList = await Promise.all(materialLibs.map(async (lib) => {
        const matRes = await fetch(lib);
        const matTxt = await matRes.text();
        return parseMTL(matTxt, basePath);
    }));

    const materials: Record<string, ObjMaterial> = {};
    for (const mat of materialsList) {
        Object.assign(materials, mat); 
    }

    return {
        name,
        offset,
        geometries,
        materialLibs,
        materials,
    };
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
