import { Component, OnInit,Inject } from '@angular/core';
import {FormBuilder,FormGroup,Validators} from "@angular/forms";
import {MatDialogRef,MAT_DIALOG_DATA} from "@angular/material/dialog";

import {MatSnackBar} from "@angular/material/snack-bar";

import { MAT_DATE_FORMATS } from '@angular/material/core';

import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-dialog-add-edit',
  templateUrl: './dialog-add-edit.component.html',
  styleUrls: ['./dialog-add-edit.component.css']
})
export class DialogAddEditComponent implements OnInit {
  
  formUsuario: FormGroup;
  tituloAccion: string = "Nuevo";
  botonAccion: string = "Guardar";
  listaUsuarios: Usuario[] = [];
  
  constructor(
    private dialogoReferencia: MatDialogRef<DialogAddEditComponent>,
    private fb:FormBuilder,
    private _snackBar: MatSnackBar,
    private usuarioService: UsuarioService,
    @Inject (MAT_DIALOG_DATA) public dataUsuario:Usuario
  )
  {
    this.formUsuario = this.fb.group({
      ID:[0,Validators.required],
      Nombre:["",Validators.required],
      Apellido:["",Validators.required],
      Edad:["",Validators.required],
    })

    this.usuarioService.getUsuario().subscribe({
      next:(data) => {
        this.listaUsuarios = data;
      },error:(e) => { }
    })

  }

  mensajeAlerta(msg:string, accion:string) {
    this._snackBar.open(msg, accion,{
      horizontalPosition:"end",
      verticalPosition:"top",
      duration:3000
    });
  }

  AgregarEditUsuario(){
    
    console.log(this.formUsuario.value)
    const modelo: Usuario ={
      ID:this.formUsuario.value.ID,
      Nombre:this.formUsuario.value.Nombre,
      Apellido:this.formUsuario.value.Apellido,
      Edad:this.formUsuario.value.Edad

    }

    if(this.dataUsuario == null){
                          /* ADD */
      this.usuarioService.AgregarUsuario(modelo).subscribe({
        next:(data) => {
          this.mensajeAlerta("Empleado Creado","Listo")
          this.dialogoReferencia.close("creado");
        },error:(e) => {
          this.mensajeAlerta("No se pudo crear","error");
        }
      })
    }else{                /* UPDATE */
      this.usuarioService.EditarUsuario(this.dataUsuario.ID, modelo).subscribe({
        next:(data) => {
          this.mensajeAlerta("Empleado Editado","Listo")
          this.dialogoReferencia.close("editado");
        },error:(e) => {
          this.mensajeAlerta("No se pudo editar","error");
        }
      })
    }

    
  }

  
  ngOnInit(): void {
    if(this.dataUsuario){
      this.formUsuario.patchValue({ /* patch Value Actualiza(SETEA) todos los valores del formulario*/
        ID: this.dataUsuario.ID,
        Nombre: this.dataUsuario.Nombre,
        Apellido: this.dataUsuario.Apellido,
        Edad: this.dataUsuario.Edad 
      })

      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }
  }
}
