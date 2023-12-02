import { TemplateRef } from "@angular/core";
import { Subject, debounceTime, filter, map, tap } from "rxjs";

export interface NgxTreeConfig<T> {
    nodes: T[];
};

export interface TreeLevel {
    template: TemplateRef<any>;
    searchProperty?: string;
    property: string;
}

export interface TreeNode {
    template: TemplateRef<any>;
    index: number;
    level: number;
    item: any;
}


export class FlatTree {
    private _nodes: TreeNode[];
    private levels: TreeLevel[];
    private _filtered?: TreeNode[];
    public readonly search: Subject<string>;

    constructor(levels: TreeLevel[]) {
        this._nodes = [];
        this.levels = levels;
        this.search = new Subject<string>();
        
        this.initEvents();
    }

    public set nodes(nodes: any[]) {
        this.toFlatTree(nodes);
    }

    public get nodes(): TreeNode[] {
        return this._nodes;
    }

    public get filtered(): TreeNode[] | undefined {
        return this._filtered;
    }

    private initEvents(): void {
        this.search.pipe(
            debounceTime(300),
            tap(() => delete this._filtered),
            filter((search: string) => !!search),
            map((filter: string) => this.formatSearch(filter))
        ).subscribe((filter: string) => {
            this._filtered = this._nodes.filter((node: TreeNode) => {
                const property = this.getSearchProperty(node.level);
                const search = property ? this.formatSearch(node.item[property]) : '';
                return search.includes(filter)
            });
        });
    }
    
    private toFlatTree(nodes: any[], level = 0){
        nodes.forEach((node: any, index) => this.addNode(node, index, level));
    }
    
    private addNode(node: any, index: number, level = 0){
        this._nodes.push({item: node, template: this.getTemplate(level), index, level});

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

    private getSearchProperty(level: number): string | undefined {
        const {searchProperty} = this.levels[level] ?? {};
        return searchProperty;
    }

    private formatSearch(search: string): string {
        return search.toLowerCase().trim();
    }
}