import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pedidos',
  imports: [CommonModule, FormsModule],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css'
})
export class PedidosComponent implements OnInit {
  pedidos: any[] = [];
  pedidoSeleccionado: any = null;
  cargando = true;
  mensaje = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.esAdmin()) {
      this.router.navigate(['/catalogo']);
      return;
    }
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.apiService.getTodosPedidos().subscribe({
      next: (data) => {
        this.pedidos = data;
        this.cargando = false;
      }
    });
  }

  verDetalle(pedidoId: number) {
    this.apiService.getDetallePedido(pedidoId).subscribe({
      next: (data) => { this.pedidoSeleccionado = data; }
    });
  }

  cambiarEstado(pedidoId: number, estado: string) {
    this.apiService.cambiarEstadoPedido(pedidoId, estado).subscribe({
      next: () => {
        this.mensaje = 'Estado actualizado correctamente.';
        this.cargarPedidos();
        if (this.pedidoSeleccionado) {
          this.pedidoSeleccionado.estado = estado;
        }
      }
    });
  }

  cerrarDetalle() {
    this.pedidoSeleccionado = null;
  }

  getBadgeColor(estado: string): string {
    const colores: any = {
      pendiente: 'warning',
      pagado: 'info',
      enviado: 'primary',
      entregado: 'success',
      cancelado: 'danger'
    };
    return colores[estado] || 'secondary';
  }
}