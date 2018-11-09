import { TestBed } from '@angular/core/testing';
import { XwingJsonDataService } from './xwing-json-data.service';

describe('XwingJsonDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({
  }));

  it('should unpack a manifest into json downloads', () => {
    var test_manifest = {
      "version": "1.1.0",
      "damagedecks": [
        "data/damage-decks/core.json"
      ],
      "ships": [
        "data/ships/ships.json"
      ],
      "pilots": [
        {
          "faction": "resistance",
          "ships": [
            "data/pilots/resistance/mg-100-starfortress-sf-17.json",
            "data/pilots/resistance/scavenged-yt-1300.json",
          ]
        },
        {
          "faction": "firstorder",
          "ships": [
            "data/pilots/first-order/tie-silencer.json",
            "data/pilots/first-order/tie-fo-fighter.json",
          ]
        }
      ],
      "upgrades": [
        "data/upgrades/astromech.json",
        "data/upgrades/cannon.json",
      ],
      "conditions": "data/conditions/conditions.json"
    };
    let generated_queue = XwingJsonDataService.create_file_list(test_manifest, ".json");
    expect(generated_queue.length).toEqual(9);
  });
});
