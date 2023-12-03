import { TemplateRef } from "@angular/core";
import { Subject, debounceTime, filter, map, tap } from "rxjs";

export interface SearchEvent {
    search: string;
    showAscendants: boolean;
}
export interface NgxTreeConfig<T> {
    nodes: T[];
    showAscendantsOnSearch?: boolean;
};

export interface TreeLevel {
    template: TemplateRef<any>;
    searchProperty?: string;
    property: string;
    index: number;
}

export interface TreeNode {
    ascendant?: TreeNode;
    // treeLevel: TreeLevel;
    level: TreeLevel;
    index: number;
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
        this.toFlatTree(nodes, this.getTreeLevel(0));
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
            map(({search, showAscendants}: SearchEvent) => ({showAscendants, search: this.formatSearch(search)}))
        ).subscribe(({search, showAscendants}: SearchEvent) => {
            const filtered = this._nodes.filter((node: TreeNode) => {
                const property = node.level.searchProperty ?? '';
                const filter = this.formatSearch(node.item[property]);
                return filter.includes(search)
            });

            if(!showAscendants){
                this._filtered = filtered;
                return;
            }

            const filteredWithAscendants: TreeNode[] = [];
            filtered.forEach((node: TreeNode) => this.addAscendantNode(node, filteredWithAscendants));
            this._filtered = filteredWithAscendants;
        });
    }

    private toFlatTree(nodes: any[], level: TreeLevel, ascendant?: TreeNode){
        nodes.forEach((node: any, index) => this.addNode(node, index, level, ascendant));
    }
    
    private addNode(item: any, index: number, level: TreeLevel, ascendant?: TreeNode){
        const node = {item, index, level, ascendant}
        this._nodes.push(node);

        const next = this.getTreeLevel(level.index + 1);
        const child = node.item[next.property];

        if(child){
            this.toFlatTree(child, next, node);
        }
    }

    private addAscendantNode(node: TreeNode, nodes: TreeNode[]): void {
        const { ascendant } = node;

        if(ascendant && !nodes.includes(ascendant)){
            this.addAscendantNode(ascendant, nodes);
        }

        nodes.push(node);
    }

    private getTreeLevel(level: number): TreeLevel {
        return this.levels[level] ?? {};
    }

    private formatSearch(search: string): string {
        return search.toLowerCase().trim();
    }
}