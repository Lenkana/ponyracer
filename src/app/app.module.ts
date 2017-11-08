import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, PreloadAllModules } from '@angular/router';
import * as Webstomp from 'webstomp-client';

import { ROUTES } from './app.routes';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';
import { UserService } from './user.service';
import { WsService } from './ws.service';
import { LoggedInGuard } from './logged-in.guard';
import { JwtInterceptorService } from './jwt-interceptor.service';
import { WEBSOCKET, WEBSTOMP } from './app.tokens';

export function webSocketFactory() {
  return WebSocket;
}
export function webstompFactory() {
  return Webstomp;
}

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, { preloadingStrategy: PreloadAllModules })
  ],
  providers: [
    UserService,
    JwtInterceptorService,
    WsService,
    LoggedInGuard,
    { provide: HTTP_INTERCEPTORS, useExisting: JwtInterceptorService, multi: true},
    { provide: WEBSOCKET, useFactory: webSocketFactory},
    { provide: WEBSTOMP, useFactory: webstompFactory}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
