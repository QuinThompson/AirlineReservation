import { Component, Input, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  @Input() flight: any;
  @Input() formGroup: any[] = [];
  @Input() bookingreference: any;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const flightsData = params['flights'];
      const formData = params['passengers'];
      const bookingreference = params['booking_reference'];
      this.bookingreference = bookingreference;

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
      console.log('Passengers: ', this.formGroup, 'Flight: ', this.flight, 'Booking Reference: ', bookingreference);
    });
  }

  downloadPDF() {
    // const element = document.querySelector('.confirmation-container');
    const element = document.querySelector('.confirmation-container') as HTMLElement;

    if (element) {
      html2canvas(element).then((canvas: HTMLCanvasElement) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 190; // Adjust as needed
        const pageHeight = pdf.internal.pageSize.height;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const heightLeft = imgHeight;

        let position = 0;

        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        position += heightLeft;

        pdf.save('booking-confirmation.pdf');
      });
    }
  }

  formatDepartureDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  printConfirmation() {
    window.print();
  }
}
