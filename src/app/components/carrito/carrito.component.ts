import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-carrito',
  imports: [CommonModule, RouterLink],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class CarritoComponent implements OnInit {
  carrito: any = { items: [], total: 0, cantidad: 0 };
  cargando = true;
  usuario: any = null;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.usuario = this.authService.getUsuario();
    if (!this.usuario) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarCarrito();
  }

  cargarCarrito() {
    this.apiService.getCarrito(this.usuario.usuario_id).subscribe({
      next: (data) => {
        setTimeout(() => {
          this.carrito = data;
          this.cargando = false;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        setTimeout(() => {
          this.cargando = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  eliminarProducto(productoId: number) {
    this.apiService.eliminarDelCarrito({
      usuario_id: this.usuario.usuario_id,
      producto_id: productoId
    }).subscribe({
      next: () => this.cargarCarrito()
    });
  }

  confirmarPedido() {
    this.apiService.crearPedido({
      usuario_id: this.usuario.usuario_id,
      direccion: 'Dirección de envío'
    }).subscribe({
      next: () => {
        alert('Pedido realizado correctamente!');
        this.router.navigate(['/pedidos']);
      },
      error: () => alert('No se pudo realizar el pedido.')
    });
  }
}