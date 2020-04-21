import {async, ComponentFixture, TestBed, tick} from '@angular/core/testing';

import {FilterComponent} from './filter.component';
import {TasksService} from '../tasks.service';
import {ReactiveFormsModule} from '@angular/forms';
import {of} from 'rxjs';
// @ts-ignore
import moment from 'moment';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let mockTasksService;
  let mockSearchInput;

  beforeEach(async(() => {
    mockTasksService = {
      retrieveByStatus: jest.fn(() => of()),
      retrieveByStatusAndCompleteBy: jest.fn(() => of()),
      retrieveAll: jest.fn(() => of()),
      retrieveAllPending: jest.fn(() => of())
    };
    mockSearchInput = {
      valueChanges: {
        pipe: jest.fn(() => of())
      },
      patchValue: jest.fn()
    };

    TestBed.configureTestingModule({
      declarations: [FilterComponent],
      imports: [
        ReactiveFormsModule
      ],
      providers: [
        {provide: TasksService, useValue: mockTasksService}
      ]
    });
    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    component.searchInput = mockSearchInput;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('on ngOnInit', () => {
    it('should call valueChanges', () => {
      component.ngOnInit();
      expect(mockSearchInput.valueChanges.pipe).toHaveBeenCalled();
    });
  });

  describe('when calling search by status', () => {
    it('calls tasks service to retrieveByStatus', () => {
      const status = 'pending';
      component.searchByStatus(status);
      expect(mockTasksService.retrieveByStatus).toHaveBeenCalledWith(status);
    });
  });

  describe('when calling search by CompleteBy', () => {
    it('calls tasks service to retrieveByStatusAndCompleteBy with date based on today', () => {
      const pillText = 'some text';
      component.searchByCompleteBy('today', pillText);
      const date = moment().format('YYYY-MM-DD');
      expect(mockTasksService.retrieveByStatusAndCompleteBy).toHaveBeenCalledWith('pending', date);
      // expect(component.searchPill).toBe(pillText);
    });

    it('calls tasks service to retrieveByStatusAndCompleteBy with date based on tomorrow', () => {
      const pillText = 'some text';
      component.searchByCompleteBy('tomorrow', pillText);
      const date = moment().add(1, 'day').format('YYYY-MM-DD');
      expect(mockTasksService.retrieveByStatusAndCompleteBy).toHaveBeenCalledWith('pending', date);
      // expect(component.searchPill).toBe(pillText);
    });
  });

  describe('when calling onClear', () => {
    it('calls task service to retrieveall', () => {
      component.onClear();
      // expect(mockSearchInput.valueChanges).toHaveBeenCalled();
      expect(mockTasksService.retrieveAll).toHaveBeenCalled();
    });
  });

  describe('when calling search by past due', () => {
    it('calls task service to retrieve all pending', () => {
      component.searchByPastDue();
      expect(mockTasksService.retrieveAllPending).toHaveBeenCalledWith(moment().format('YYYY-MM-DD'));
    });
  });

});

