import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingsearchComponent } from './bookingsearch.component';

describe('BookingsearchComponent', () => {
  let component: BookingsearchComponent;
  let fixture: ComponentFixture<BookingsearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingsearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
