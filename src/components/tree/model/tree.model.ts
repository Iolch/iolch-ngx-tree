import { TemplateRef } from "@angular/core";

export interface NgxTreeConfig<T> {
    nodes: T[];
};

export interface TreeLevel {
    template: TemplateRef<any>;
    property: string;
}

export class FlatTree {
    private levels: TreeLevel[];
    private _nodes: any[];

    constructor(levels: TreeLevel[]) {
        this.levels = levels;
        this._nodes = [];
    }

    public set nodes(nodes: any[]) {
        this.toFlatTree(nodes);
    }

    public get nodes(): any[] {
        return this._nodes;
    }
    
    private toFlatTree(nodes: any[], level = 0){
        nodes.forEach((node: any) => this.addNode(node, level));
    }
    
    private addNode(node: any, level = 0){
        this._nodes.push({...node, template: this.getTemplate(level), level});

        const next = level + 1;
        const child = node[this.getProperty(next)];

        if(child){
            this.toFlatTree(child, next);
        }
    }

    private getTemplate(level: number): TemplateRef<any> {
        const {template} = this.levels[level] ?? {};
        return template;
    }

    private getProperty(level: number): string {
        const {property} = this.levels[level] ?? {};
        return property;
    }
}