import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flight-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flight-results.component.html',
  styleUrls: ['./flight-results.component.scss']
})
export class FlightResultsComponent implements OnInit {
  @Input() flights: any[] = []; // Accept flights data via Input property
  // @Output() bookFlight = new EventEmitter<any>(flights: any[] }>(););
  @Output() bookFlight = new EventEmitter<{ showBooking: boolean; flights: any[] }>(); // Emit loading state and flights
  
  currentPage: number = 1;
  pageSize: number = 5; // Show 5 flights per page
  selectedSort: string = ''; // Track selected sorting criterion

  // constructor(private router: Router) {}
  constructor(private router: Router, private route: ActivatedRoute) {}

  // Getter to calculate total pages based on flights and page size
  get totalPages(): number {
    return Math.ceil(this.flights.length / this.pageSize);
  }

  // Method to format the departure date as UTC
  formatDepartureDate(dateString: string): string {
    // const date = new Date(dateString); // Convert string to Date object
    // Format it to a readable string

    const date = new Date(dateString); // Convert string to Date object
    const date1 = new Date(date.toUTCString().replace('GMT', '').trim()); // Returns a formatted string without GMT
    // Format to a readable string without the time
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date1.toLocaleDateString('en-US', options); // Returns a formatted string without time
  }


  // Method to format time strings to a user-friendly format
  formatTime(timeString: string): string {
    const date = new Date(`1970-01-01T${timeString}Z`);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  // Method to get flights for the current page with formatted times
  get paginatedFlights(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.flights.slice(startIndex, endIndex).map(flight => ({
      ...flight,
      departureTimeFormatted: this.formatTime(flight.departure_time),
      arrivalTimeFormatted: this.formatTime(flight.arrival_time),
    }));
  }

  // Method to go to the next page
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Method to go to the previous page
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const flightsData = params['flights'];
      if (flightsData) {
        this.flights = JSON.parse(flightsData);  // Parse the JSON string back into an array
      } else {
        console.warn('No flight data received in FlightResultsComponent');
      }
      console.log('Flights received in FlightResultsComponent:', this.flights); 
    });

    // console.log('Flights received in FlightResultsComponent:', this.flights); // Debugging line
    // console.log(this.flights)
    // Optionally handle flights data initialization here if needed
  }

  // Sort flights based on the selected criteria
  sortFlights(criteria: string) {
    this.selectedSort = criteria; // Update the selected sort criterion
    switch (criteria) {
      case 'cheapest':
        this.flights.sort((a, b) => a.flight_price - b.flight_price);
        break;
      case 'fastest':
        this.flights.sort((a, b) => {
          const aDuration = this.parseDuration(a.duration);
          const bDuration = this.parseDuration(b.duration);
          return aDuration - bDuration;
        });
        break;
      case 'bestValue':
        this.flights.sort((a, b) => {
          const aValue = a.flight_price / this.parseDuration(a.duration);
          const bValue = b.flight_price / this.parseDuration(b.duration);
          return aValue - bValue;
        });
        break;
    }
    this.currentPage = 1; // Reset to the first page after sorting
    this.paginatedFlights; // Reapply pagination
  }

  // Function to convert duration string to total minutes
  parseDuration(duration: string): number {
    const [hours, minutes] = duration.split('H').map(part => part.replace('M', '').trim());
    return (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);
  }

  goToBooking(flight: any) {
    // console.log('Navigating to booking for flight:', flight); // Debugging line
    // this.router.navigate(['/booking'], { queryParams: { flightId: flight } });
    this.router.navigate(['/booking'], { queryParams: { flights: JSON.stringify(flight) } });

    // this.selectFlight.emit(flight);
    // this.bookFlight.emit(flight); // Emit the selected flight for booking
    this.bookFlight.emit({ showBooking: true, flights: flight });

  }
}
