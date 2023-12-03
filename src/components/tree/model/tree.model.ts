import { TemplateRef } from "@angular/core";
import { Observable, Subject, debounceTime, filter, iif, map, of, switchMap, tap } from "rxjs";

import { stringFormatter } from "src/utils";

export class SearchEvent {
    public readonly search: string;
    public readonly includeAscendants: boolean;
    public readonly formatter: (data: string) => string;

    constructor(data: any) {
        this.formatter = data?.formatter ?? stringFormatter;
        this.includeAscendants = data.includeAscendants ?? false;
        this.search = this.formatter(data.search);
    }
}

export interface NgxTreeConfig<T> {
    nodes: T[];
    includeAscendantsOnSearch?: boolean;
    searchFormatter?: (data: string) => string;
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

    public static getDescendantsLevel(levels: TreeLevel[], level: TreeLevel): TreeLevel {
        return levels[level.index + 1];
    }

    public static getRootLevel(levels: TreeLevel[]) {
        return levels[0];
    }
}

export class TreeNode {
    public readonly item: any;
    public readonly level: TreeLevel;
    public readonly ascendant?: TreeNode;
    public readonly relativeIndex: number;

    constructor(data: any){
        this.item = data.item;
        this.level = data.level;
        this.ascendant = data.ascendant;
        this.relativeIndex = data.relativeIndex;
    }
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
        const $filtered = (event: SearchEvent) : Observable<TreeNode[]> => of(this.matchNodesToSearch(event));

        const $filteredWithAscendants = (event: SearchEvent) : Observable<TreeNode[]> => {
            const filteredWithAscendants: TreeNode[] = [];
            this.matchNodesToSearch(event).forEach((node: TreeNode) => this.addAscendantNode(node, filteredWithAscendants));
            return of(filteredWithAscendants);
        }

        this.search.pipe(
            debounceTime(300),
            tap(() => delete this._filtered),
            filter(({search}: SearchEvent) => !!search),
            switchMap((event: SearchEvent) => iif(() => event.includeAscendants, $filteredWithAscendants(event), $filtered(event)))
            ).subscribe((filtered: TreeNode[]) => this._filtered = filtered);
    }

    private toFlatTree(nodes: any[], level: TreeLevel, ascendant?: TreeNode){
        nodes.forEach((node: any, relativeIndex) => this.addNode(node, relativeIndex, level, ascendant));
    }
    
    private matchNodesToSearch(event: SearchEvent): TreeNode[] {
        const {formatter, search} = event;
        return this._nodes.filter((node: TreeNode) => formatter(node.item[node.level.searchProperty]).includes(search));
    }

    private addNode(item: any, relativeIndex: number, level: TreeLevel, ascendant?: TreeNode){
        const node = new TreeNode({item, relativeIndex, level, ascendant});
        this._nodes.push(node);

        const descendantsLevel = TreeLevel.getDescendantsLevel(this.levels, level);
        const children = node.item[descendantsLevel?.name];

        if(children){
            this.toFlatTree(children, descendantsLevel, node);
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