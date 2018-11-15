import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { XwingJsonDataService } from './xwing-json-data.service';
import { configureTestbed } from '../app.test-config';

describe('XwingJsonDataService', () => {
  let injector: TestBed;
  let service: XwingJsonDataService;
  let httpMock: HttpTestingController;
  let test_manifest = {
    "version": "1.1.0",
    "damagedecks": [
      "data/damage-decks/core.json"
    ],
    "ships": [
      "data/ships/ships.json"
    ],
    "pilots": [
      {
        "faction": "rebelalliance",
        "ships": [
          "data/pilots/rebel-alliance/a-sf-01-b-wing.json",
          "data/pilots/rebel-alliance/arc-170-starfighter.json"
        ]
      },
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

  let test_bwing_data = {
    "name": "A/SF-01 B-wing",
    "xws": "asf01bwing",
    "ffg": 17,
    "size": "Small",
    "dial": [
      "1ER",
      "1TR",
      "1BB",
      "1FB",
      "1NB",
      "1YR",
      "1RR",
      "2TW",
      "2BW",
      "2FB",
      "2NW",
      "2YW",
      "2KR",
      "3BR",
      "3FB",
      "3NR",
      "4FR"
    ],
    "faction": "Rebel Alliance",
    "stats": [
      { "arc": "Front Arc", "type": "attack", "value": 3 },
      { "type": "agility", "value": 1 },
      { "type": "hull", "value": 4 },
      { "type": "shields", "value": 4 }
    ],
    "actions": [
      {
        "difficulty": "White",
        "linked": { "difficulty": "Red", "type": "Barrel Roll" },
        "type": "Focus"
      },
      { "difficulty": "White", "type": "Lock" },
      { "difficulty": "White", "type": "Barrel Roll" }
    ],
    "pilots": [
      {
        "name": "Blade Squadron Veteran",
        "initiative": 3,
        "limited": 0,
        "cost": 44,
        "xws": "bladesquadronveteran",
        "text": "A unique gyrostabilization system surrounds the B-wing's cockpit, ensuring that the pilot always remains stationary during flight.",
        "image": "https://sb-cdn.fantasyflightgames.com/card_images/Card_Pilot_25.png",
        "slots": [
          "Talent",
          "Sensor",
          "Cannon",
          "Cannon",
          "Torpedo",
          "Modification"
        ],
        "artwork": "https://sb-cdn.fantasyflightgames.com/card_art/Card_art_XW_P_25.jpg",
        "ffg": 25
      },
      {
        "name": "Blue Squadron Pilot",
        "initiative": 2,
        "limited": 0,
        "cost": 42,
        "xws": "bluesquadronpilot",
        "text": "Due to its heavy weapons array and resilient shielding, the B-wing has solidified itself as the Rebel Alliance's most innovative assault fighter.",
        "image": "https://sb-cdn.fantasyflightgames.com/card_images/Card_Pilot_26.png",
        "slots": ["Sensor", "Cannon", "Cannon", "Torpedo", "Modification"],
        "alt": [
          {
            "image": "https://images-cdn.fantasyflightgames.com/filer_public/a4/a6/a4a6943b-6af3-4d33-9a04-bff98190d3ee/g18x3-blue-squadron-pilot-2.png",
            "source": "Season Three 2018"
          }
        ],
        "artwork": "https://sb-cdn.fantasyflightgames.com/card_art/Card_art_XW_P_26.jpg",
        "ffg": 26
      },
      {
        "name": "Braylen Stramm",
        "caption": "Blade Leader",
        "initiative": 4,
        "limited": 1,
        "cost": 50,
        "xws": "braylenstramm",
        "ability": "While you defend or perform an attack, if you are stressed, you may reroll up to 2 of your dice.",
        "image": "https://sb-cdn.fantasyflightgames.com/card_images/Card_Pilot_23.png",
        "slots": [
          "Talent",
          "Sensor",
          "Cannon",
          "Cannon",
          "Torpedo",
          "Modification"
        ],
        "artwork": "https://sb-cdn.fantasyflightgames.com/card_art/Card_art_XW_P_23.jpg",
        "ffg": 23
      },
      {
        "name": "Ten Numb",
        "caption": "Blue Five",
        "initiative": 4,
        "limited": 1,
        "cost": 50,
        "xws": "tennumb",
        "ability": "While you defend or perform an attack, you may spend 1 stress token to change all of your [Focus] results to [Evade] or [Hit] results.",
        "image": "https://sb-cdn.fantasyflightgames.com/card_images/Card_Pilot_24.png",
        "slots": [
          "Talent",
          "Sensor",
          "Cannon",
          "Cannon",
          "Torpedo",
          "Modification"
        ],
        "artwork": "https://sb-cdn.fantasyflightgames.com/card_art/Card_art_XW_P_24.jpg",
        "ffg": 24
      }
    ]
  };

  beforeEach(() => { 
    configureTestbed();
    injector = getTestBed();
    service = injector.get(XwingJsonDataService);
    httpMock = injector.get(HttpTestingController);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should find all files of a given extension in a json', () => {
    
    let generated_queue = service.create_file_list(test_manifest, ".json");
    expect(generated_queue.length).toEqual(10);
  });

  it ('should mangle names', () => {
    expect(service.mangle_name('t-65-x-wing')).toEqual('t65xwing');
    expect(service.mangle_name('modified yt-1300')).toEqual('modifiedyt1300');
  });
  
  it ('should mangle JSON urls to friendly key names', () => {
    expect(service.url_to_key_name('https://github.com/data/t-65-xwing.json')).toEqual('t65xwing');
  });

  it ('should insert JSON data given a filename', () => {
    service.data = test_manifest;
    service.insert_json_data("data/pilots/rebel-alliance/a-sf-01-b-wing.json", test_bwing_data);
    expect(service.data.pilots[0].ships[0].pilots[0].xws).toBeTruthy();
  });

});
