import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private STORAGE_KEY = 'usuarios_db';

  constructor() {
    this.initStorage();
  }

  private initStorage() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const initialData: Usuario[] = [
        { ID: 1, Nombre: 'Juan', Apellido: 'Pérez', FechaNacimiento: '1993-01-01', Estado: 'Activo' },
        { ID: 2, Nombre: 'María', Apellido: 'Gómez', FechaNacimiento: '1998-05-15', Estado: 'Activo' },
        { ID: 3, Nombre: 'Carlos', Apellido: 'Rodríguez', FechaNacimiento: '1982-11-20', Estado: 'Inactivo' }
      ];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialData));
    }
  }

  getUsuario(): Observable<Usuario[]> {
    const data = localStorage.getItem(this.STORAGE_KEY);
    const usuarios: Usuario[] = data ? JSON.parse(data) : [];
    return of(usuarios);
  }

  AgregarUsuario(usuario: Usuario): Observable<Usuario> {
    const data = localStorage.getItem(this.STORAGE_KEY);
    const usuarios: Usuario[] = data ? JSON.parse(data) : [];

    // Generate simple ID
    const maxId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.ID)) : 0;
    usuario.ID = maxId + 1;

    // Set default status if not provided
    if (!usuario.Estado) usuario.Estado = 'Activo';

    usuarios.push(usuario);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuarios));
    return of(usuario);
  }

  EditarUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    const data = localStorage.getItem(this.STORAGE_KEY);
    let usuarios: Usuario[] = data ? JSON.parse(data) : [];

    const index = usuarios.findIndex(u => u.ID === id);
    if (index !== -1) {
      usuarios[index] = { ...usuario, ID: id };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuarios));
    }
    return of(usuarios[index]);
  }

  EliminarUsuario(id: number): Observable<any> {
    const data = localStorage.getItem(this.STORAGE_KEY);
    let usuarios: Usuario[] = data ? JSON.parse(data) : [];

    usuarios = usuarios.filter(u => u.ID !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuarios));
    return of({ success: true });
  }
}

