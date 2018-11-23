import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-movement-chart',
  templateUrl: './movement-chart.component.html',
  styleUrls: ['./movement-chart.component.scss']
})
export class MovementChartComponent implements OnInit {
  dial: string[];
  name: string;
  chart: any[] = new Array(7);
  map: any = {
    "O" : { name: "stop", index: 2 },
    "F" : { name: "straight", index: 2 },
    "B" : { name: "bankleft", index: 1 },
    "N" : { name: "bankright", index: 3 },
    "T" : { name: "turnleft", index: 0 },
    "Y" : { name: "turnright", index: 4 },
    "K" : { name: "kturn", index: 5 },
    "S" : { name: "reversestraight", index: 2 },
    "E" : { name: "trollleft", index: 5 },
    "R" : { name: "trollright", index: 6 },
    "L" : { name: "sloopleft", index: 5 },
    "P" : { name: "sloopright", index: 6 },
    "A" : { name: "reversebankleft", index: 1 },
    "D" : { name: "reversebankright", index: 3 } 
  }

  hasManeuvers(row: any) : boolean {
    let maneuvers = row.maneuvers;
    for (let cell of maneuvers) {
      if (cell) {
        return true;
      }
    }
    return false;
  }

  constructor() { }

  ngOnInit() {
    for (let i = 0; i < 8; i++) {
      let speed = (7 - i) - 2;
      this.chart[i] = { speed: speed, maneuvers: new Array(7) };
    }
    this.dial.forEach(
      (maneuverCode: string) => {
        let difficulty = "white";
        if (maneuverCode[2] == 'R') {
          difficulty = "red"
        }
        if (maneuverCode[2] == 'B') {
          difficulty = "blue"
        }
        let index = this.map[maneuverCode[1]].index;
        let name = this.map[maneuverCode[1]].name;
        let speed = parseInt(maneuverCode[0]);
        let speedRow: any = null;
        for (let row of this.chart) {
          if (row.speed == speed) {
            speedRow = row;
          }
        }
        let maneuver = { name: name, difficulty: difficulty };
        speedRow.maneuvers[index] = maneuver;
      }
    )
  }
}
