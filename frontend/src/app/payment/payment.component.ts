import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  @Input() flight: any;
  @Input() formGroup: any[] = [];
 
  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private fb: FormBuilder) {}

  // paymentForm: FormGroup = this.fb.group({});
  paymentForm!: FormGroup;

  submitted = false;
  taxes: number = 0.0;
  taxesFeesPercentage: number = 15;


  ngOnInit(): void {
    
    this.paymentForm = this.fb.group({
        cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],  // Requires exactly 16 digits
        expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])/[0-9]{2}$')]],  // Format MM/YY
        cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]],  // Requires exactly 3 digits
        nameOnCard: ['', Validators.required]
    });

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

  // Formats the departure date to a more readable string
  formatDepartureDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  // Calculates the taxes and fees based on the flight price
  calculateTaxesFees(price: number): number {
    const flightPrice = this.flight.flight_price;
    const taxes = flightPrice * (this.taxesFeesPercentage / 100);
    return parseFloat(taxes.toFixed(2));
  }

  // Handles the submission of the payment form
  onPaymentSubmit(): void {
    // if (this.paymentForm.invalid) {
    //   // Mark all controls as touched to trigger validation messages
    //   this.paymentForm.markAllAsTouched();
    //   return; // Prevent further action if form is invalid
    // }


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
