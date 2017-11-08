import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { environment } from '../environments/environment';
import { RaceModel } from './models/race.model';
import { PonyWithPositionModel } from './models/pony.model';
import { WsService } from './ws.service';

@Injectable()
export class RaceService {

  constructor(private http: HttpClient, private ws: WsService) { }

  list(status: string): Observable<RaceModel[]> {
    const params = new HttpParams().set('status', status.toUpperCase());
    return this.http.get<RaceModel[]>(`${environment.baseUrl}/api/races`, { params });
  }

  bet(raceId: number, ponyId: number): Observable<RaceModel> {
    return this.http.post<RaceModel>(`${environment.baseUrl}/api/races/${raceId}/bets`, {ponyId});
  }

  get(id: number): Observable<RaceModel> {
    return this.http.get<RaceModel>(`${environment.baseUrl}/api/races/${id}`);
  }

  cancelBet(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<HttpResponse<any>>(`${environment.baseUrl}/api/races/${id}/bets`);
  }

  live(raceId: number): Observable<PonyWithPositionModel[]> {
    // return Observable.interval(1000)
    //   .take(101)
    //   .map(position => {
    //     return <PonyWithPositionModel[]>[{
    //       id: 1,
    //       name: 'Superb Runner',
    //       color: 'BLUE',
    //       position: (position * 0.5)
    //     }, {
    //       id: 5,
    //       name: 'Awesome Fridge',
    //       color: 'GREEN',
    //       position: (position * 0.55)
    //     }, {
    //       id: 3,
    //       name: 'Great Bottle',
    //       color: 'ORANGE',
    //       position: (position * 0.6)
    //     }, {
    //       id: 4,
    //       name: 'Little Flower',
    //       color: 'YELLOW',
    //       position: (position * 0.75)
    //     }, {
    //       id: 5,
    //       name: 'Nice Rock',
    //       color: 'PURPLE',
    //       position: (position * 1.1)
    //     }];
    //   });
      return this.ws.connect(`/race/${raceId}`)
        .takeWhile(race => race.status !== 'FINISHED')
        .map(ponies => ponies.ponies);
  }

  boost(raceId: number, ponyId: number) {
    return this.http.post<RaceModel>(`${environment.baseUrl}/api/races/${raceId}/boosts`, {ponyId});
  }
}
