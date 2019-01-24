import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { type } from 'os';

@Component({
  selector: 'assign-id-popover',
  templateUrl: './assign-id-popover.component.html',
  styleUrls: ['./assign-id-popover.component.scss']
})
export class AssignIdPopoverComponent implements OnInit {
  id: string | number =  "";
  numericId: number;
  alphabeticId: string;
  idType: string;

  constructor(private popoverController: PopoverController) { 
  }

  async assignId() {
    return this.popoverController.dismiss(
      this.idType == "numbers" ? this.numericId : this.alphabeticId.toLocaleUpperCase()
    );
  }

  ngOnInit() {
    if (typeof(this.id) != "string") {
      this.numericId = this.id;
      this.idType = "numbers";
    } else {
      this.alphabeticId = this.id;
      this.idType = "letters";
    }
  }
}
