import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { RaceModel } from '../models/race.model';
import { RaceService } from '../race.service';
import { PonyModel } from '../models/pony.model';

@Component({
  selector: 'pr-bet',
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.css']
})
export class BetComponent implements OnInit {

  raceModel: RaceModel;
  betFailed = false;

  constructor(private route: ActivatedRoute, private raceService: RaceService) { }

  ngOnInit(): void {
    this.raceModel = this.route.snapshot.data['race'];
  }

  betOnPony(pony: PonyModel): void {
    if (this.isPonySelected(pony)) {
      this.raceService.cancelBet(this.raceModel.id)
      .subscribe(
        () => this.raceModel.betPonyId = null,
        () => this.betFailed = true
      );
    } else {
      this.raceService.bet(this.raceModel.id, pony.id)
      .subscribe(
        (race: RaceModel) => this.raceModel.betPonyId = race.betPonyId,
        () => this.betFailed = true
      );
    }
  }

  isPonySelected(pony: PonyModel): boolean {
    return +pony.id === this.raceModel.betPonyId;
  }
}
