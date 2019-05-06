import { Component, OnInit } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Platform } from '@ionic/angular';
import { XwingImportService } from '../services/xwing-import.service';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})
export class QrPage implements OnInit {
  isCordova: boolean = false;
  scanning: boolean = false;

  constructor(private qrScanner: QRScanner,
              private importService: XwingImportService,
              private platform: Platform) { }

  ngOnInit() {
    this.isCordova = this.platform.is('cordova');
    if (this.isCordova) {
    }
  }

  
  cordovaQrScan() {
    this.scanning = true;
    this.qrScanner.prepare().then(
      (status: QRScannerStatus) => {
        if (status.authorized) {
          return this.qrScanner.show();
        }
        throw Error('QRScanner not authorized');
      }
    ).then(
      (status: QRScannerStatus) => {
        let qrsub = this.qrScanner.scan().subscribe(
          async (text: string) => {
            qrsub.unsubscribe();
            this.qrScanner.destroy();
            this.scanning = false;
            // Save to import service?
            /*
            let uuid = await this.presentXwsModal(text);
            if (uuid) {
              this.router.navigateByUrl(this.squadronRoute(uuid));
            }
            */
          },
          (error) => {
            console.log("QRScanner error", error);
          },
          () => {
            this.qrScanner.destroy();
            this.scanning = false;
          }
        )
      }
    ).catch(
      (error) => {
        console.log("QRScanner error", error);
      }
    )
  }

  cordovaQrStop() {
    this.qrScanner.destroy();
    this.scanning = false;
  }


}
