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
}

export interface TreeNode {
    template: TemplateRef<any>;
    ascendant?: TreeNode;
    index: number;
    level: number;
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
            filter(({search}: SearchEvent) => !!search),
            map(({search, showAscendants}: SearchEvent) => ({showAscendants, search: this.formatSearch(search)}))
        ).subscribe(({search, showAscendants}: SearchEvent) => {
            const filtered = this._nodes.filter((node: TreeNode) => {
                const property = this.getSearchProperty(node.level);
                const filter = property ? this.formatSearch(node.item[property]) : '';
                return filter.includes(search)
            });

            if(showAscendants){
                const filteredWithAscendants: TreeNode[] = [];
                filtered.forEach((node: TreeNode) => this.addAscendantNode(node, filteredWithAscendants));
                this._filtered = filteredWithAscendants;
            }else {
                this._filtered = filtered;
            }
            
            console.log('_filtered', this._filtered );
        });
    }

    private addAscendantNode(node: TreeNode, nodes: TreeNode[]): void {
        const { ascendant } = node;

        if(ascendant && nodes.findIndex((item) => item === ascendant) === -1){
            this.addAscendantNode(ascendant, nodes);
        }

        nodes.push(node);
    }
    
    private toFlatTree(nodes: any[], level = 0, ascendant?: TreeNode){
        nodes.forEach((node: any, index) => this.addNode(node, index, level, ascendant));
    }
    
    private addNode(item: any, index: number, level = 0, ascendant?: TreeNode){
        const node = {item, template: this.getTemplate(level), index, level, ascendant}
        this._nodes.push(node);

        const next = level + 1;
        const child = node.item[this.getProperty(next)];

        if(child){
            this.toFlatTree(child, next, node);
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