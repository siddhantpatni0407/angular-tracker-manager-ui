import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_URLS } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private vehicles$ = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {
    this.loadVehicles(); // Fetch vehicles automatically on service initialization
  }

  private loadVehicles(): void {
    this.http.get<any>(API_URLS.FETCH_ALL_VEHICLE_ENDPOINT).subscribe(response => {
      if (response.status === 'SUCCESS' && Array.isArray(response.data)) {
        this.vehicles$.next(response.data);
      } else {
        this.vehicles$.next([]);
      }
    });
  }

  getVehicles(): Observable<any[]> {
    return this.vehicles$.asObservable();
  }
}
