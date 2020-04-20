import {Component, OnInit} from '@angular/core';
import {TasksService} from '../tasks.service';
import * as moment from 'moment';
import {FormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged, filter, switchMap} from 'rxjs/operators';


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  searchInput: FormControl = new FormControl();

  constructor(private tasksService: TasksService) {
  }

  ngOnInit(): void {
    this.searchInput.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(term => {
        return term.length >= 3;
      }),
      switchMap((value) => this.tasksService.retrieveByTitle(value))
    ).subscribe();
  }

  searchByStatus(status: string) {
    this.tasksService
      .retrieveByStatus(status)
      .subscribe();
  }

  searchByCompleteBy(day: string) {
    const date = day === 'today' ? moment().format('YYYY-MM-DD') : moment().add(1, 'day').format('YYYY-MM-DD');
    this.tasksService
      .retrieveByStatusAndCompleteBy('pending', date)
      .subscribe();
  }
}
