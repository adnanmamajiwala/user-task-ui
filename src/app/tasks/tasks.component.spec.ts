import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TasksComponent} from './tasks.component';
import {of} from 'rxjs';
import {TasksService} from './tasks.service';

describe('TasksComponent', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;
  let mockTasksService;
  beforeEach(async(() => {
    mockTasksService = {
      save: jest.fn(() => of()),
      retrieveAll: jest.fn(() => of()),
      tasksListSubject: jest.fn(() => of())
    };

    TestBed.configureTestingModule({
      declarations: [TasksComponent],
      providers: [
        {provide: TasksService, useValue: mockTasksService}
      ]
    });

    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
