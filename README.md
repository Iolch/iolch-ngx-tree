# IolchNgxTree

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Tree usage

This tree component its useful when you have a multilevel tree, that needs to have different templates for each level.

#### Properties
|    |  Name        | Type           | Description  |
|  ---- | ------------- |:-------------:| -----:|
| Property |  config        | NgxTreeConfig<T>           | The config of the tree, where the data should be passed  |
|  Event  |  search | (search: string) => void | The function that should be called to trigger a search  |



#### NgxTreeConfig<T>

| Name        | Type           | Description  |
 ------------- |:-------------:| -----:|
|  nodes  | T[]           | An array of nodes to be desplayed  |
|  includeAscendantsOnSearch  |  boolean | Determines whether ascendants should appear on search  |
|  searchFormatter  |  (data: string) => string | Determines another way of making the search |


# Events


## Tree declaration

If you have a structure that looks like this:

```
interface Root {
  description: string;
  child?: Child[];
}

interface Child {
  description: string;
  leaf: Leaf[];
}

interface Leaf {
  description: string;
}
```

Your tree would translate to something like this:

```
<ngx-tree [config]="config">
  <ng-template ngxTreeLevel let-root> {{ root.description }} </ng-template>
  
  <ng-template ngxTreeLevel name="child" let-child> {{ child.description }} </ng-template>

  <ng-template ngxTreeLevel name="songs" let-leaf> {{leaf.description}} </ng-template>
</ngx-tree>
```

## Adding search to the tree

The tree component has a method search, to use it, just add the property searchableBy on each level that you want to be searchable.

```
<ngx-tree [config]="config">
  <ng-template ngxTreeLevel searchableBy="description" let-root> {{ root.description }} </ng-template>
  
  <ng-template ngxTreeLevel searchableBy="description" name="child" let-child> {{ child.description }} </ng-template>
  
  <ng-template ngxTreeLevel searchableBy="description" name="songs" let-leaf> {{leaf.description}} </ng-template>

  <ng-template ngxEmptySearch> Nothing found </ng-template>
</ngx-tree>
```

Then, just call the search function

```
<input type="text" (input)="ngxTree.search(input.value)" #input>
```

![image](https://github.com/Iolch/iolch-ngx-tree/assets/42042614/8993ac5c-e1e8-4976-a292-cbe85c16ca87)
