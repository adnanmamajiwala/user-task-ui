import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  @Output() exit = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit(): void {
  }

  onClose(crossClick: string) {
    this.exit.emit(crossClick);
  }

  onSave(saveClick: string) {
    this.exit.emit(saveClick);
  }
}
