import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, HttpClientModule],  // Add HttpClientModule here
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  @Input() flight: any;
  @Input() formGroup: any[] = [];

  taxes: number = 0.0;
  taxesFeesPercentage: number = 15;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const flightsData = params['flights'];
      const formData = params['formdata'];

      if (flightsData) {
        this.flight = JSON.parse(flightsData);
      } else {
        console.warn('No flight data received in PaymentComponent');
      }

      if (formData) {
        this.formGroup = JSON.parse(formData);
      } else {
        console.warn('No form data received in PaymentComponent');
      }
      console.log('Form: ', this.formGroup, 'Flight: ', this.flight);
    });
  }

  formatDepartureDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  calculateTaxesFees(price: number): number {
    const flightPrice = this.flight.flight_price;
    const taxes = flightPrice * (this.taxesFeesPercentage / 100);
    return parseFloat(taxes.toFixed(2));
  }

  onPaymentSubmit(): void {
    console.log('All forms are valid. Proceeding to create booking...');

    const requestData = {
      flight_id: this.flight,
      passengers: this.formGroup
    };
    console.log('Request data:', requestData);
    this.http.post('http://localhost:3003/api/bookings', requestData).subscribe(
      (response: any) => {
        console.log('Booking created:', response);
        this.router.navigate(['/confirmation'], {
          queryParams: {
            booking_reference: response.booking_reference,
            flights: JSON.stringify(response.flight_id),
            passengers: JSON.stringify(response.passengers)
          }
        });
      },
      (error: any) => {
        console.error('Error creating booking:', error);
      }
    );
  }
}
