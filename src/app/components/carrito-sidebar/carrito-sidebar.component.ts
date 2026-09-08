import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-carrito-sidebar',
  imports: [CommonModule, RouterLink],
  templateUrl: './carrito-sidebar.html',
  styleUrl: './carrito-sidebar.css'
})
export class CarritoSidebarComponent implements OnInit {
  carrito: any = { items: [], total: 0 };
  usuario: any = null;
  visible = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.usuario = this.authService.getUsuario();
  }

  abrir(usuarioId: number) {
    this.visible = true;
    this.apiService.getCarrito(usuarioId).subscribe({
      next: (data) => {
        setTimeout(() => {
          this.carrito = data;
          this.cdr.detectChanges();
        });
      }
    });
  }

  cerrar() {
    this.visible = false;
  }

  eliminarProducto(productoId: number) {
    this.apiService.eliminarDelCarrito({
      usuario_id: this.usuario.usuario_id,
      producto_id: productoId
    }).subscribe({
      next: () => this.abrir(this.usuario.usuario_id)
    });
  }

  confirmarPedido() {
    this.apiService.crearPedido({
      usuario_id: this.usuario.usuario_id,
      direccion: 'Dirección de envío'
    }).subscribe({
      next: () => {
        setTimeout(() => {
          this.carrito = { items: [], total: 0 };
          this.visible = false;
          this.cdr.detectChanges();
          alert('Pedido realizado correctamente!');
          this.router.navigate(['/pedidos']);
        });
      },
      error: () => alert('No se pudo realizar el pedido.')
    });
  }

  irACheckout() {
    this.visible = false;
    this.router.navigate(['/checkout']);
  }
}