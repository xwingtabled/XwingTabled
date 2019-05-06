import { Component, OnInit } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Platform } from '@ionic/angular';
import { XwingImportService } from '../services/xwing-import.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})
export class QrPage implements OnInit {
  isCordova: boolean = false;
  devices: any[] = [];
  currentDevice: number = 0;
  canChangeCamera: boolean = false;

  constructor(private qrScanner: QRScanner,
              private importService: XwingImportService,
              private platform: Platform,
              private location: Location,
              private router: Router) { }

  ngOnInit() {
    this.isCordova = this.platform.is('cordova');
    if (this.isCordova) {
      this.cordovaQrScan();
    }
  }
  
  ionViewWillLeave() {
    if (this.isCordova) {
      this.qrScanner.destroy();
    }
  }

  cordovaQrScan() {
    this.qrScanner.prepare().then(
      (status: QRScannerStatus) => {
        this.canChangeCamera = status.canChangeCamera;
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
            this.importService.qrData = text;
            this.router.navigateByUrl("/add");
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

  toggleWebCamera() {
    if (this.currentDevice == 0) {
      this.currentDevice = 1;
    } else {
      this.currentDevice = 0;
    }
  }

  toggleCordovaCamera() {
    this.toggleWebCamera();
    this.qrScanner.useCamera(this.currentDevice).then(
      (status) => {

      },
      (error) => {
        this.currentDevice = 0;
        this.qrScanner.useCamera(this.currentDevice);
      }
    )
  }


  camerasFoundHandler($event) {
    this.devices = $event;
  }

  scanSuccessHandler($event) {
    this.importService.qrData = $event;
    this.router.navigateByUrl("/add");
  }

  cancel() {
    this.location.back();
  }
}
