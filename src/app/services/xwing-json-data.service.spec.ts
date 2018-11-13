import { TestBed, getTestBed } from '@angular/core/testing';
import { IonicStorageModule } from '@ionic/storage';
import { HttpProvider } from '../providers/http.provider';
import { HttpAngularProvider } from '../providers/http-angular.provider';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { XwingJsonDataService } from './xwing-json-data.service';
import { Events, Platform } from '@ionic/angular';
import { configureTestbed } from '../app.test-config';

describe('XwingJsonDataService', () => {
  let injector: TestBed;
  let service: XwingJsonDataService;
  let httpMock: HttpTestingController;

  beforeEach(() => { 
    configureTestbed();
    injector = getTestBed();
    service = injector.get(XwingJsonDataService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

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



  it ('should mangle names', () => {
    expect(XwingJsonDataService.mangle_name('t-65-x-wing')).toEqual('t65xwing');
    expect(XwingJsonDataService.mangle_name('modified yt-1300')).toEqual('modifiedyt1300');
  });

  it ('should mangle JSON urls to friendly key names', () => {
    expect(XwingJsonDataService.url_to_key_name('https://github.com/data/t-65-xwing.json')).toEqual('t65xwing');
  });

});
