
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent {
  @Output() searchEvent = new EventEmitter<string>();

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchEvent.emit(value);
  }
}