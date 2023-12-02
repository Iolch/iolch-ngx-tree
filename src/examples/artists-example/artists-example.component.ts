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
  name: string;
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
      nodes: [
        {
          name: "Sylvia Sky",
          albums: [
            {
              name: "Eclipse of Dreams",
              songs: [
                {
                  name: "Starlight Serenade",
                  duration: "3:30"
                },
                {
                  name: "Moonlit Sonata",
                  duration: "4:15"
                }
              ]
            },
            {
              name: "Whispers in the Cosmos",
              songs: [
                {
                  name: "Galactic Echoes",
                  duration: "2:45"
                },
                {
                  name: "Celestial Voyage",
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
                  name: "Neon Nights",
                  "duration": "3:10"
                },
                {
                  name: "Synthetic Stardust",
                  "duration": "4:30"
                }
              ]
            },
            {
              name: "Cybernetic Serenity",
              songs: [
                {
                  name: "Techno Twilight",
                  duration: "2:15"
                },
                {
                  name: "Digital Dreamscape",
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
