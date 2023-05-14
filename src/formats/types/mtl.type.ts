import { Vec3 } from "../../gl/types/uniform.type";

export type MTLLine = 
    | EmptyLine
    | CommentLine
    | NewMatLine
    | SpecShinyLine
    | AmbientColorLine
    | DiffuseColorLine
    | SpecColorLine
    | EmissiveColorLine
    | OpticalDensityLine
    | DissolveLine
    | IllumLine;

export type EmptyLine = {
    type: 'empty';
    value: '\0';
};

type CommentLine = {
    type: 'comment';
    value: string;
}

export type NewMatLine = {
    type: 'new-material',
    value: string;
};

export type SpecShinyLine = {
    type: 'Ns-spec-shiny';
    value: number;
}

export type AmbientColorLine = {
    type: 'Ka-ambient-color';
    value: Vec3;
};

export type DiffuseColorLine = {
    type: 'Kd-diffuse-color';
    value: Vec3;
};

export type SpecColorLine = {
    type: 'Ks-specular-color';
    value: Vec3;
};

export type EmissiveColorLine = {
    type: 'Ke-emmisive-color';
    value: Vec3;
};

export type OpticalDensityLine = {
    type: 'Ni-optical-density';
    value: number;
};

export type DissolveLine = {
    type: 'dissolve';
    value: number;
}

export type IllumLine = {
    type: 'illum';
    value: number;
};

export type ObjMaterial = {
    shininess: number;
    ambient: Vec3;
    diffuse: Vec3;
    specular: Vec3;
    emissive: Vec3;
    opticalDensity: number;
    opacity: number;
    illum: number;
}

export type MtlFile = {
    materials: Record<string, ObjMaterial>;
}

