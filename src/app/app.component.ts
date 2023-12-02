import { Component } from '@angular/core';

import { NgxTreeConfig } from 'src/components/tree';

interface Teacher {
  name: string;
  classes: Classes[];
}

interface Classes {
  name: string;
  hours: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  protected config: NgxTreeConfig<Teacher>;

  constructor() {
    this.config = {
      nodes: [
        {
          name: 'John',
          classes: [
            {
              name: 'Introduction to functional programming',
              hours: 180,
            }
          ]
        }
      ],
    }
  }
}
