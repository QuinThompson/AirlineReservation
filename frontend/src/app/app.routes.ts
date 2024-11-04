import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component'; // Adjust import path
import { BookingComponent } from './booking/booking.component'; // Adjust path as necessary
import { FlightResultsComponent } from './flight-results/flight-results.component'; // Adjust import path

export const routes: Routes = [
    { path: 'search', component: SearchComponent },
    { path: 'flight-results', component: FlightResultsComponent },
    { path: 'booking', component: BookingComponent },
    // { path: '', redirectTo: '/search', pathMatch: 'full' },
];
