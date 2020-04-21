import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FilterComponent} from './filter.component';
import {TasksService} from '../tasks.service';
import {ReactiveFormsModule} from '@angular/forms';
import {of} from 'rxjs';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let tasksServiceStubSpy;

  beforeEach(async(() => {
    const tasksServiceStub = {
      retrieveByStatus: () => ({subscribe: () => ({})}),
    };

    tasksServiceStubSpy = spyOn(tasksServiceStub, 'retrieveByStatus');

    TestBed.configureTestingModule({
      declarations: [FilterComponent],
      imports: [
        ReactiveFormsModule
      ],
      providers: [
        {provide: TasksService, useValue: tasksServiceStub}
      ]
    });
    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when calling search by status', () => {
    it('calls tasks service', () => {
      tasksServiceStubSpy.and.returnValue(of());
      component.searchByStatus('pending');
      expect(tasksServiceStubSpy).toHaveBeenCalled();
    });
  });


});

