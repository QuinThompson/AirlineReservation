import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bookingsearch',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule],
  templateUrl: './bookingsearch.component.html',
  styleUrl: './bookingsearch.component.scss'
})
export class BookingsearchComponent {
  bookingReference: string = '';

  constructor(private route: ActivatedRoute,  private fb: FormBuilder, private router: Router, private http: HttpClient) {
  }

  bookingDetails: any;

  searchBooking() {
    console.log('Searching for booking with reference:', this.bookingReference);
    if (this.bookingReference) {
      this.http.get(`http://localhost:3003/api/bookings/${this.bookingReference}`).subscribe(
        (response: any) => {
          console.log('Booking created:', response);
          this.bookingDetails = response; 
          console.log('Booking details:', this.bookingDetails);
        },
        (error: any) => {
          console.error('Error creating booking:', error);
        }
      );
    }
  }

  formatDepartureDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }
}
