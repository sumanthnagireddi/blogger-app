import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoverHomeComponent } from './discover-home.component';

describe('DiscoverHomeComponent', () => {
  let component: DiscoverHomeComponent;
  let fixture: ComponentFixture<DiscoverHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscoverHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscoverHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
