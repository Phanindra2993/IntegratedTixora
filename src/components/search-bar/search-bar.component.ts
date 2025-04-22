import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-search-bar',
  standalone: true, // 👈 required for standalone component
  imports: [
    FormsModule,
    NzInputModule,
    NzSelectModule,
    NzIconModule,
    NzButtonModule,
  ],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  inputValue: string = '';

  @Output() search = new EventEmitter<string>();

  onSearchClick(): void {
    this.search.emit(this.inputValue.trim());
  }

  onInputChange() {
    if (this.inputValue.trim() === '') {
      this.emitSearchQuery();
    }
  }
  private emitSearchQuery() {
    this.search.emit(this.inputValue.trim().toLowerCase());
    this.inputValue = ''; 
  }
}
