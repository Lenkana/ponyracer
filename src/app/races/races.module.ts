import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { RaceComponent } from '../race/race.component';
import { RacesComponent } from './races.component';
import { PendingRacesComponent } from './pending-races/pending-races.component';
import { FinishedRacesComponent } from './finished-races/finished-races.component';
import { PonyComponent } from '../pony/pony.component';
import { BetComponent } from '../bet/bet.component';
import { LiveComponent } from '../live/live.component';
import { FromNowPipe } from '../from-now.pipe';
import { RaceService } from '../race.service';
import { RaceResolverService } from '../race-resolver.service';
import { RacesResolverService } from '../races-resolver.service';
import { RACES_ROUTES } from './races.routes';

@NgModule({
  declarations: [
    RaceComponent,
    RacesComponent,
    PendingRacesComponent,
    FinishedRacesComponent,
    PonyComponent,
    BetComponent,
    LiveComponent,
    FromNowPipe
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(RACES_ROUTES),
    SharedModule
  ],
  providers: [
    RaceService,
    RaceResolverService,
    RacesResolverService
  ]
})
export class RacesModule { }
