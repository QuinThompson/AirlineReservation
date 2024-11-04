import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DestinationService {  // Make sure this class is named DestinationService
  private destinationsUrl = 'assets/data/destinations.json';

  constructor(private http: HttpClient) {}

  getDestinations(): Observable<any> {
    return this.http.get<any>(this.destinationsUrl);
  }
}
