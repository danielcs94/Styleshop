import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productos',
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class ProductosComponent implements OnInit {
  productos: any[] = [];
  categorias: any[] = [];
  cargando = true;
  mostrarFormulario = false;
  editando = false;
  mensaje = '';
  error = '';
  imagenesProducto: any[] = [];
  nuevaImagen = '';

  producto: any = {
    nombre: '', descripcion: '', precio: '',
    stock: '', imagen: '', categoria_id: ''
  };

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    if (!this.authService.esAdmin()) {
      this.router.navigate(['/catalogo']);
      return;
    }
    this.cargarProductos();
    this.cargarCategorias();
  }

  cargarProductos() {
    this.apiService.getProductos().subscribe({
      next: (data) => {
        setTimeout(() => {
          this.productos = data;
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

  cargarCategorias() {
    this.apiService.getCategorias().subscribe({
      next: (data) => {
        setTimeout(() => {
          this.categorias = data;
          this.cdr.detectChanges();
        });
      }
    });
  }

  nuevoProducto() {
    this.editando = false;
    this.producto = { nombre: '', descripcion: '', precio: '', stock: '', imagen: '', categoria_id: '' };
    this.imagenesProducto = [];
    this.slots = [null, null, null, null];
    this.mostrarFormulario = true;
  }

  editarProducto(p: any) {
    this.editando = true;
    this.producto = { ...p };
    this.imagenesProducto = [];
    this.slots = [null, null, null, null];
    this.mostrarFormulario = true;
    this.apiService.getImagenesProducto(p.producto_id).subscribe({
      next: (data: any[]) => {
        setTimeout(() => {
          this.imagenesProducto = data;
          data.forEach((img: any) => {
            if (img.orden < 4) this.slots[img.orden] = img.url;
          });
          this.cdr.detectChanges();
        });
      }
    });
  }

  anyadirImagen() {
    if (!this.nuevaImagen.trim()) return;
    this.imagenesProducto.push({
      url: this.nuevaImagen.trim(),
      orden: this.imagenesProducto.length
    });
    this.nuevaImagen = '';
  }

  quitarImagen(orden: number) {
    this.imagenesProducto = this.imagenesProducto.filter(i => i.orden !== orden);
  }

  guardar() {
    const guardarImagenes = (productoId: number) => {
      if (this.imagenesProducto.length > 0) {
        this.apiService.borrarImagenesProducto({ producto_id: productoId }).subscribe({
          next: () => {
            this.imagenesProducto.forEach((img, index) => {
              this.apiService.anyadirImagenProducto({
                producto_id: productoId,
                url: img.url,
                orden: index
              }).subscribe();
            });
          }
        });
      }
    };

    if (this.editando) {
      this.apiService.editarProducto(this.producto.producto_id, this.producto).subscribe({
        next: () => {
          guardarImagenes(this.producto.producto_id);
          this.mensaje = 'Producto actualizado correctamente.';
          this.mostrarFormulario = false;
          this.cargarProductos();
        },
        error: () => { this.error = 'No se pudo actualizar el producto.'; }
      });
    } else {
      this.apiService.crearProducto(this.producto).subscribe({
        next: (res: any) => {
          if (res.producto_id) guardarImagenes(res.producto_id);
          this.mensaje = 'Producto creado correctamente.';
          this.mostrarFormulario = false;
          this.cargarProductos();
        },
        error: () => { this.error = 'No se pudo crear el producto.'; }
      });
    }
  }

  borrar(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.apiService.borrarProducto(id).subscribe({
        next: () => {
          this.mensaje = 'Producto eliminado correctamente.';
          this.cargarProductos();
        }
      });
    }
  }

  cancelar() {
    this.mostrarFormulario = false;
    this.error = '';
  }

  slots: (string | null)[] = [null, null, null, null];
  arrastrando: number | null = null;

  onFicheroSeleccionado(event: any, index: number) {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('imagen', file);
    this.apiService.subirImagenFichero(formData).subscribe({
      next: (res: any) => {
        setTimeout(() => {
          this.slots[index] = res.url;
          this.imagenesProducto = this.slots
            .map((url, i) => url ? { url, orden: i } : null)
            .filter(x => x !== null);
          this.cdr.detectChanges();
        });
      },
      error: () => alert('No se pudo subir la imagen.')
    });
  }

  onDragStart(index: number) {
    this.arrastrando = index;
  }

  onDrop(index: number) {
    if (this.arrastrando === null || this.arrastrando === index) return;
    const temp = this.slots[index];
    this.slots[index] = this.slots[this.arrastrando];
    this.slots[this.arrastrando] = temp;
    this.arrastrando = null;
    this.imagenesProducto = this.slots
      .map((url, i) => url ? { url, orden: i } : null)
      .filter(x => x !== null);
    this.cdr.detectChanges();
  }

  quitarSlot(index: number) {
    this.slots[index] = null;
    this.imagenesProducto = this.slots
      .map((url, i) => url ? { url, orden: i } : null)
      .filter(x => x !== null);
  }

  onPortadaSeleccionada(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('imagen', file);
    this.apiService.subirImagenFichero(formData).subscribe({
      next: (res: any) => {
        setTimeout(() => {
          this.producto.imagen = res.url;
          this.cdr.detectChanges();
        });
      },
      error: () => alert('No se pudo subir la imagen.')
    });
  }
}