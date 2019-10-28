import { Component, OnInit, Input } from '@angular/core';
import { faCaretSquareUp as faCaretSquareUpSolid, 
          faSquareFull  } from '@fortawesome/free-solid-svg-icons';
import { faCaretSquareUp, faSquare } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'formation-position',
  templateUrl: './formation-position.component.html',
  styleUrls: ['./formation-position.component.scss']
})
export class FormationPositionComponent implements OnInit {
  @Input() position: string;
  @Input() filled: boolean = false;

  faCaretSquareUpSolid: any = faCaretSquareUpSolid;
  faCaretSquareUp: any = faCaretSquareUp;
  faSquare: any = faSquare;
  faSquareFull: any = faSquareFull;

  constructor() { }

  ngOnInit() {
  }

}
