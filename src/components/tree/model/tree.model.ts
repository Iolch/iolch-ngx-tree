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
    index: number;
    name: string;
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
                const searchProperty = node.level.searchProperty ?? '';
                return this.formatSearch(node.item[searchProperty]).includes(search);
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
        nodes.forEach((node: any, relativeIndex) => this.addNode(node, relativeIndex, level, ascendant));
    }
    
    private addNode(item: any, relativeIndex: number, level: TreeLevel, ascendant?: TreeNode){
        const node = {item, relativeIndex, level, ascendant}
        this._nodes.push(node);

        const descendantLevel = this.getTreeLevel(level.index + 1);
        const childNode = node.item[descendantLevel.name];

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

    private getTreeLevel(level: number): TreeLevel {
        return this.levels[level] ?? {};
    }

    private formatSearch(search: string): string {
        return search.toLowerCase().trim();
    }
}