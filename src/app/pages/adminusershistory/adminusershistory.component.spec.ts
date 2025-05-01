import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminusershistoryComponent } from './adminusershistory.component';

describe('AdminusershistoryComponent', () => {
  let component: AdminusershistoryComponent;
  let fixture: ComponentFixture<AdminusershistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminusershistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminusershistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
