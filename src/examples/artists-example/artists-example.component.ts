import { Component } from '@angular/core';

import { NgxTreeConfig } from 'src/components/tree';

interface Artist {
  name: string;
  albums?: Album[];
}

interface Album {
  name: string;
  songs: Song[];
}

interface Song {
  title: string;
  duration: string;
}

@Component({
  selector: 'artists-example',
  templateUrl: './artists-example.component.html',
  styleUrls: ['./artists-example.component.scss'],
})
export class ArtistsExampleComponent {
  protected config: NgxTreeConfig<Artist>;

  constructor() {
    this.config = {
      includeAscendantsOnSearch: true,
      nodes: [
        {
          name: "Sylvia Sky",
          albums: [
            {
              name: "Eclipse of Dreams",
              songs: [
                {
                  title: "Starlight Serenade",
                  duration: "3:30"
                },
                {
                  title: "Moonlit Sonata",
                  duration: "4:15"
                }
              ]
            },
            {
              name: "Whispers in the Cosmos",
              songs: [
                {
                  title: "Galactic Echoes",
                  duration: "2:45"
                },
                {
                  title: "Celestial Voyage",
                  duration: "5:00"
                }
              ]
            }
          ]
        },
        {
          name: "Max Mirage",
          albums: [
            {
              name: "Electric Dreams",
              songs: [
                {
                  title: "Neon Nights",
                  "duration": "3:10"
                },
                {
                  title: "Synthetic Stardust",
                  "duration": "4:30"
                }
              ]
            },
            {
              name: "Cybernetic Serenity",
              songs: [
                {
                  title: "Techno Twilight",
                  duration: "2:15"
                },
                {
                  title: "Digital Dreamscape",
                  duration: "6:00"
                }
              ]
            }
          ]
        }
      ]
    }
    
  }
}
