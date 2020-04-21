import {Component, OnInit} from '@angular/core';
import {TasksService} from '../tasks.service';
import moment from 'moment';
import {FormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged, filter, switchMap} from 'rxjs/operators';


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  searchInput: FormControl = new FormControl();
  searchPill = '';

  constructor(private tasksService: TasksService) {
  }

  ngOnInit(): void {
    this.searchInput.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(term => {
        return term.length >= 3;
      }),
      switchMap((value) => {
        this.searchPill = value;
        return this.tasksService.retrieveByTitle(value);
      })
    ).subscribe();
  }

  searchByStatus(status: string) {
    this.tasksService
      .retrieveByStatus(status)
      .subscribe(value => {
        this.searchPill = status === 'pending' ? 'Pending' : 'Completed';
      });
  }

  searchByCompleteBy(day: string, pillText: string) {
    const date = day === 'today' ? moment().format('YYYY-MM-DD') : moment().add(1, 'day').format('YYYY-MM-DD');
    this.tasksService
      .retrieveByStatusAndCompleteBy('pending', date)
      .subscribe(value => {
        this.searchPill = pillText;
      });
  }

  onClear() {
    this.searchInput.patchValue('');
    this.tasksService.retrieveAll()
      .subscribe(value => {
        this.searchPill = '';
      });
  }

  searchByPastDue() {
    this.tasksService.retrieveAllPending(moment().format('YYYY-MM-DD'))
      .subscribe(value => {
        this.searchPill = 'Pending';
      });
  }
}
