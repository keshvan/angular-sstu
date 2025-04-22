import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  
  private readonly testsUrl   = "http://localhost:3000/tests?name=";
  private readonly attemptUrl = "http://localhost:3000/attempts";
  private readonly apiUrl     = "http://localhost:3000/tests";

  constructor(private http: HttpClient) { }

  saveTest(test: any) {
    return this.http.post(this.apiUrl, test);
  }

  getTestByName(name: string): Observable<Test[]> {
    return this.http.get<Test[]>(this.testsUrl + name);
  }

  saveAttempt(attempt: any) {
    return this.http.post(this.attemptUrl, attempt);
  }

  getAttempts(): Observable<Attempt[]> {
    return this.http.get<Attempt[]>(this.attemptUrl)
  }
}

export interface Question {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  points: number;
}

export interface Test {
  id: string;
  name: string;
  questions: Question[];
  max_score: number;
}

export interface Attempt {
  id: string,
  test_name: string,
  student_name: string,
  score: number,
  timestamp: string
}
