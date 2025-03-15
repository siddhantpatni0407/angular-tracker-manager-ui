import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS } from '../constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  register(user: { name: string; email: string; mobileNumber: string; password: string; role: string }): Observable<any> {
    return this.http.post(API_URLS.USER_REGISTRATION_ENDPOINT, user);
  }

  // ✅ Updated login method to accept a single object
  login(loginPayload: { email: string; password: string }): Observable<any> {
    return this.http.post(API_URLS.USER_LOGIN_ENDPOINT, loginPayload);
  }
}