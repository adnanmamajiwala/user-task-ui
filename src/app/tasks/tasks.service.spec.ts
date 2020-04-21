import {TasksService} from './tasks.service';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';

jest.mock('@angular/common/http');

describe('TasksService', () => {
  let httpClient;
  let service: TasksService;

  beforeEach(() => {
    httpClient = new HttpClient(null);
    service = new TasksService(httpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('the service should return', () => {
    httpClient.delete.mockReturnValueOnce(of({}));
    service.delete(6)
      .subscribe((value) => expect(value).toEqual([]));
    expect(httpClient.delete).toHaveBeenCalledWith('http://localhost:8080/api/task/6');
  });
});
