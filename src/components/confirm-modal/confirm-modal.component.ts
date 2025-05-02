import { Component } from "@angular/core";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzModalModule, NzModalService } from "ng-zorro-antd/modal";

@Component({
  selector: 'app-confirm-modal',
  imports: [NzButtonModule, NzModalModule],
  template: '',
  styles: []
})
export class NzDemoModalConfirmComponent  {
  constructor(private modal: NzModalService) {}

  showBookingConfirm(bookingDetails: any, onConfirm: () => void): void {
    this.modal.confirm({
      nzTitle: '<i>Confirm Your Booking</i>',
      nzContent: `
        <div style="padding: 10px;">
          <p><b>Movie:</b> ${bookingDetails.movieTitle}</p>
          <p><b>Date:</b> ${bookingDetails.selectedDate}</p>
          <p><b>Time:</b> ${bookingDetails.selectedTime}</p>
          <p><b>Seats:</b> ${bookingDetails.seatCount}</p>
          <p><b>Total Amount:</b> ₹${bookingDetails.seatCount * 200}</p>
        </div>
      `,
      nzOkText: 'Confirm Booking',
      nzOkType: 'primary',
      nzOnOk: () => onConfirm(),
      nzCancelText: 'Go Back',
      nzOnCancel: () => console.log('Booking cancelled')
    });
  }
}