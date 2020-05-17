import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.css']
})
export class BarcodeScannerComponent implements OnInit {

  value: string;
  isError = false;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  onError(error) {
    console.error(error);
    this.isError = true;
  }

  onValueChanged(barcode: string) {
    this.router.navigate(['/result', barcode]);
  }

}
