import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-catalogo',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class CatalogoComponent implements OnInit {
  productos: any[] = [];
  categorias: any[] = [];
  cargando = true;
  busqueda = '';

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarProductos();
    this.cargarCategorias();
  }

  cargarProductos() {
    this.cargando = true;
    this.apiService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.cargando = false;
        this.cdr.detectChanges(); // ← fuerza la actualización
      },
      error: () => { this.cargando = false; this.cdr.detectChanges(); }
    });
  }

  cargarCategorias() {
    this.apiService.getCategorias().subscribe({
      next: (data) => { this.categorias = data; }
    });
  }

  filtrarPorCategoria(categoriaId: number) {
  this.cargando = true;
  this.apiService.getProductosPorCategoria(categoriaId).subscribe({
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

buscar() {
  if (!this.busqueda.trim()) {
    this.cargarProductos();
    return;
  }
  this.cargando = true;
  this.apiService.buscarProductos(this.busqueda).subscribe({
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
}