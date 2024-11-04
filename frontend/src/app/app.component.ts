import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SearchComponent } from './search/search.component';
import { BookingComponent } from './booking/booking.component'; // Adjust path as necessary
import { FeaturedDestinationsComponent } from './featured-destinations/featured-destinations.component';
import { FlightResultsComponent } from './flight-results/flight-results.component'; // Import FlightResultsComponent

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, SearchComponent, FeaturedDestinationsComponent, FlightResultsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Frontend';
  showFlightResults: boolean = false; // Track whether to show FlightResults
  loading: boolean = false; // Track loading state
  flights: any[] = []; // Declare flights property

  // Method to handle search click
  onSearch(loading: boolean, flightsData: any[]) {
    this.loading = loading; // Set loading state based on the search process
    if (!loading) {
      this.flights = flightsData; // Set the flight data received
      this.showFlightResults = true; // Show results after loading is done
    }
  }
}
