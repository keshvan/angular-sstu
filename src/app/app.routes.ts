import { Routes } from '@angular/router';
import { TestEditorComponent } from './test-editor/test-editor.component';
import { StudentTestComponent } from './student-test/student-test.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    {path: 'dashboard', component: DashboardComponent},
    {path: 'test-editor', component: TestEditorComponent},
    {path: 'test/:name', component: StudentTestComponent}
];
