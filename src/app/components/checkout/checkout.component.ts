import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class CheckoutComponent implements OnInit {
  carrito: any = { items: [], total: 0 };
  usuario: any = null;
  cargando = true;
  procesando = false;

  nombre = '';
  apellidos = '';
  email = '';
  telefono = '';
  numeroTarjeta = '';
  caducidad = '';
  cvv = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.usuario = this.authService.getUsuario();
    if (!this.usuario) {
      this.router.navigate(['/login']);
      return;
    }
    this.nombre = this.usuario.nombre || '';
    this.apellidos = this.usuario.apellidos || '';
    this.email = this.usuario.email || '';

    this.apiService.getCarrito(this.usuario.usuario_id).subscribe({
      next: (data) => {
        setTimeout(() => {
          this.carrito = data;
          this.cargando = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  formatearTarjeta(event: any) {
    let val = event.target.value.replace(/\D/g, '').substring(0, 16);
    val = val.replace(/(.{4})/g, '$1 ').trim();
    this.numeroTarjeta = val;
  }

  formatearCaducidad(event: any) {
    let val = event.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length > 2) val = val.substring(0, 2) + '/' + val.substring(2);
    this.caducidad = val;
  }

  confirmar() {
    if (!this.nombre || !this.apellidos || !this.email || !this.numeroTarjeta || !this.caducidad || !this.cvv) {
      alert('Por favor rellena todos los campos.');
      return;
    }
    this.procesando = true;
    const ultimos = this.numeroTarjeta.replace(/\s/g, '').slice(-4);

    this.apiService.crearPedido({
      usuario_id: this.usuario.usuario_id,
      direccion: 'Dirección de envío',
      nombre: this.nombre,
      apellidos: this.apellidos,
      email: this.email,
      telefono: this.telefono,
      ultimos_digitos: ultimos
    }).subscribe({
      next: () => {
        setTimeout(() => {
          this.procesando = false;
          this.router.navigate(['/pedidos']);
          this.cdr.detectChanges();
        }, 1500);
      },
      error: () => {
        this.procesando = false;
        alert('No se pudo realizar el pedido.');
      }
    });
  }
}