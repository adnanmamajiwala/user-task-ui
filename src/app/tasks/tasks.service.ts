import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Pageable} from '../shared/pageable.model';
import {Observable, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError} from 'rxjs/operators';
import {Task} from './task/task.model';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private httpClient: HttpClient) {
  }

  retrieveAll(pageIndex: number, pageSize: number): Observable<Pageable<Task>> {
    return this.httpClient
      .get<Pageable<Task>>(`${environment.api_base_url}/task?page=${pageIndex}&size=${pageSize}`)
      .pipe(catchError(err => this.handleError(err, 'retrieveAll')));
  }

  private handleError(error: HttpErrorResponse, method: string) {
    console.error('Error occurred while performing ' + method);
    console.error(error);
    return throwError(error.message);
  }
}
