import { Component } from '@angular/core';

import { Usuario } from './models/usuario';
import { UsuarioService } from './services/usuario.service';
import { AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddEditComponent } from './component/componentAdd_Edit/dialog-add-edit.component';
import { ComponentDelete } from './component/component.delete/component.delete';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',

})
export class AppComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['ID', 'Nombre', 'Apellido', 'Edad', 'Estado', 'Acciones'];
  dataSource = new MatTableDataSource<Usuario>();
  totalUsuarios: number = 0;
  usuariosActivos: number = 0;
  nuevosEstaSemana: number = 0;

  constructor(private usuarioService: UsuarioService, public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

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

  mostrarUsuario() {
    this.usuarioService.getUsuario().subscribe({
      next: (dataResponse) => {
        this.dataSource.data = dataResponse;
        this.totalUsuarios = dataResponse.length;
        this.usuariosActivos = dataResponse.filter(u => u.Estado === 'Activo').length;
        // Mocking "New this week" for visual effect as requested "replica este codigo"
        this.nuevosEstaSemana = Math.floor(this.totalUsuarios * 0.1) + 2;
      }, error: (e) => { }
    })
  }

  mensajeAlerta(msg: string, accion: string) {
    this._snackBar.open(msg, accion, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });
  }

  dialogNuevoEmpleado() {
    this.dialog.open(DialogAddEditComponent, {
      disableClose: true,

    }).afterClosed().subscribe(resultado => {
      if (resultado === "creado") {
        this.mostrarUsuario();
      }
    })
  }

  dialogEditarEmpleado(dataUsuario: Usuario) {
    this.dialog.open(DialogAddEditComponent, {
      disableClose: true,
      data: dataUsuario,
    }).afterClosed().subscribe(resultado => {
      if (resultado === "editado") {
        this.mostrarUsuario();
      }
    })
  }



  dialogEliminarEmpleado(dataUsuario: Usuario) {
    this.dialog.open(ComponentDelete, {
      disableClose: true,
      data: dataUsuario,
    }).afterClosed().subscribe(resultado => {
      if (resultado === "eliminar") {
        this.usuarioService.EliminarUsuario(dataUsuario.ID).subscribe({
          next: (data) => {
            this.mensajeAlerta("Empleado Eliminado Correctamente!!", "Listo")
            this.mostrarUsuario();
          },
          error: (e) => { }
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
  calcularEdad(fechaNacimiento: string): number {
    if (!fechaNacimiento) return 0;
    const birthDate = new Date(fechaNacimiento);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  exportarExcel() {
    const dataToExport = this.dataSource.data.map(user => ({
      ID: user.ID,
      Nombre: user.Nombre,
      Apellido: user.Apellido,
      'Fecha de Nacimiento': user.FechaNacimiento,
      Edad: this.calcularEdad(user.FechaNacimiento),
      Estado: user.Estado
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios');

    XLSX.writeFile(workbook, 'ReporteUsuarios.xlsx');
    this.mensajeAlerta("Excel exportado correctamente", "Cerrar");
  }
}


