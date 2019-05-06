import { Component, OnInit } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Platform } from '@ionic/angular';
import { XwingImportService } from '../services/xwing-import.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})
export class QrPage implements OnInit {
  isCordova: boolean = false;
  devices: any[] = [];
  currentDevice: number = 0;

  constructor(private qrScanner: QRScanner,
              private importService: XwingImportService,
              private platform: Platform,
              private location: Location) { }

  ngOnInit() {
    this.isCordova = this.platform.is('cordova');
    if (this.isCordova) {
      this.cordovaQrScan();
    }
  }

  
  cordovaQrScan() {
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
  }

  toggleCamera() {
    if (this.devices.length < 2) {
      return;
    }
    if (this.currentDevice == 0) {
      this.currentDevice = 1;
    } else {
      this.currentDevice = 0;
    }
  }

  camerasFoundHandler($event) {
    this.devices = $event;
  }

  scanSuccessHandler($event) {
    this.importService.qrData = $event;
  }

  cancel() {
    this.location.back();
  }
}
