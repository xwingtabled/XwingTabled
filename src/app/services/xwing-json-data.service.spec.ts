import { TestBed, getTestBed } from '@angular/core/testing';
import { File } from '@ionic-native/file/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { XwingJsonDataService } from './xwing-json-data.service';

describe('XwingJsonDataService', () => {
  let injector: TestBed;
  let service: XwingJsonDataService;
  let httpMock: HttpTestingController;

  beforeEach(() => { 
    TestBed.configureTestingModule({
      providers: [ File ],
      imports: [ IonicStorageModule.forRoot(), HttpClientTestingModule ]  
    });
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

  it ('should sequentially download a list of files', () => {
    let mock_urls = ['file1', 'file2', 'file3'];
    let downloaded_data = [ ];
    service.download_urls(['file1', 'file2', 'file3']).subscribe(
      (data) => {
        downloaded_data.push(data);
      }
    );

    // Flush each of the mocked URLs
    mock_urls.forEach(
      (url) => {
        let req = httpMock.expectOne(url);
        expect(req.request.method).toBe("GET");
        // Return the mock url as downloaded content
        req.flush(url);
      }
    )

    // Downloaded data should be [ 'file1', 'file2', 'file3' ]
    let equivalence = true;
    for (var i in mock_urls) {
      equivalence = equivalence && mock_urls[i] == downloaded_data[i];
    }
    expect(equivalence).toEqual(true);
  });
});
