import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RaceModel } from '../models/race.model';
import { RaceService } from '../race.service';

@Component({
  selector: 'pr-races',
  templateUrl: './races.component.html',
  styleUrls: ['./races.component.css']
})
export class RacesComponent implements OnInit {

  constructor(public raceService: RaceService) {}

  ngOnInit() {
  }
}
