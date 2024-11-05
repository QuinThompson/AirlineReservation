import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SearchComponent } from './search/search.component';
import { BookingComponent } from './booking/booking.component'; // Adjust path as necessary
import { FeaturedDestinationsComponent } from './featured-destinations/featured-destinations.component';
import { FlightResultsComponent } from './flight-results/flight-results.component'; // Import FlightResultsComponent

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, SearchComponent, FeaturedDestinationsComponent, FlightResultsComponent,BookingComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Frontend';
  showFlightResults: boolean = false; // Initially hide flight results
  flights: any[] = []; // Store flight data
  showBooking: boolean = false; // Control the visibility of booking component

  constructor(private router: Router) {}

  // Method to handle search click
  onSearch(loading: boolean, flightsData: any[]) {
    if (loading) {
      this.showFlightResults = false; // You can also show a loading spinner here if needed
    } else {
      console.log('Received flight data:', flightsData); // Debugging log to see what data is received
      this.flights = flightsData; // Store the flight data
      this.showFlightResults = true; // Show flight results
      // this.router.navigate(['/flight-results'], { state: { flights: flightsData } });

    }
  }
  onBookFlight(flight: any) {
    console.log('Booking flight:', flight); // Debugging line
    console.log('Booking component is visible:', this.showBooking); // Debugging line
    this.showFlightResults = false; // Hide flight results
    this.showBooking = true; // Show booking component
  }
}
