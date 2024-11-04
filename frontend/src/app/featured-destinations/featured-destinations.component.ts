import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestinationService } from '../services/destination.service';


@Component({
  selector: 'app-featured-destinations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './featured-destinations.component.html',
  styleUrl: './featured-destinations.component.scss'
})
export class FeaturedDestinationsComponent implements OnInit {
  destinations: any[] = [];

  constructor(private destinationService: DestinationService) {}

  ngOnInit(): void {
    // this.loadDestinations();
  }

  loadDestinations() {
    this.destinationService.getDestinations().subscribe(data => {
      this.destinations = data;
    }, error => {
      console.error('Error fetching destinations:', error);
    });
  }
}
