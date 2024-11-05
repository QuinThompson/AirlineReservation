import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { BookingComponent } from './booking/booking.component';
import { FlightResultsComponent } from './flight-results/flight-results.component';
import { PaymentComponent } from './payment/payment.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { BookingsearchComponent } from './bookingsearch/bookingsearch.component';

export const routes: Routes = [
    { path: 'search', component: SearchComponent },
    { path: 'flight-results', component: FlightResultsComponent },
    { path: 'booking', component: BookingComponent },
    { path: 'payment', component: PaymentComponent },
    { path: 'confirmation', component: ConfirmationComponent },
    { path: 'bookingsearch', component: BookingsearchComponent },
    { path: '', redirectTo: '/search', pathMatch: 'full' },
];
