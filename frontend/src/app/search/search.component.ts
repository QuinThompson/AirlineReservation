import { Component, OnInit, EventEmitter, Output, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AxiosService } from '../services/axios.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FeaturedDestinationsComponent } from '../featured-destinations/featured-destinations.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, FeaturedDestinationsComponent],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  countries: any[] = [];

  activeButton: string = 'Roundtrip';
  fromCountry: string = '';
  toCountry: string = '';
  guests: number | null = null;
  departDate: string = '';
  returnDate: string = '';
  showfeatured: boolean = true;

  constructor(private axiosService: AxiosService, private http: HttpClient, private router: Router, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.loadCountries();
  }

  // Loads the list of countries from the Axios service and sorts them alphabetically
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

  // Sets the active button for the type of trip (Roundtrip or One Way)
  setActive(button: string) {
    this.activeButton = button;
  }

  // Handles the search action by sending the selected parameters to the backend
  onSearch() {
    const searchParams = {
      from_country: this.fromCountry,
      to_country: this.toCountry,
      guests: this.guests,
      departDate: this.departDate,
      return_date: this.returnDate,
    };

    this.http.post('http://localhost:3003/api/flights/search', searchParams)
      .subscribe(
        (response: any) => {
          this.router.navigate(['/flight-results'], { queryParams: { flights: JSON.stringify(response) } });
        },
        error => {
          console.error('Error fetching flight results:', error);
        }
      );
  }

  openDatePicker(event: Event, dateField: 'departDate' | 'returnDate') {
    const input = event.target as HTMLInputElement;
    const tempInput = this.renderer.createElement('input');
    this.renderer.setAttribute(tempInput, 'type', 'date');

    // Set value to existing date if available
    if (this[dateField]) {
      tempInput.value = this[dateField];
    }

    tempInput.style.visibility = 'hidden';
    tempInput.style.position = 'absolute';
    input.parentNode!.insertBefore(tempInput, input);

    tempInput.focus();

    // Capture selected date and assign it to the appropriate field
    tempInput.addEventListener('change', () => {
      this[dateField] = tempInput.value;
      input.value = tempInput.value.split('-').reverse().join('/'); // Format as dd/mm/yyyy
      tempInput.remove();
    });
  }
}
