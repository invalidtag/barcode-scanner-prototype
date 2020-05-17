import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {QuaggaJSConfigObject} from "@ericblade/quagga2";
import {NgxBarcodeScannerService} from "./ngx-barcode-scanner.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'ngx-barcode-scanner',
  templateUrl: './ngx-barcode-scanner.component.html',
  styleUrls: ['./ngx-barcode-scanner.component.css']
})
export class NgxBarcodeScannerComponent implements OnInit, OnDestroy {
  @Input() codes: string | string[] = [
    'code_128', 'ean', 'ean_8', 'code_39', 'code_39_vin',
    'codabar', 'upc', 'upc_e', 'i2of5', '2of5', 'code_93'];
  @Input() config: QuaggaJSConfigObject;
  @Input() errorThreshold: number;
  @Input() value: string;
  @Output() valueChange = new EventEmitter();
  @Output() exception = new EventEmitter();
  private serviceSubscription: Subscription;

  constructor(private service: NgxBarcodeScannerService) { }

  ngOnInit(): void {
    // document.documentElement.requestFullscreen().catch(err => console.log('Failed to request full-screen: ' + err));
    this.setConfig();
    const threshold = isNaN(this.errorThreshold) ? 0.1 : this.errorThreshold;
    this.serviceSubscription = this.service.start(this.config, threshold)
      .subscribe((value) => {
        this.valueChange.emit(value);
        this.service.stop();
      }, error => {
        this.exception.emit(error);
      });
  }

  ngOnDestroy(): void {
    this.serviceSubscription.unsubscribe();
    this.service.stop();
  }

  readers(): string[] {
    const types = (typeof this.codes === 'string') ? [this.codes] : this.codes;
    return types.map(it => it + '_reader');
  }

  private setConfig() {
    if (!this.config) {
      this.config = {
        ...this.service.defaultConfig(), decoder: {
          readers: this.readers()
        }
      };
    }
    if (!this.config.inputStream) {
      this.config.inputStream = {};
    }
    this.setOrDefault(this.config.inputStream, 'name', 'Live');
    this.setOrDefault(this.config.inputStream, 'type', 'LiveStream');
    if (!this.config.locator) {
      this.config.locator = {};
    }
    this.setOrDefault(this.config.locator, 'patchSize', 'medium');
    this.setOrDefault(this.config.locator, 'halfSample', false);
    this.setOrDefault(this.config, 'locate', true);
    this.setOrDefault(this.config, 'numOfWorkers', 8);
    this.setOrDefault(this.config, 'frequency', 10);
    if (!this.config.decoder) {
      this.config.decoder = {};
    }
    this.setOrDefault(this.config.decoder, 'readers', this.readers());

  }

  setOrDefault(object: any, path: string, value: any): void {
    if (typeof object[path] === 'undefined') {
      object[path] = value;
    }
  }
}
