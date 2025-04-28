import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUsersHComponent } from './admin-users-h.component';

describe('AdminUsersHComponent', () => {
  let component: AdminUsersHComponent;
  let fixture: ComponentFixture<AdminUsersHComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUsersHComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUsersHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
