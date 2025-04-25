import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReaderCardComponent } from './reader-card.component';

describe('ReaderCardComponent', () => {
  let component: ReaderCardComponent;
  let fixture: ComponentFixture<ReaderCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReaderCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReaderCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
