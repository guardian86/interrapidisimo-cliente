import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-api-test',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Prueba de Conectividad API</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <button mat-raised-button color="primary" (click)="testApi()">Probar API</button>
        <button mat-raised-button color="accent" (click)="testDirectUrl()">Probar URL Directa</button>
        
        <div style="margin-top: 20px;">
          <h3>Resultados:</h3>
          <pre>{{ results | json }}</pre>
        </div>
        
        <div style="margin-top: 20px;">
          <h3>Errores:</h3>
          <pre>{{ errors | json }}</pre>
        </div>
      </mat-card-content>
    </mat-card>
  `
})
export class ApiTestComponent implements OnInit {
  results: any = {};
  errors: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    console.log('ApiTestComponent: Componente de prueba iniciado');
  }

  testApi() {
    console.log('ApiTestComponent: Probando API con interceptor...');
    this.http.get('/Estudiantes').subscribe({
      next: (data) => {
        console.log('ApiTestComponent: Datos recibidos:', data);
        this.results = { interceptor: data };
      },
      error: (error) => {
        console.error('ApiTestComponent: Error con interceptor:', error);
        this.errors = { interceptor: error };
      }
    });
  }

  testDirectUrl() {
    console.log('ApiTestComponent: Probando URL directa...');
    this.http.get('http://localhost:5099/api/Estudiantes').subscribe({
      next: (data) => {
        console.log('ApiTestComponent: Datos recibidos (URL directa):', data);
        this.results = { ...this.results, direct: data };
      },
      error: (error) => {
        console.error('ApiTestComponent: Error con URL directa:', error);
        this.errors = { ...this.errors, direct: error };
      }
    });
  }
}
