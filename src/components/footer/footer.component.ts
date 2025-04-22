import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-footer',
  standalone: true, 
  imports: [NzIconModule,RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'] 
})
export class FooterComponent {}
