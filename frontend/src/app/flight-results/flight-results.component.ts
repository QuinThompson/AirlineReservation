import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
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
  @Input() flights: any[] = [];
  @Output() bookFlight = new EventEmitter<{ showBooking: boolean; flights: any[] }>();
  
  currentPage: number = 1;
  pageSize: number = 5;
  selectedSort: string = '';

  constructor(private router: Router, private route: ActivatedRoute) {}

  // Gets the total number of pages based on the number of flights and page size
  get totalPages(): number {
    return Math.ceil(this.flights.length / this.pageSize);
  }

  // Formats the departure date into a readable string
  formatDepartureDate(dateString: string): string {
    const date = new Date(dateString);
    const date1 = new Date(date.toUTCString().replace('GMT', '').trim());
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date1.toLocaleDateString('en-US', options);
  }

  // Formats time strings into a user-friendly format
  formatTime(timeString: string): string {
    const date = new Date(`1970-01-01T${timeString}Z`);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  // Returns a paginated list of flights for the current page
  get paginatedFlights(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.flights.slice(startIndex, endIndex).map(flight => ({
      ...flight,
      departureTimeFormatted: this.formatTime(flight.departure_time),
      arrivalTimeFormatted: this.formatTime(flight.arrival_time),
    }));
  }

  // Advances to the next page of results
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Goes back to the previous page of results
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Initializes the component and retrieves flight data from query parameters
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const flightsData = params['flights'];
      if (flightsData) {
        this.flights = JSON.parse(flightsData);
      } else {
        console.warn('No flight data received in FlightResultsComponent');
      }
      console.log('Flights received in FlightResultsComponent:', this.flights);
    });
  }

  // Sorts the flights based on the selected criteria
  sortFlights(criteria: string) {
    this.selectedSort = criteria;
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
    this.currentPage = 1;
    this.paginatedFlights;
  }

  // Parses the duration string to calculate total minutes
  parseDuration(duration: string): number {
    const [hours, minutes] = duration.split('H').map(part => part.replace('M', '').trim());
    return (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);
  }

  // Navigates to the booking page for a selected flight
  goToBooking(flight: any) {
    this.router.navigate(['/booking'], { queryParams: { flights: JSON.stringify(flight) } });
    this.bookFlight.emit({ showBooking: true, flights: flight });
  }
}
