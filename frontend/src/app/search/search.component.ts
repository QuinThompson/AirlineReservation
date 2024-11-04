import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AxiosService } from '../services/axios.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  countries: any[] = [];
  @Output() searchClicked = new EventEmitter<{ loading: boolean; flights: any[] }>(); // Emit loading state and flights
  activeButton: string = 'Roundtrip';
  fromCountry: string = '';
  toCountry: string = '';
  // guests: number = 0;
  guests: number | null = null; // Initialize guests to null

  departDate: string = '';
  returnDate: string = '';

  constructor(private axiosService: AxiosService, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadCountries();
  }

  loadCountries() {
    this.axiosService.getAllCountries()
      .then(response => {
        this.countries = response.data;
        this.countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
      });
  }

  setActive(button: string) {
    this.activeButton = button;
  }

  // Method to handle search button click
  onSearch() {
    const searchParams = {
      from_country: this.fromCountry,
      to_country: this.toCountry,
      guests: this.guests,
      departDate: this.departDate,
      return_date: this.returnDate,
    };

    console.log('Search params:', searchParams);
    
    // Emit loading state as true
    this.searchClicked.emit({ loading: true, flights: [] });
    
    // Make the HTTP request to the Flask backend
    this.http.post('http://localhost:3003/api/flights/search', searchParams)
      .subscribe(
        (response: any) => {
          console.log('Flight results:', response);
          
          // Emit loading state as false after getting results
          this.searchClicked.emit({ loading: false, flights: response });
          
          // Navigate to the flight results component with the response data
          // Note: You may not need this navigation if you're already displaying results in AppComponent
          this.router.navigate(['/flight-results'], { state: { flights: response } });
        },
        error => {
          console.error('Error fetching flight results:', error);
          this.searchClicked.emit({ loading: false, flights: [] }); // Emit loading state as false on error
        }
      );
  }
}
