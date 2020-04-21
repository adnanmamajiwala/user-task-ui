import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TasksService} from './tasks.service';
import {Page} from '../shared/pageable.model';
import {Task} from './task/task.model';
import {MatPaginator} from '@angular/material/paginator';
import {startWith, switchMap} from 'rxjs/operators';
import {MatTableDataSource} from '@angular/material/table';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('content', {static: true}) content: ElementRef;

  isCollapsed = true;
  dataSource = new MatTableDataSource<Task>();
  displayedColumns: Array<string> = ['id', 'status', 'completeBy', 'title'];
  page: Page;
  isLoadingResults = false;
  task: Task;
  today: string;
  tomorrow: string;

  constructor(private tasksService: TasksService,
              private config: NgbModalConfig,
              private modalService: NgbModal,
              private cdRef: ChangeDetectorRef) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = 20;
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
    if (this.today > element.completeBy) {
      return 'btn-outline-danger';
    } else if (this.today === element.completeBy) {
      return 'btn-outline-warning';
    } else if (this.tomorrow === element.completeBy) {
      return 'btn-outline-info';
    }
    return 'btn-outline-info';
  }

  getIconClass(element: Task): string {
    if (!element.id) {
      return '';
    } else if (element.status === 'completed') {
      return 'fa-check-circle';
    } else if (this.today > element.completeBy) {
      return 'fa-exclamation-circle';
    } else if (this.today === element.completeBy) {
      return 'fa-exclamation-circle';
    } else if (this.tomorrow === element.completeBy) {
      return 'fa-exclamation-circle';
    }
    return 'fa-ellipsis-h';
  }
}
