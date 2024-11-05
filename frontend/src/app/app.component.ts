import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SearchComponent } from './search/search.component';
import { BookingComponent } from './booking/booking.component';
import { FeaturedDestinationsComponent } from './featured-destinations/featured-destinations.component';
import { FlightResultsComponent } from './flight-results/flight-results.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, SearchComponent, FeaturedDestinationsComponent, FlightResultsComponent, BookingComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Frontend';
  showFlightResults: boolean = false;
  flights: any[] = [];
  showBooking: boolean = false;

  constructor(private router: Router) {}

  onSearch(loading: boolean, flightsData: any[]) {
    if (loading) {
      this.showFlightResults = false;
    } else {
      console.log('Received flight data:', flightsData);
      this.flights = flightsData;
      this.showFlightResults = true;
    }
  }

  onBookFlight(flight: any) {
    console.log('Booking flight:', flight);
    this.showFlightResults = false;
    this.showBooking = true;
  }
}
