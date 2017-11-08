import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';

import { environment } from '../environments/environment';
import { UserModel } from './models/user.model';
import { JwtInterceptorService } from './jwt-interceptor.service';
import { WsService } from './ws.service';

@Injectable()
export class UserService {
  userEvents: BehaviorSubject<UserModel> = new BehaviorSubject(undefined);

  constructor(private client: HttpClient, private jwt: JwtInterceptorService, private ws: WsService) {
    this.retrieveUser();
  }

  register(login: string, password: string, birthYear: number): Observable<UserModel> {
    return this.client.post<UserModel>(`${environment.baseUrl}/api/users`,
      {login, password, birthYear}
    );
  }

  authenticate(credentials: {login: string; password: string}): Observable<UserModel> {
    return this.client.post<UserModel>(`${environment.baseUrl}/api/users/authentication`, credentials)
      .do((user: UserModel) => this.userEvents.next(user))
      .do((user: UserModel) => this.storeLoggedInUser(user));
  }

  storeLoggedInUser(user: UserModel): void {
    this.userEvents.next(user);
    window.localStorage.setItem('rememberMe', JSON.stringify(user));
    this.jwt.setJwtToken(user.token);
  }

  retrieveUser(): void {
    const user = window.localStorage.getItem('rememberMe');
    if (user) {
      const parsedUser = <UserModel>JSON.parse(user);
      this.userEvents.next(parsedUser);
      this.jwt.setJwtToken(parsedUser.token);
    }
  }

  logout(): void {
    this.userEvents.next(null);
    window.localStorage.removeItem('rememberMe');
    this.jwt.removeJwtToken();
  }

  scoreUpdates(userId: number): Observable<UserModel> {
    return this.ws.connect(`/player/${userId}`);
  }

  isLoggedIn(): boolean {
    return !!window.localStorage.getItem('rememberMe');
  }

}
