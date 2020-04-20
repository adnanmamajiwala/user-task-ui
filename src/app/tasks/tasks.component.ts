import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TasksService} from './tasks.service';
import {Page, Pageable} from '../shared/pageable.model';
import {Task} from './task/task.model';
import {MatPaginator} from '@angular/material/paginator';
import {startWith, switchMap} from 'rxjs/operators';
import {MatTableDataSource} from '@angular/material/table';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';

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
      });
    this.tasksService.tasksListSubject
      .subscribe(value => {
        setTimeout(() => {
          this.dataSource.data = value;
          this.isLoadingResults = false;
          this.cdRef.detectChanges();
        }, 1500);
      });
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

  }
}
