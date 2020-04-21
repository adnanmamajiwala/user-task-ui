import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TasksComponent} from './tasks.component';
import {of} from 'rxjs';
import {TasksService} from './tasks.service';
import {MatTableModule} from '@angular/material/table';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Task} from './task/task.model';

describe('TasksComponent', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;
  let mockTasksService;
  let mockModalService;
  let mockPaginator;

  beforeEach(async(() => {
    mockTasksService = {
      save: jest.fn(() => of()),
      retrieveAll: jest.fn(() => of()),
      tasksListSubject: {
        subscribe: jest.fn(() => of())
      }
    };
    mockModalService = {
      open: jest.fn()
    };
    mockPaginator = {
      pageIndex: -1,
      pageSize: -1,
      page: {
        pipe: jest.fn(() => of())
      }
    };

    TestBed.configureTestingModule({
      declarations: [TasksComponent],
      imports: [
        MatTableModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: TasksService, useValue: mockTasksService},
        {provide: NgbModal, useValue: mockModalService}
      ]
    });

    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
    component.today = '2020-04-18';
    component.tomorrow = '2020-04-19';
    component.paginator = mockPaginator;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should setup paginator and tasksListSubject', () => {
    component.ngOnInit();
    expect(mockPaginator.page.pipe).toHaveBeenCalled();
    expect(mockPaginator.pageIndex).toBe(0);
    expect(mockPaginator.pageSize).toBe(20);
    expect(mockTasksService.tasksListSubject.subscribe).toHaveBeenCalled();
  });

  it('should call open in modal service on add task', () => {
    component.addTask();
    expect(mockModalService.open).toHaveBeenCalled();
  });

  it('should call open  in modal service  on show task', () => {
    component.showTask(null);
    expect(mockModalService.open).toHaveBeenCalled();
  });

  describe('when flip status', () => {
    it('should call save with flipped status from pending to complete', () => {
      const pending = new Task();
      pending.status = 'pending';
      const completed = new Task();
      completed.status = 'completed';
      component.flipStatus(pending);
      expect(mockTasksService.save).toHaveBeenCalledWith(completed);
    });

    it('should call save with flipped status from complete to pending', () => {
      const pending = new Task();
      pending.status = 'pending';
      const completed = new Task();
      completed.status = 'completed';
      component.flipStatus(completed);
      expect(mockTasksService.save).toHaveBeenCalledWith(completed);
    });
  });

  describe('get button class', () => {
    const task = new Task();
    it('should return class success', () => {
      task.status = 'completed';
      expect(component.getButtonClass(task)).toBe('btn-outline-success');
    });

    it('should return class danger when status is pending and past due', () => {
      task.status = 'pending';
      task.completeBy = '2020-04-16';
      expect(component.getButtonClass(task)).toBe('btn-outline-danger');
    });

    it('should return class warning when status is pending and due today', () => {
      task.status = 'pending';
      task.completeBy = '2020-04-18';
      expect(component.getButtonClass(task)).toBe('btn-outline-warning');
    });

    it('should return class info when status is pending and due tomorrow', () => {
      task.status = 'pending';
      task.completeBy = '2020-04-19';
      expect(component.getButtonClass(task)).toBe('btn-outline-info');
    });

    it('should return class info when status is pending and due more than two days later', () => {
      task.status = 'pending';
      task.completeBy = '2020-04-22';
      expect(component.getButtonClass(task)).toBe('btn-outline-info');
    });

  });

  describe('get icon class', () => {
    const task = new Task();
    it('should return class empty', () => {
      task.status = 'completed';
      expect(component.getIconClass(task)).toBe('');
    });

    it('should return class checked', () => {
      task.id = 1;
      task.status = 'completed';
      expect(component.getIconClass(task)).toBe('fa-check-circle');
    });

    it('should return class exclamation when status is pending and past due', () => {
      task.id = 1;
      task.status = 'pending';
      task.completeBy = '2020-04-16';
      expect(component.getIconClass(task)).toBe('fa-exclamation-circle');
    });

    it('should return class exclamation when status is pending and due today', () => {
      task.id = 1;
      task.status = 'pending';
      task.completeBy = '2020-04-18';
      expect(component.getIconClass(task)).toBe('fa-exclamation-circle');
    });

    it('should return class exclamation when status is pending and due tomorrow', () => {
      task.id = 1;
      task.status = 'pending';
      task.completeBy = '2020-04-19';
      expect(component.getIconClass(task)).toBe('fa-exclamation-circle');
    });

    it('should return class ellipsis when status is pending and due more than two days later', () => {
      task.id = 1;
      task.status = 'pending';
      task.completeBy = '2020-04-22';
      expect(component.getIconClass(task)).toBe('fa-ellipsis-h');
    });
  });


});
