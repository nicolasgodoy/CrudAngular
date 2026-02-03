import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-component.delete',
  templateUrl: './component.delete.html',
  styleUrls: ['./component.delete.css']
})
export class ComponentDelete implements OnInit {

  constructor(
    private dialogoReferencia: MatDialogRef<ComponentDelete>,
    @Inject(MAT_DIALOG_DATA) public dataUsuario: Usuario
  ) { }

  ngOnInit(): void {

  }

  eliminarUsuario() {
    if (this.dataUsuario) {
      this.dialogoReferencia.close("eliminar");
    }
  }

}
