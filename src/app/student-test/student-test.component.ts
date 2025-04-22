import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TestService, Test } from '../services/test.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-student-test',
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatRadioModule, MatIconModule, MatFormFieldModule],
  templateUrl: './student-test.component.html',
  styleUrl: './student-test.component.css'
})
export class StudentTestComponent implements OnInit {

  private readonly OFFSET = new Date().getTimezoneOffset() * 60000;
  private interval: any;

  timer!: number;
  test!: Test;
  studentTestForm: FormGroup;
  testName!: string;

  currentQuestion = 0;
  answers: number[] = [];
  result = 0;

  started = false;
  finished = false;
  lastQuestion = false;

  
  constructor(private route: ActivatedRoute, private fb: FormBuilder, private testService: TestService) {
    this.studentTestForm = this.fb.group({ name: ['', Validators.required] });
  }

  ngOnInit() {
    this.testName = this.route.snapshot.paramMap.get('name')!;
    this.testService.getTestByName(this.testName).subscribe(test => {
      this.test = test[0];
    });

  }

  selectAnswer(i: number) {
    this.answers[this.currentQuestion] = i;
  }

  next() {
    this.currentQuestion++;
    if (this.currentQuestion == this.test.questions.length - 1) {
      this.lastQuestion = true;
    }
  }

  back() {
    this.currentQuestion--;
  }

  startTest() {
    if (this.studentTestForm.valid) {
      this.started = true;
      this.timer = 1800;
      this.startTimer();
    }
  }

  startTimer() {
    this.interval = setInterval(()=> {
      this.timer--;
      if (this.timer <= 0) {
        this.submit();
      }
    }, 1000)
  }

  submit() {
    clearInterval(this.interval);
    this.finished = true;

    let score = 0;
    this.test.questions.forEach((q, i) => {
      if (this.answers[i] === q.correctAnswerIndex) {
        score += q.points;
      }
    });

    this.result = score;

    const attempt = {
      test_name: this.testName,
      student_name: this.studentTestForm.get('name')?.value,
      score: this.result,
      timestamp: new Date(Date.now() - this.OFFSET).toISOString()
    }

    this.testService.saveAttempt(attempt).subscribe({complete: console.info, error: console.error});
  }

  reset() {
    this.currentQuestion = 0;
    this.answers = [];
    this.result = 0;
    this.finished = false;
    this.lastQuestion = false;
    this.timer = 1800;
    clearInterval(this.interval);
  }
}
