import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'pr-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() type = 'warning';
  @Input() dismissible = true;

  constructor() { }

  ngOnInit() {
  }

  closeHandler(): void {
    this.close.emit();
  }

  get alertClasses(): string {
    return `alert alert-${this.type}`;
  }

}
