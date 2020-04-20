import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TasksService} from './tasks.service';
import {Page, Pageable} from '../shared/pageable.model';
import {Task} from './task/task.model';
import {MatPaginator} from '@angular/material/paginator';
import {startWith, switchMap} from 'rxjs/operators';
import {MatTableDataSource} from '@angular/material/table';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('content', {static: true}) content: ElementRef;

  dataSource = new MatTableDataSource<Task>();
  displayedColumns: Array<string> = ['id', 'status', 'completeBy', 'title'];
  page: Page;
  isLoadingResults = false;
  task: Task;
  private today: string;
  private tomorrow: string;

  constructor(private tasksService: TasksService,
              private config: NgbModalConfig,
              private modalService: NgbModal,
              private cdRef: ChangeDetectorRef) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = 5;
    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.tasksService.retrieveAll(this.paginator.pageIndex, this.paginator.pageSize);
        }))
      .subscribe(data => {
        this.page = data.page;
        this.isLoadingResults = false;
        this.dataSource.data = data.content;
        this.dataSource.paginator = this.paginator;
      });

    this.tasksService.tasksListSubject
      .subscribe(value => {
        this.dataSource.data = value;
        this.cdRef.detectChanges();
      });

    this.today = moment(new Date()).format('YYYY-MM-DD');
    this.tomorrow = moment(new Date()).add(1, 'day').format('YYYY-MM-DD');
  }

  addTask() {
    this.task = new Task();
    this.modalService.open(this.content);
  }

  showTask(element: Task) {
    this.task = element;
    this.modalService.open(this.content);
  }

  flipStatus(element: Task) {
    element.status = element.status === 'pending' ? 'completed' : 'pending';
    this.tasksService.save(element)
      .subscribe();
  }

  getButtonClass(element: Task): string {
    if (element.status === 'completed') {
      return 'btn-outline-success';
    }
    if (this.today >= element.completeBy) {
      return 'btn-outline-danger';
    }
    if (this.tomorrow === element.completeBy) {
      return 'btn-outline-warning';
    }
    return 'btn-outline-dark';
  }

  getIconClass(element: Task): string {
    if (element.status === 'completed') {
      return 'fa-check';
    }
    if (this.today >= element.completeBy) {
      return 'fa-exclamation-triangle';
    }
    if (this.tomorrow === element.completeBy) {
      return 'fa-hourglass-half';
    }
    return 'fa-ellipsis-h';
  }
}
