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


  // bookingReference: string = '';
  bookingDetails: any; // You can create an interface for stronger typing

  // constructor(private http: HttpClient) {}

  searchBooking() {
    console.log('Searching for booking with reference:', this.bookingReference);
    // if (this.bookingReference) {
    //   this.http.get(`/api/bookings/${this.bookingReference}`).subscribe(
    //     (data) => {
    //       this.bookingDetails = data; // Assign the retrieved data to bookingDetails
    //     },
    //     (error) => {
    //       console.error('Error fetching booking details', error);
    //     }
    //   );
    // } else {
    //   alert('Please enter a booking reference number.');
    // }
    // console.log('Request data:', requestData);
    if (this.bookingReference) {
      this.http.get(`http://localhost:3003/api/bookings/${this.bookingReference}`).subscribe(
        (response: any) => {
          console.log('Booking created:', response);
          this.bookingDetails = response;  // Assign the response data to bookingDetails
          console.log('Booking details:', this.bookingDetails);

          // this.router.navigate(['/confirmation'], {
          //   queryParams: {
          //     booking_reference: response.booking_reference,
          //     flights: JSON.stringify(response.flight_id),
          //     passengers: JSON.stringify(response.passengers)
          //   }
          // });
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