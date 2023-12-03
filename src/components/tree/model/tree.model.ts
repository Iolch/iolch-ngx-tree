import { TemplateRef } from "@angular/core";
import { Subject, debounceTime, filter, map, tap } from "rxjs";

import { formatString } from "src/utils";

export interface SearchEvent {
    search: string;
    showAscendants: boolean;
}
export interface NgxTreeConfig<T> {
    nodes: T[];
    showAscendantsOnSearch?: boolean;
};

export class TreeLevel {
    public readonly name: string;
    public readonly index: number;
    public readonly searchProperty: string;
    public readonly template: TemplateRef<any>;

    constructor(data: any){
        this.index = data.index;
        this.template = data.template;
        this.name = data.name ?? 'root';
        this.searchProperty = data.searchProperty ?? '';
    }

    public static getDescendantLevel(levels: TreeLevel[], level: TreeLevel): TreeLevel {
        return levels[level.index + 1];
    }

    public static getRootLevel(levels: TreeLevel[]) {
        return levels[0];
    }
}

export interface TreeNode {
    ascendant?: TreeNode;
    relativeIndex: number;
    level: TreeLevel;
    item: any;
}


export class FlatTree {
    private _nodes: TreeNode[];
    private levels: TreeLevel[];
    private _filtered?: TreeNode[];
    public readonly search: Subject<SearchEvent>;

    constructor(levels: TreeLevel[]) {
        this._nodes = [];
        this.levels = levels;
        this.search = new Subject<SearchEvent>();
        
        this.initEvents();
    }

    public set nodes(nodes: any[]) {
        this.toFlatTree(nodes, TreeLevel.getRootLevel(this.levels));
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
            filter(({search}: SearchEvent) => !!search),
            map(({search, showAscendants}: SearchEvent) => ({showAscendants, search: formatString(search)}))
            ).subscribe(({search, showAscendants}: SearchEvent) => {
                const filtered = this._nodes.filter((node: TreeNode) => formatString(node.item[node.level.searchProperty]).includes(search));

                if(showAscendants){
                    const filteredWithAscendants: TreeNode[] = [];
                    filtered.forEach((node: TreeNode) => this.addAscendantNode(node, filteredWithAscendants));
                    this._filtered = filteredWithAscendants;
                }else {
                    this._filtered = filtered;
                }
        });
    }

    private toFlatTree(nodes: any[], level: TreeLevel, ascendant?: TreeNode){
        nodes.forEach((node: any, relativeIndex) => this.addNode(node, relativeIndex, level, ascendant));
    }
    
    private addNode(item: any, relativeIndex: number, level: TreeLevel, ascendant?: TreeNode){
        const node = {item, relativeIndex, level, ascendant}
        this._nodes.push(node);

        const descendantLevel = TreeLevel.getDescendantLevel(this.levels, level);
        const childNode = node.item[descendantLevel?.name];

        if(childNode){
            this.toFlatTree(childNode, descendantLevel, node);
        }
    }

    private addAscendantNode(node: TreeNode, nodes: TreeNode[]): void {
        const { ascendant } = node;
        if(ascendant && !nodes.includes(ascendant)){
            this.addAscendantNode(ascendant, nodes);
        }

        nodes.push(node);
    }
}