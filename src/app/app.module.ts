import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxBarcodeScannerModule } from "../../projects/ngx-barcode-scanner/src/lib/ngx-barcode-scanner.module";
import { ResultComponent } from './result/result.component';
import { BarcodeScannerComponent } from './barcode-scanner/barcode-scanner.component';

@NgModule({
  declarations: [
    AppComponent,
    BarcodeScannerComponent,
    ResultComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxBarcodeScannerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
