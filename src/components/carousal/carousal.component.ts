import { Component } from '@angular/core';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';

@Component({
  selector: 'app-carousal',
  standalone: true,
  imports: [NzCarouselModule],
  templateUrl: './carousal.component.html',
  styleUrls: ['./carousal.component.scss'], 
})

export class CarousalComponent {
  imageUrls = [
    'https://statico.soapcentral.com/editor/2025/04/3c8b6-17442684543218.jpg',
    'https://statico.soapcentral.com/editor/2025/03/5f063-17411733544513.jpg',
    'https://statico.soapcentral.com/editor/2025/03/5f063-17411733544513.jpg',
    'https://statico.soapcentral.com/editor/2025/03/5f063-17411733544513.jpg'
    
  ];
}
