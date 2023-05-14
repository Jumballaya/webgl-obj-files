import { Object3D } from "./Object3D";


export class Group extends Object3D {

    private childList: Array<Object3D> = [];

    constructor(children: Array<Object3D>) {
        super(children[0].geometry, children[0].material);
        this.childList = children.slice(1);
    }

    get length(): number {
        return this.children.length;
    }

    get children(): Array<Object3D> {
        return this.childList;
    }
}
