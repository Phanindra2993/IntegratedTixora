import { Component } from '@angular/core';
import {} from 'angularx-qrcode';
import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';
import { FooterComponent } from '../../../components/footer/footer.component';
import { HeaderComponent } from '../../../components/header/header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-ticket',
  imports: [NzQRCodeModule, FooterComponent, HeaderComponent],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.scss',
})
export class TicketComponent {
  ticketData: any = {};
  qrCodeUrl: any;

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer,private router:Router) {}

  ngOnInit() {
   console.log(this.ticketData);
   
    const nav =history.state;
    if(nav && nav.ticket){
      this.ticketData =nav.ticket;
      this.generateQRCode()
    }else{
      this.router.navigate(['/'])
    }
    
  }

  generateQRCode() {
    const data = `BookingID: ${this.ticketData.bookingId}\nMovie: ${this.ticketData.movieTitle}\nQuantity: ${this.ticketData.quantity}`;
    const qrAPI = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
      data
    )}`;
    this.qrCodeUrl = this.sanitizer.bypassSecurityTrustUrl(qrAPI);
  }
}
