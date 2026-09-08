import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8888/styleshop/api';

  // BehaviorSubject guarda el usuario actual y avisa a toda la app cuando cambia
  private usuarioSubject = new BehaviorSubject<any>(this.getUsuarioGuardado());
  usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ─── LOGIN ───────────────────────────────────────────────
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/?ruta=auth&accion=login`, { email, password })
      .pipe(
        tap((respuesta: any) => {
          // Guardamos los datos del usuario en localStorage
          localStorage.setItem('usuario', JSON.stringify(respuesta));
          this.usuarioSubject.next(respuesta);
        })
      );
  }

  // ─── REGISTRO ────────────────────────────────────────────
  registro(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/?ruta=auth&accion=registro`, datos);
  }

  // ─── CERRAR SESIÓN ───────────────────────────────────────
  logout(): void {
    localStorage.removeItem('usuario');
    this.usuarioSubject.next(null);
  }

  // ─── OBTENER USUARIO ACTUAL ──────────────────────────────
  getUsuario(): any {
    return this.usuarioSubject.value;
  }

  // ─── COMPROBAR SI HAY SESIÓN ACTIVA ──────────────────────
  estaLogueado(): boolean {
    return this.getUsuario() !== null;
  }

  // ─── COMPROBAR SI ES ADMIN ───────────────────────────────
  esAdmin(): boolean {
    const usuario = this.getUsuario();
    return usuario && usuario.rol === 'admin';
  }

  // ─── RECUPERAR USUARIO DEL LOCALSTORAGE ──────────────────
  private getUsuarioGuardado(): any {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }
}
