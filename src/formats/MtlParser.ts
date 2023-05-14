import { MTLLine, MtlFile, ObjMaterial } from "./types/mtl.type";


export function parseMTL(text: string): MtlFile {
    const lines = text.split('\n');
    const parsedLines = lines.map(parseMtlLine);

    const materials: Record<string, ObjMaterial> = {}
    let curMaterial = '';

    for (let line of parsedLines) {
       if (line.type === 'new-material') {
            curMaterial = line.value;
            materials[curMaterial] = newMaterial();
            continue;
       }
       if (line.type === 'Ns-spec-shiny') {
            materials[curMaterial].shininess = line.value;
            continue;
       }
       if (line.type === 'Ni-optical-density') {
            materials[curMaterial].opticalDensity = line.value;
            continue;
       }
       if (line.type === 'Ka-ambient-color') {
            materials[curMaterial].ambient = line.value;
            continue;
       }
       if (line.type === 'Kd-diffuse-color') {
            materials[curMaterial].diffuse = line.value;
            continue;
       }
       if (line.type === 'Ks-specular-color') {
            materials[curMaterial].specular = line.value;
            continue;
       }
       if (line.type === 'Ke-emmisive-color') {
            materials[curMaterial].emissive = line.value;
            continue;
       }
       if (line.type === 'dissolve') {
            materials[curMaterial].opacity = line.value;
            continue;
       }
       if (line.type === 'illum') {
            materials[curMaterial].illum = line.value;
            continue;
       }
    }

    return {
        materials,
    }
}

function newMaterial(): ObjMaterial {
    return {
        shininess: 0,
        ambient: [0,0,0],
        diffuse: [0,0,0],
        specular: [0,0,0],
        emissive: [0,0,0],
        opticalDensity: 1,
        opacity: 1,
        illum: 1,
    }
}

function parseMtlLine(input: string): MTLLine {
    if (input.length <= 0) {
        return { type: 'empty', value: '\0' }; 
    }
    let cursor = 0;

    switch (input[cursor]) {
        case '#': {
            cursor++;
            const rest = input.slice(cursor).trim();
            return { type: 'comment', value: rest };
        }

        case 'n': {
            const key = input.slice(cursor, cursor + 6);
            if (key === 'newmtl') {
                cursor += 6;
                const rest = input.slice(cursor).trim();
                return { type: 'new-material', value: rest };
            }
            return { type: 'empty', value: '\0' };
        }

        case 'd': {
            cursor++;
            const d = parseFloat(input.slice(cursor).trim());
            return { type: 'dissolve', value: d };
        }

        case 'i': {
            const key = input.slice(cursor, cursor + 5);
            if (key === 'illum') {
                cursor += 5;
                const d = parseFloat(input.slice(cursor).trim());
                return { type: 'illum', value: d };
            }
            return { type: 'empty', value: '\0' };
        }

        case 'N': {
            cursor++;
            switch (input[cursor]) {
                case 's': {
                    cursor++;
                    const Ns = parseFloat(input.slice(cursor).trim());
                    return { type: 'Ns-spec-shiny', value: Ns };
                }

                case 'i': {
                    cursor++;
                    const Ni = parseFloat(input.slice(cursor).trim());
                    return { type: 'Ni-optical-density', value: Ni };
                }
            }
            return { type: 'empty', value: '\0' };
        }

        case 'K': {
            cursor++;
            switch (input[cursor]) {
                case 'a': {
                    cursor++;
                    const rest = input.slice(cursor).trim();
                    const numbers = rest.split(' ').map(n => parseFloat(n.trim()));
                    return {
                        type: 'Ka-ambient-color',
                        value: [numbers[0], numbers[1], numbers[2]],
                    }
                }

                case 'd': {
                    cursor++;
                    const rest = input.slice(cursor).trim();
                    const numbers = rest.split(' ').map(n => parseFloat(n.trim()));
                    return {
                        type: 'Kd-diffuse-color',
                        value: [numbers[0], numbers[1], numbers[2]],
                    }
                }

                case 's': {
                    cursor++;
                    const rest = input.slice(cursor).trim();
                    const numbers = rest.split(' ').map(n => parseFloat(n.trim()));
                    return {
                        type: 'Ks-specular-color',
                        value: [numbers[0], numbers[1], numbers[2]],
                    }
                }

                case 'e': {
                    cursor++;
                    const rest = input.slice(cursor).trim();
                    const numbers = rest.split(' ').map(n => parseFloat(n.trim()));
                    return {
                        type: 'Ke-emmisive-color',
                        value: [numbers[0], numbers[1], numbers[2]],
                    }
                }
            }
            return { type: 'empty', value: '\0' };
        }
    }

    return { type: 'empty', value: '\0' };
}
