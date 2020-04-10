import { AttributeLink, Link } from "../graph/graph-links";
import { GraphChild, GraphChildList } from "../graph/graph-decorators";

import { Accessor } from "./accessor";
import { Element } from "./element";
import { Material } from "./material";
import { NOT_IMPLEMENTED } from "../constants";
import { Root } from "./root";

export class Mesh extends Element {
    @GraphChildList private primitives: Link<Mesh, Primitive>[] = [];

    public addPrimitive(primitive: Primitive): Mesh {
        return this.addGraphChild(this.primitives, this.graph.link(this, primitive) as Link<Root, Primitive>) as Mesh;
    }

    public removePrimitive(primitive: Primitive): Mesh {
        return this.removeGraphChild(this.primitives, primitive) as Mesh;
    }

    public listPrimitives(): Primitive[] {
        return this.primitives.map((p) => p.getRight());
    }
}

export class Primitive extends Element {
    private mode: GLTF.MeshPrimitiveMode = GLTF.MeshPrimitiveMode.TRIANGLES;
    // TODO(donmccurdy): Kinda feeling like I want an accessors array and a semantics array.
    // private attributeSemantics: {[key: string]: number} = {};
    // private targetSemantics: {[key: string]: number}[] = [];
    // private targets: AttributeMap[] = [];
    // private targetNames: string[] = [];

    @GraphChild private indices: Link<Primitive, Accessor> = null;
    @GraphChildList private attributes: AttributeLink[] = [];
    // @GraphChildList private targets: AttributeLink[][] = [];
    @GraphChild private material: Link<Primitive, Material> = null;

    public getIndices(): Accessor {
        return this.indices ? this.indices.getRight() : null;
    }
    public setIndices(indices: Accessor): Primitive {
        this.indices = this.graph.link(this, indices) as Link<Primitive, Accessor>;
        return this;
    }
    public getAttribute(semantic: string): Accessor {
        const link = this.attributes.find((link) => link.semantic === semantic);
        return link ? link.getRight() : null;
    }
    public setAttribute(semantic: string, accessor: Accessor): Primitive {
        const link = this.graph.linkAttribute(this, accessor) as AttributeLink;
        link.semantic = semantic;
        return this.addGraphChild(this.attributes, link) as Primitive;
    }

    public listAttributes(): Accessor[] {
        return this.attributes.map((link) => link.getRight());
    }

    public listTargets(): Accessor[][] {
        throw NOT_IMPLEMENTED;
    }
    public listTargetNames(): string[] {
        throw NOT_IMPLEMENTED;
     }
    public getMaterial(): Material { return this.material.getRight(); }
    public setMaterial(material: Material): Primitive {
        this.material = this.graph.link(this, material) as Link<Primitive, Material>;
        return this;
    }
    public getMode(): GLTF.MeshPrimitiveMode { return this.mode; }
    public setMode(mode: GLTF.MeshPrimitiveMode): Primitive {
        this.mode = mode;
        return this;
    }
}

class Attribute {
    private semantic: string = '';
    @GraphChild private accessor: Link<Primitive, Accessor> = null;
    public getSemantic(): string { return this.semantic; }
    public getAccessor(): Accessor { return this.accessor.getRight(); }
}