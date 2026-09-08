import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

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
  usuario: any = null;
  esAdmin = false;
  mensaje = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.usuario = this.authService.getUsuario();
    this.esAdmin = this.authService.esAdmin();
    if (!this.usuario) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarPedidos();
  }

  cargarPedidos() {
    const obs = this.esAdmin
      ? this.apiService.getTodosPedidos()
      : this.apiService.getPedidos(this.usuario.usuario_id);

    obs.subscribe({
      next: (data) => {
        setTimeout(() => {
          this.pedidos = data;
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

  verDetalle(pedidoId: number) {
    this.apiService.getDetallePedido(pedidoId).subscribe({
      next: (data) => {
        setTimeout(() => {
          this.pedidoSeleccionado = data;
          this.cdr.detectChanges();
        });
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

  pedidoModificar: any = null;

  abrirModificar(pedido: any) {
    this.pedidoModificar = pedido;
  }

  cambiarEstado(pedidoId: number, estado: string) {
    this.apiService.cambiarEstadoPedido(pedidoId, estado).subscribe({
      next: () => {
        setTimeout(() => {
          this.mensaje = 'Estado actualizado correctamente.';
          this.pedidoModificar = null;
          this.cargarPedidos();
          this.cdr.detectChanges();
        });
      }
    });
  }
}