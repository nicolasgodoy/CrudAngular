import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Usuario } from '../models/usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http:HttpClient) {}
  
  url:string = "https://crud-angular-one.vercel.app.SQL1002.site4now.net/api/Usuario";
  //url:string = "http://www.apiangularapp.somee.com/api/Usuario";
  // url:string = "https://localhost:44330/api/Usuario"; // PARA TRABAJAR LOCAL
  

  getUsuario(){
    return this.http.get<Usuario[]>(this.url);
    
  }

  AgregarUsuario(usuario:Usuario):Observable<Usuario>{
    return this.http.post<Usuario>(this.url, usuario);
  }

  EditarUsuario(id:number, usuario:Usuario):Observable<Usuario>{
    return this.http.put<Usuario>(this.url + `/${id}`, usuario);
  }

  EliminarUsuario(id:number){
    return this.http.delete<Usuario>(this.url + `/${id}`);
  }


   
}
