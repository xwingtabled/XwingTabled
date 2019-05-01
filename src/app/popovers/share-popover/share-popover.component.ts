import { Component, OnInit, ViewChild } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { NgZone } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'share-popover',
  templateUrl: './share-popover.component.html',
  styleUrls: ['./share-popover.component.scss']
})
export class SharePopoverComponent implements OnInit {
  squadronUUID: string;
  qrcode: string = "";
  @ViewChild('url') url;

  constructor(private popoverController: PopoverController, 
              private ngZone: NgZone,
              private toastController: ToastController) { }

  ngOnInit() {
    this.qrcode = "https://xwingtabled.github.io/squadron/" + this.squadronUUID;
  }

  async copy() {
    this.url.nativeElement.select();
    document.execCommand('copy');

    const toast = await this.toastController.create({
      message: 'Copied URL to clipboard',
      duration: 1000,
      position: 'middle'
    });
    return toast.present();
  }

}
