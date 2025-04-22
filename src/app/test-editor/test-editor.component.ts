import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { TestService } from '../services/test.service';

@Component({
  selector: 'app-test-editor',
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatRadioModule, MatIconModule, MatFormFieldModule],
  templateUrl: './test-editor.component.html',
  styleUrl: './test-editor.component.css'
})

export class TestEditorComponent {
  testForm: FormGroup
  questions: Question[] = []

  constructor(private fb: FormBuilder, private testService: TestService) {
    this.testForm = this.fb.group({
      testName: ['', Validators.required],
      question: ['', Validators.required],
      options: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required)
      ]),
      correctAnswerIndex: [0, Validators.required],
      points: [1, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  get options() {
    return this.testForm.get('options') as FormArray;
  }

  get testName() {
    return this.testForm.get('testName');
  }

  addOption() {
    this.options.push(this.fb.control('', Validators.required));
  }

  removeOption(index: number) {
    this.options.removeAt(index);

    const correctIndex = this.testForm.get('correctAnswerIndex')?.value;

    if (correctIndex === index) {
      this.testForm.get('correctAnswerIndex')?.setValue(0);
    }
  }

  addQuestion() {
    if (this.testForm.valid) {
      const questionData = {
        question: this.testForm.get('question')?.value,
        options: this.options.getRawValue(),
        correctAnswerIndex: this.testForm.get('correctAnswerIndex')?.value,
        points: this.testForm.get('points')?.value
      }
      this.questions.push(questionData);
      this.resetQuestions();
    }
  }

  resetQuestions() {
    this.testForm.get('question')?.reset('');
    this.testForm.get('correctAnswerIndex')?.reset(0);
    this.testForm.get('points')?.reset(1);

    let i = this.options.length;
    while (i > 1) {
      this.removeOption(i);
      i--
    }

    this.options.at(0).reset('');
    this.options.at(1).reset('');
  }

  saveTest() {
    if (this.questions.length > 0 && this.testName?.value) {
      const testData = {
        name: this.testName.value,
        questions: this.questions,
        max_score: this.questions.reduce((sum, q) => sum += q.points, 0)
      };
      console.log(testData);
      this.testService.saveTest(testData).subscribe({complete: console.info, error: console.error});
      this.resetTest();
    }
  }

  resetTest() {
    this.questions = [];
    this.testName?.reset('');
    this.resetQuestions();
  }
}

interface Question {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  points: number;
}