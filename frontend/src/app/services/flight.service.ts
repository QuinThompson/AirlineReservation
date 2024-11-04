import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private apiUrl = 'http://localhost:3003/api/flight';

  constructor(private http: HttpClient) {}

  getFlights(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  searchFlights(from: string, to: string, date: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?from=${from}&to=${to}&date=${date}`);
  }

  private flightsSource = new BehaviorSubject<any[]>([]);
  flights$ = this.flightsSource.asObservable();

  updateFlights(flights: any[]) {
    this.flightsSource.next(flights);
  }

}
