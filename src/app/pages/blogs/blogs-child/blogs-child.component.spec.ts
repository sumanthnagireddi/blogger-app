import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogsChildComponent } from './blogs-child.component';

describe('BlogsChildComponent', () => {
  let component: BlogsChildComponent;
  let fixture: ComponentFixture<BlogsChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogsChildComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogsChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
