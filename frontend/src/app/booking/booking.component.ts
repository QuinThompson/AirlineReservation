import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  // @Input() flightId: any; // Accept flight data via Input property
  @Input() flights: any; // Accept flights data via Input property

  passengerFormArray: FormArray;
  passengerForms: FormGroup[] = []; // Array to hold multiple passenger forms


  currentPage: number = 0; // Track the current page
  totalGuests: number = 1; // Set to the number of guests
  page_tracker: number = 0; // Track the current page

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router) {
    this.passengerFormArray = this.fb.array([]);
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const flightsData = params['flights'];
      if (flightsData) {
        this.flights = JSON.parse(flightsData);  // Parse the JSON string back into an array
      } else {
        console.warn('No flight data received in BookingComponent');
      }
      console.log('Flights received in BookingComponent:', this.flights); 
    });
    // Set totalGuests based on flightData if available
    // console.log('Total Guests:', this.flights.guests);

    if (this.flights && this.flights.guests) {
      this.totalGuests = this.flights.guests;
    }

    // Initialize the form array based on the number of guests
    this.initializePassengerForms(this.totalGuests);
  }

  // Create a form group for each passenger and add to the form array
  initializePassengerForms(guestCount: number) {
    for (let i = 0; i < guestCount; i++) {
      this.passengerFormArray.push(this.createPassengerForm());
    }
  }

  createPassengerForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      passportNumber : ['', Validators.required]
    });
  }

  // Method to get the form group for the current page
  get currentPassengerForm(): FormGroup {
    return this.passengerFormArray.at(this.currentPage) as FormGroup;
  }

  // Pagination logic
  nextPage() {
    if (this.currentPage < this.totalGuests - 1) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  onContinue() {
    if (this.currentPassengerForm.valid) {
      this.passengerForms.push(this.currentPassengerForm.value);
      console.log('Passenger Data for Page:', this.currentPage + 1, this.currentPassengerForm.value);
      this.nextPage(); // Proceed to the next form or handle submission
      // this.currentPage + 1;
      this.page_tracker = this.page_tracker + 1;
    } else {
      console.warn('Form is invalid');
    }

    if (this.page_tracker === this.totalGuests) {
      console.log(this.page_tracker, this.totalGuests)
      console.log('All forms are valid. Proceed to checkout.');
      console.log('Passenger Data:', this.passengerForms);
      
      this.router.navigate(['/payment'], { queryParams: { formdata: JSON.stringify(this.passengerForms), flights: JSON.stringify(this.flights) } });
      
    }
  }
}
