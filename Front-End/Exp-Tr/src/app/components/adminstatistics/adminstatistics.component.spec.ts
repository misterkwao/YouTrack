import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminstatisticsComponent } from './adminstatistics.component';

describe('AdminstatisticsComponent', () => {
  let component: AdminstatisticsComponent;
  let fixture: ComponentFixture<AdminstatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminstatisticsComponent]
    });
    fixture = TestBed.createComponent(AdminstatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
