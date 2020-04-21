import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskComponent} from './task.component';
import {TasksService} from '../tasks.service';
import {of} from 'rxjs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbDate, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Task} from './task.model';

describe('TaskComponent', () => {
  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;
  let mockTasksService;
  let task;
  let ngbDate;
  let mockExitEmitter;

  beforeEach(async(() => {
    task = new Task();
    mockTasksService = {
      save: jest.fn(() => of()),
      delete: jest.fn(() => of())
    };
    mockExitEmitter = {
      emit: jest.fn()
    };

    TestBed.configureTestingModule({
      declarations: [TaskComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        NgbModule
      ],
      providers: [
        {provide: TasksService, useValue: mockTasksService}
      ]
    });
    fixture = TestBed.createComponent(TaskComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
    component.exit = mockExitEmitter;
    component.task = task;
    const date = new Date();
    ngbDate = new NgbDate(date.getFullYear(), date.getMonth(), date.getDate());
    component.ngbDate = ngbDate;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.ngbDate).toBe(ngbDate);
  });

  describe('on ngOnInit', () => {
    it('should create new task', () => {
      component.ngOnInit();
      expect(component.task.status).toBe('pending');
      expect(component.isUpdate).toBe(false);
    });

  });

  it('on close', () => {
    component.onClose();
    expect(mockExitEmitter.emit).toHaveBeenCalledWith(true);
  });

  it('on save calls mock tasks service save operation', () => {
    component.onSave();
    expect(mockTasksService.save).toHaveBeenCalled();
  });

  it('on delete calls mock tasks service delete operation', () => {
    task.id = 10;
    component.onDelete();
    expect(mockTasksService.delete).toHaveBeenCalled();
  });

});
