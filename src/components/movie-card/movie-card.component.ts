import { Movie } from '../../_models/movies.model';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-movie-card',
  imports: [NzCardModule, CommonModule],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent {
  @Input() movie: Movie | undefined;
  
  
}
