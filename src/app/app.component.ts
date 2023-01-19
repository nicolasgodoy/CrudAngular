import { Component } from '@angular/core';

import { Usuario } from './models/usuario';
import { UsuarioService } from './services/usuario.service';
import {AfterViewInit,ViewChild,OnInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import { DialogAddEditComponent } from './component/componentAdd_Edit/dialog-add-edit.component';
import { ComponentDelete } from './component/component.delete/component.delete';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  
})
export class AppComponent implements AfterViewInit,OnInit {
  displayedColumns: string[] = ['ID','Nombre', 'Apellido', 'Edad','Acciones'];
  dataSource = new MatTableDataSource<Usuario>();

  constructor( private usuarioService: UsuarioService,public dialog: MatDialog,
    private _snackBar: MatSnackBar
    ){

  }

  ngOnInit(): void {
    this.mostrarUsuario();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  mostrarUsuario(){
    this.usuarioService.getUsuario().subscribe({
      next:(dataResponse) => {
        console.log(dataResponse);
        this.dataSource.data = dataResponse;
      },error:(e)=>{}
    })
  }

  dialogNuevoEmpleado() {
    this.dialog.open(DialogAddEditComponent,{
      disableClose:true,
      
    }).afterClosed().subscribe(resultado => {
      if (resultado === "creado"){
        this.mostrarUsuario();
      }
    })
  }

  dialogEditarEmpleado(dataUsuario: Usuario) {
    this.dialog.open(DialogAddEditComponent,{
      disableClose:true,
      data:dataUsuario,
    }).afterClosed().subscribe(resultado => {
      if (resultado === "editado"){
        this.mostrarUsuario();
      }
    })
  }

  mensajeAlerta(msg:string, accion:string) {
    this._snackBar.open(msg, accion,{
      horizontalPosition:"end",
      verticalPosition:"top",
      duration:3000
    });
  }

  dialogEliminarEmpleado(dataUsuario: Usuario) {
    this.dialog.open(ComponentDelete,{
      disableClose:true,
      data:dataUsuario,
    }).afterClosed().subscribe(resultado => {
      if (resultado === "eliminar"){
        this.usuarioService.EliminarUsuario(dataUsuario.ID).subscribe({
          next:(data) => {
            this.mensajeAlerta("Empleado Eliminado Correctamente!!", "Listo")
            this.mostrarUsuario();
          },
          error:(e) => {}
        })
      }
    })
  }



  


   /*  mostrar = false; 
    
    usuario:Usuario = new Usuario();
   datatable:any = []; 

   constructor(private usuarioService:UsuarioService){

   }

   ngOnInit(): void{
    this.onDataTable();
   }

   onDataTable(){
     this.usuarioService.getUsuario().subscribe(res => {
       this.datatable = res;
       
     })
   }

   onSetData(select:any){
    this.usuario.id = select.ID;
    this.usuario.Nombre = select.Nombre;
    this.usuario.Apellido = select.Apellido;
    this.usuario.Edad = select.Edad;
    
  }

  clear(){
    this.usuario.id =0;
    this.usuario.Nombre = "";
    this.usuario.Apellido = "";
    this.usuario.Edad = 0;
  }

   ClickAgregarUsuario(usuario:Usuario):void{
      this.usuarioService.AgregarUsuario(usuario).subscribe(res =>  {
        if(res == null){
          Swal.fire('El usuario se agrego correctamente!!')
          this.onDataTable();
        }else{
          Swal.fire('Hubo algun error, intente nuevamente..')
        }
      });
      
   }

   ClickEditarUsuario(usuario:Usuario):void{
    this.usuarioService.EditarUsuario(usuario.id, usuario).subscribe(res =>  {
      if(res == null){
        Swal.fire('El usuario se edito correctamente!!')
        this.onDataTable();
      }else{
        Swal.fire('Hubo algun error, intente nuevamente..')
      }
    });
    
 }

   ClickEliminarUsuario(id:number):void{
    this.usuarioService.EliminarUsuario(id).subscribe(res =>  {
      if(res == null){
        Swal.fire('El usuario se elimino correctamente!!')
        this.onDataTable();
      }else{
        Swal.fire('Hubo algun error, intente nuevamente..')
      }
    });
   } */
}


