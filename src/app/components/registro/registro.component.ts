import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class RegistroComponent {
  nombre = '';
  apellidos = '';
  email = '';
  password = '';
  error = '';
  exito = '';
  cargando = false;

  constructor(private authService: AuthService, private router: Router) {}

  registro() {
    if (!this.nombre || !this.apellidos || !this.email || !this.password) {
      this.error = 'Por favor rellena todos los campos.';
      return;
    }

    this.cargando = true;
    this.error = '';
    this.exito = '';

    this.authService.registro({
      nombre: this.nombre,
      apellidos: this.apellidos,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.exito = 'Cuenta creada correctamente. Ahora puedes iniciar sesión.';
        this.cargando = false;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.error = err.error?.error || 'No se pudo crear la cuenta.';
        this.cargando = false;
      }
    });
  }
}