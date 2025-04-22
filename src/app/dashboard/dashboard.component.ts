import { Component, OnInit } from '@angular/core';
import { Attempt, TestService } from '../services/test.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatRadioModule, MatIconModule, MatFormFieldModule, MatSelect, MatOption, MatTableModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  displayedColumns: string[] = ['student_name', 'test_name', 'score', 'timestamp'];
  attempts: Attempt[] = [];
  filteredAttempts: Attempt[] = [];

  selectedTestName: string = '';
  availableTests!: Set<String>;

  constructor(private testService: TestService) {}

  ngOnInit(): void {
    this.testService.getAttempts().subscribe(data => {
      this.attempts = data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      this.availableTests = new Set(this.attempts.map(a => a.test_name));
      this.filteredAttempts = this.attempts;
      console.log(this.filteredAttempts);
    });
  }

  filterByTest(): void {
    if (!this.selectedTestName) {
      this.filteredAttempts = this.attempts;
    } else {
      this.filteredAttempts = this.attempts.filter(a => a.test_name === this.selectedTestName);
    }
  }
}
