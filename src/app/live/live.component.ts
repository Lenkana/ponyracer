import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/groupBy';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/bufferToggle';

import { RaceService } from '../race.service';
import { RaceModel } from '../models/race.model';
import { PonyWithPositionModel } from '../models/pony.model';

@Component({
  selector: 'pr-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit, OnDestroy {

  poniesWithPosition: PonyWithPositionModel[] = [];
  raceModel: RaceModel;
  error: boolean;
  winners: PonyWithPositionModel[] = [];
  betWon: boolean;
  clickSubject: Subject<PonyWithPositionModel> = new Subject();
  positionSubscription: Subscription;

  constructor(private raceService: RaceService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.raceModel = this.route.snapshot.data['race'];

    if (this.raceModel.status !== 'FINISHED') {
      this.positionSubscription = this.raceService.live(this.raceModel.id)
        .subscribe(positions => {
          this.poniesWithPosition = positions;
          this.raceModel.status = 'RUNNING';
        },
        error => this.error = true,
        () => {
            this.raceModel.status = 'FINISHED';
            this.winners = this.poniesWithPosition.filter(pony => pony.position >= 100);
            this.betWon = this.winners.some(winner => winner.id === this.raceModel.betPonyId);
          });
    }

    this.clickSubject.groupBy(pony => pony.id, pony => pony.id)
      .mergeMap(obs => obs.bufferToggle(obs, () => Observable.interval(1000)))
      .filter(array => array.length >= 5)
      .throttleTime(1000)
      .map(array => array[0])
      .switchMap(ponyId => this.raceService.boost(this.raceModel.id, ponyId).catch(() => Observable.empty()))
      .subscribe(() => {});
  }

  ngOnDestroy(): void {
    if (this.positionSubscription) {
      this.positionSubscription.unsubscribe();
    }
  }

  onClick(pony: PonyWithPositionModel) {
    this.clickSubject.next(pony);
  }

  ponyById(index: number, pony: PonyWithPositionModel): number {
    return pony.id;
  }

}
