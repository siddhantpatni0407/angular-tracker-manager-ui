import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { Observable } from 'rxjs';
import { API_URLS } from '../constants/api.constants'; // Import API_URLS

@Injectable({
  providedIn: 'root', // Provided in the root injector
})
export class AuthService {
  constructor(private http: HttpClient) {} // Inject HttpClient

  register(user: { name: string; email: string; mobileNumber: string; password: string; role: string }): Observable<any> {
    return this.http.post(API_URLS.REGISTER, user); // Use API_URLS.REGISTER
  }
}