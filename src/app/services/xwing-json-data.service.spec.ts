import { TestBed, getTestBed } from '@angular/core/testing';
import { File } from '@ionic-native/file/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { XwingJsonDataService } from './xwing-json-data.service';
import { Events } from '@ionic/angular';

describe('XwingJsonDataService', () => {
  let injector: TestBed;
  let service: XwingJsonDataService;
  let httpMock: HttpTestingController;

  beforeEach(() => { 
    TestBed.configureTestingModule({
      providers: [ 
        File,
        Events
      ],
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
      (response) => {
        downloaded_data.push(response.body);
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

  it ('should mangle names', () => {
    expect(XwingJsonDataService.mangle_name('t-65-x-wing')).toEqual('t65xwing');
    expect(XwingJsonDataService.mangle_name('modified yt-1300')).toEqual('modifiedyt1300');
  });

  it ('should mangle JSON urls to friendly key names', () => {
    expect(XwingJsonDataService.url_to_key_name('https://github.com/data/t-65-xwing.json')).toEqual('t65xwing');
  });

  it ('should transfer queued download items that are completed to downloaded list', () => {
    service.queued = [ 'file1', 'file2', 'file3' ];
    service.downloaded = [ ];
    service.mark_download_complete('file2');
    expect(service.downloaded.length).toEqual(1);
    expect(service.queued.length).toEqual(2);
  });
});
