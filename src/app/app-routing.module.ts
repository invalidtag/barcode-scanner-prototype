import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ResultComponent} from "./result/result.component";
import {BarcodeScannerComponent} from "./barcode-scanner/barcode-scanner.component";

const routes: Routes = [
  { path: '', redirectTo: 'barcode', pathMatch: 'full' },
  { path: 'barcode', component: BarcodeScannerComponent },
  { path: 'result/:barcode', component: ResultComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
