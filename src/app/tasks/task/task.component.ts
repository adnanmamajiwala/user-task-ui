import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap';
import {Task} from './task.model';
import {DatePipe} from '@angular/common';
import {TasksService} from '../tasks.service';
import * as moment from 'moment';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
  providers: [DatePipe]
})
export class TaskComponent implements OnInit {

  @Input() task: Task;
  @Output() exit = new EventEmitter<boolean>();
  ngbDate: NgbDate;
  title = '';
  description = '';
  isUpdate = true;

  constructor(private datePipe: DatePipe,
              private tasksService: TasksService) {
  }

  ngOnInit(): void {
    if (!this.task.status) {
      this.task = new Task();
      this.task.status = 'pending';
      this.task.createdOn = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.isUpdate = false;
    }

    this.title = this.task.title;
    this.description = this.task.description;
    const date = moment(this.task.completeBy, 'YYYY-MM-DD');
    this.ngbDate = new NgbDate(date.year(), date.month() + 1, date.date());
  }

  onClose() {
    this.exit.emit(true);
  }

  onSave() {
    this.task.title = this.title;
    this.task.description = this.description;
    const date = this.ngbDate.year + '-' + this.ngbDate.month + '-' + this.ngbDate.day;
    this.task.completeBy = moment(new Date(date)).format('YYYY-MM-DD');
    this.tasksService.save(this.task)
      .subscribe(value => {
        this.exit.emit(true);
      });
  }

  onDelete() {
    this.tasksService.delete(this.task.id)
      .subscribe(value => {
        this.exit.emit(true);
      });

  }
}
