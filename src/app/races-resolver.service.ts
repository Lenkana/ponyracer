import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { RaceModel } from './models/race.model';
import { RaceService } from './race.service';

@Injectable()
export class RacesResolverService implements Resolve<RaceModel[]> {

  constructor(private raceService: RaceService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): RaceModel[] | Observable<RaceModel[]> | Promise<RaceModel[]> {
    const status = route.routeConfig.path;
    return this.raceService.list(status.toUpperCase());
  }
}
