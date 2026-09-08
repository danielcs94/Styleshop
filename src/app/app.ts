import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CarritoSidebarComponent } from './components/carrito-sidebar/carrito-sidebar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CarritoSidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'StyleShop';

  @ViewChild('carritoSidebar') carritoSidebar!: CarritoSidebarComponent;

  onActivate(component: any, sidebar: CarritoSidebarComponent) {
    if (component.productoAnyadido) {
      component.productoAnyadido.subscribe((usuarioId: number) => {
        sidebar.abrir(usuarioId);
      });
    }
  }
}