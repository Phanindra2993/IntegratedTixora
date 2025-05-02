import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NzModalComponent, NzModalConfirmContainerComponent } from 'ng-zorro-antd/modal';


describe('ConfirmModalComponent', () => {
  let component: NzModalConfirmContainerComponent;
  let fixture: ComponentFixture<NzModalConfirmContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NzModalConfirmContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NzModalConfirmContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
