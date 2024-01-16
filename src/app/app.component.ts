import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmpAddEditComponent } from './emp-add-edit/emp-add-edit.component';
import { EmployeeService } from './services/employee.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CoreService } from './core/core.service';
import * as XLSX from 'xlsx'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
 
})
export class AppComponent implements OnInit {

  

  
  pageTitle = 'EmployeeApp';
  displayedColumns: string[] = [
    'id', 
    'Name',
    'Chooseadate', 
    'Gesamtstunden', 
    'Locatie',
  
    'Oradeiesire',
    'Oradeintrare',
    'OrepeZi',
    'Pause',
    'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private _dialog: MatDialog, 
    private _empService: EmployeeService,
    private _coreService: CoreService){}

  ngOnInit(): void {
      this.getEmployeeList();
  }

  openAddEditEmpForm(){
     const dialogRef = this. _dialog.open(EmpAddEditComponent);
     dialogRef.afterClosed().subscribe({
      next:(val) =>{
        this.getEmployeeList()
      }
     });
  }

  getEmployeeList(){
    this._empService.getEmployeeList().subscribe({
      next:(res) =>{
       this.dataSource = new MatTableDataSource(res);
       this.dataSource.sort = this.sort;
       this.dataSource.paginator =this.paginator;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteEmployee(id: number){
    this._empService.deleteEmployee(id).subscribe({
      next:(res) =>{
        alert('Employee deleted');
        this._coreService.openSnackBar('Employee was deleted', 'done');
        this.getEmployeeList();
      },
      error: console.log,
      
      
    });
  }


  openEditForm(data:any){
   const dialogRef = this._dialog.open(EmpAddEditComponent,{
      data,
    });
    dialogRef.afterClosed().subscribe({
      next:(val) =>{
        this.getEmployeeList()
      }
     });
  }

//default name for file when download
  fileName = "EmployeesTable.xlsx";

  exportExcel(){
    //passing table id
    let data =document.getElementById("main-body");
    const ws:XLSX.WorkSheet = XLSX.utils.table_to_sheet(data)

//Generate workbook and add the worksheet
    const wb:XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,'Sheet1')

    //save to file

    XLSX.writeFile(wb,this.fileName)
  }
}

 

