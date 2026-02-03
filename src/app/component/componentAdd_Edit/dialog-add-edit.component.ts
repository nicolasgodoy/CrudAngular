import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario';


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
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private usuarioService: UsuarioService,
    @Inject(MAT_DIALOG_DATA) public dataUsuario: Usuario
  ) {
    this.formUsuario = this.fb.group({
      ID: [0, Validators.required],
      Nombre: ["", Validators.required],
      Apellido: ["", Validators.required],
      FechaNacimiento: ["", Validators.required],
      Estado: ["Activo", Validators.required]
    })
  }

  mensajeAlerta(msg: string, accion: string) {
    this._snackBar.open(msg, accion, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });
  }

  AgregarEditUsuario() {
    const modelo: Usuario = {
      ID: this.formUsuario.value.ID,
      Nombre: this.formUsuario.value.Nombre,
      Apellido: this.formUsuario.value.Apellido,
      FechaNacimiento: this.formUsuario.value.FechaNacimiento,
      Estado: this.formUsuario.value.Estado
    }

    if (this.dataUsuario == null) {
      this.usuarioService.AgregarUsuario(modelo).subscribe({
        next: (data) => {
          this.mensajeAlerta("Usuario Creado", "Listo")
          this.dialogoReferencia.close("creado");
        }, error: (e) => {
          this.mensajeAlerta("No se pudo crear", "error");
        }
      })
    } else {
      this.usuarioService.EditarUsuario(this.dataUsuario.ID, modelo).subscribe({
        next: (data) => {
          this.mensajeAlerta("Usuario Editado", "Listo")
          this.dialogoReferencia.close("editado");
        }, error: (e) => {
          this.mensajeAlerta("No se pudo editar", "error");
        }
      })
    }
  }

  ngOnInit(): void {
    if (this.dataUsuario) {
      this.formUsuario.patchValue({
        ID: this.dataUsuario.ID,
        Nombre: this.dataUsuario.Nombre,
        Apellido: this.dataUsuario.Apellido,
        FechaNacimiento: this.dataUsuario.FechaNacimiento,
        Estado: this.dataUsuario.Estado
      })

      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }
  }
}
