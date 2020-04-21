import {TasksService} from './tasks.service';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';
import {Task} from './task/task.model';

jest.mock('@angular/common/http');

describe('TasksService', () => {
  let httpClient;
  let service: TasksService;
  let taskSubject;

  beforeEach(() => {
    httpClient = new HttpClient(null);
    taskSubject = {
      asObservable: jest.fn(),
      next: jest.fn()
    };
    service = new TasksService(httpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call http delete', () => {
    httpClient.delete.mockReturnValueOnce(of({}));
    service
      .delete(6)
      .subscribe((value) => expect(value).toEqual([]));

    expect(httpClient.delete).toHaveBeenCalledWith('http://localhost:8080/api/task/6');
  });

  it('should call http get', () => {
    httpClient.get.mockReturnValueOnce(of({}));
    service
      .retrieveAll(1, 5)
      .subscribe((value) => expect(value).toEqual([]));

    expect(httpClient.get).toHaveBeenCalledWith('http://localhost:8080/api/task?page=1&size=5');
  });


  it('should call http post', () => {
    httpClient.post.mockReturnValueOnce(of({}));
    const task = new Task();
    service
      .save(task)
      .subscribe((value) => expect(value).toEqual([]));

    expect(httpClient.post).toHaveBeenCalledWith('http://localhost:8080/api/task', {});
  });

  it('should call http put', () => {
    httpClient.put.mockReturnValueOnce(of({}));
    const task = new Task();
    task.id = 1;
    service
      .save(task)
      .subscribe((value) => expect(value).toEqual([]));

    expect(httpClient.put).toHaveBeenCalledWith(`http://localhost:8080/api/task/${task.id}`, task);
  });

  it('should call http get with statusEquals', () => {
    httpClient.get.mockReturnValueOnce(of({}));
    const status = 'pending';
    service
      .retrieveByStatus(status)
      .subscribe((value) => expect(value).toEqual([]));

    expect(httpClient.get).toHaveBeenCalledWith(`http://localhost:8080/api/task/search/statusEquals?status=${status}`);
  });

  it('should call http get with statusAndCompleteByEquals', () => {
    httpClient.get.mockReturnValueOnce(of({}));
    const status = 'pending';
    const date = '2020-04-18';
    service
      .retrieveByStatusAndCompleteBy(status, date)
      .subscribe((value) => expect(value).toEqual([]));

    expect(httpClient.get).toHaveBeenCalledWith(`http://localhost:8080/api/task/search/statusAndCompleteByEquals?completeBy=${date}&status=${status}`);
  });

  it('should call http get with titleContains', () => {
    httpClient.get.mockReturnValueOnce(of({}));
    const data = 'some title';
    service
      .retrieveByTitle(data)
      .subscribe((value) => expect(value).toEqual([]));
    expect(httpClient.get).toHaveBeenCalledWith(`http://localhost:8080/api/task/search/titleContains?title=${encodeURI(data)}`);
  });

  it('should call http get with titleContains', () => {
    httpClient.get.mockReturnValueOnce(of({}));
    const date = '2020-04-18';
    service
      .retrieveAllPending(date)
      .subscribe((value) => expect(value).toEqual([]));
    expect(httpClient.get).toHaveBeenCalledWith(`http://localhost:8080/api/task/search/statusEqualsAndCompleteByBefore?completeBy=${date}&status=pending`);
  });


});
