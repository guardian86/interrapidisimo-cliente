import { Component } from '@angular/core';
import { LayoutComponent } from './shared/components/layout/layout.component';

@Component({
  selector: 'app-root',
  imports: [
    LayoutComponent
  ],
  template: '<app-layout></app-layout>',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'Sistema de Registro de Estudiantes - InterRapidísimo';
}
