import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-producto-detalle',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './producto-detalle.html',
  styleUrl: './producto-detalle.css'
})
export class ProductoDetalleComponent implements OnInit {
  producto: any = null;
  cargando = true;
  cantidad = 1;
  mensaje = '';
  error = '';
  imagenes: any[] = [];

  @Output() productoAnyadido = new EventEmitter<number>();

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.apiService.getProducto(+id).subscribe({
      next: (data) => {
        setTimeout(() => {
          this.producto = data;
          this.cargando = false;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });

    this.apiService.getImagenesProducto(+id).subscribe({
      next: (data) => {
        console.log('Imagenes cargadas:', data);
        setTimeout(() => {
          this.imagenes = data;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.log('Error imagenes:', err);
      }
    });
  }

  anadirAlCarrito() {
    const usuario = this.authService.getUsuario();
    if (!usuario) {
      this.router.navigate(['/login']);
      return;
    }

    this.apiService.anadirAlCarrito({
      usuario_id: usuario.usuario_id,
      producto_id: this.producto.producto_id,
      cantidad: this.cantidad
    }).subscribe({
      next: () => {
        this.mensaje = 'Producto añadido al carrito correctamente.';
        this.error = '';
        this.productoAnyadido.emit(usuario.usuario_id);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.error = err.error?.error || 'No se pudo añadir al carrito.';
        this.mensaje = '';
        this.cdr.detectChanges();
      }
    });
  }
}