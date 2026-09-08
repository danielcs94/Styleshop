import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // URL base de nuestra API PHP
  private apiUrl = 'http://localhost:8888/styleshop/api';

  constructor(private http: HttpClient) { }

  // ─── PRODUCTOS ───────────────────────────────────────────
  getProductos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/?ruta=productos`);
  }

  getProducto(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/?ruta=productos&accion=detalle&id=${id}`);
  }

  getProductosPorCategoria(categoriaId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/?ruta=productos&accion=categoria&id=${categoriaId}`);
  }

  buscarProductos(q: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/?ruta=productos&accion=buscar&q=${q}`);
  }

  crearProducto(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/?ruta=productos&accion=crear`, datos);
  }

  editarProducto(id: number, datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/?ruta=productos&accion=editar&id=${id}`, datos);
  }

  borrarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/?ruta=productos&accion=borrar&id=${id}`);
  }

  // ─── CATEGORÍAS ──────────────────────────────────────────
  getCategorias(): Observable<any> {
    return this.http.get(`${this.apiUrl}/?ruta=categorias`);
  }

  // ─── CARRITO ─────────────────────────────────────────────
  getCarrito(usuarioId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/?ruta=carrito&usuario_id=${usuarioId}`);
  }

  anadirAlCarrito(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/?ruta=carrito&accion=añadir`, datos);
  }

  actualizarCarrito(datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/?ruta=carrito&accion=actualizar`, datos);
  }

  eliminarDelCarrito(datos: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/?ruta=carrito&accion=eliminar`, { body: datos });
  }

  vaciarCarrito(datos: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/?ruta=carrito&accion=vaciar`, { body: datos });
  }

  // ─── PEDIDOS ─────────────────────────────────────────────
  crearPedido(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/?ruta=pedidos&accion=crear`, datos);
  }

  getPedidos(usuarioId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/?ruta=pedidos&usuario_id=${usuarioId}`);
  }

  getDetallePedido(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/?ruta=pedidos&accion=detalle&id=${id}`);
  }

  getTodosPedidos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/?ruta=pedidos&accion=todos`);
  }

  cambiarEstadoPedido(id: number, estado: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/?ruta=pedidos&accion=estado&id=${id}`, { estado });
  }

  getImagenesProducto(productoId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/?ruta=productos&accion=imagenes&id=${productoId}`);
  }

  anyadirImagenProducto(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/?ruta=productos&accion=subir-imagen`, datos);
  }

  borrarImagenesProducto(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/?ruta=productos&accion=borrar-imagenes`, datos);
  }

  subirImagenFichero(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/?ruta=subir-fichero`, formData);
  }
}
