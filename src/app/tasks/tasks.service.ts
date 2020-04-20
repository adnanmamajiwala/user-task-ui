import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Pageable} from '../shared/pageable.model';
import {Observable, Subject, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {Task} from './task/task.model';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private tasksSubject: Subject<Array<Task>> = new Subject<Array<Task>>();
  private pageIndex: number;
  private pageSize: number;
  private tasks: Array<Task>;

  constructor(private httpClient: HttpClient) {
  }

  get tasksListSubject(): Observable<Array<Task>> {
    return this.tasksSubject.asObservable();
  }

  updateTaskSubject(tasks: Array<Task>) {
    this.tasks = tasks;
    this.tasksSubject.next(tasks);
  }

  retrieveAll(pageIndex?: number, pageSize?: number): Observable<Pageable<Task>> {
    this.pageIndex = !!pageIndex ? pageIndex : this.pageIndex;
    this.pageSize = !!pageSize ? pageSize : this.pageSize;
    return this.httpClient
      .get<Pageable<Task>>(`${environment.api_base_url}/task?page=${this.pageIndex}&size=${this.pageSize}`)
      .pipe(
        map(value => {
          this.updateTaskSubject(value.content);
          return value;
        }),
        catchError(err => this.handleError(err, 'retrieveAll'))
      );
  }

  private handleError(error: HttpErrorResponse, method: string) {
    console.error('Error occurred while performing ' + method);
    console.error(error);
    return throwError(error.message);
  }

  save(task: Task): Observable<Task> {
    if (!!task.id) {
      return this.httpClient.put<Task>(`${environment.api_base_url}/task/${task.id}`, task)
        .pipe(
          map(value => {
            const index = this.tasks.findIndex(val => val.id === task.id);
            this.tasks[index] = value;
            this.updateTaskSubject(this.tasks);
            return value;
          }),
          catchError(err => this.handleError(err, 'save (put operation)'))
        );
    }
    return this.httpClient
      .post<Task>(`${environment.api_base_url}/task`, task)
      .pipe(
        map(value => {
          this.tasks.push(value);
          this.updateTaskSubject(this.tasks);
          return value;
        }),
        catchError(err => this.handleError(err, 'save (post operation)')));
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(`${environment.api_base_url}/task/${id}`)
      .pipe(
        map(value => {
          const index = this.tasks.findIndex(val => val.id === id);
          this.tasks.splice(index, 1);
          this.updateTaskSubject(this.tasks);
          return value;
        }),
        catchError(err => this.handleError(err, 'delete')));
  }
}
