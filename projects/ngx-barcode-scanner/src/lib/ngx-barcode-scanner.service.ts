import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";
import Quagga, { QuaggaJSConfigObject, QuaggaJSResultObject } from "@ericblade/quagga2";

@Injectable({
  providedIn: 'root'
})
export class NgxBarcodeScannerService {
  private scanResult: Subject<string>;

  constructor() {
  }

  public defaultConfig(): QuaggaJSConfigObject {
    return {
      inputStream: {
        name: 'Live',
        type: 'LiveStream',
      },
      locator: {
        patchSize: 'medium',
        halfSample: false
      },
      locate: true,
      /**
       * According to https://github.com/ericblade/quagga2#numofworkers,
       * the value of numOfWorkers is always set to 0 for now.
       */
      numOfWorkers: 8,
      frequency: 10
    };
  }

  private meanBy(arr: any[], property: string): number {
    if (!arr) {
      return undefined;
    }
    return arr.reduce((acc, item) => (property in item) ? acc + item[property] : acc, 0) / arr.length;
  }

  isScanMatch(scanResult: QuaggaJSResultObject, errorThresholdPercentage: number) {
    const avgErrors = this.meanBy(scanResult.codeResult.decodedCodes, 'error');
    return avgErrors < errorThresholdPercentage;
  }

  start(config: QuaggaJSConfigObject, errorThresholdPercentage: number): Observable<string> {
    if (typeof this.scanResult === 'undefined') {
      this.scanResult = new Subject<string>();
    }
    Quagga.onProcessed((scanResult: QuaggaJSResultObject) => {
      this.onProcessed(scanResult);
    });
    Quagga.onDetected((result: QuaggaJSResultObject) => {
      const barcode = result.codeResult.code;
      if (this.isScanMatch(result, errorThresholdPercentage)) {
        this.scanResult.next(barcode + '');
      }
    });

    Quagga.init(config, (error) => {
      if (error) {
        this.scanResult.error(error);
        this.stop();
      } else {
        // this.resizeCanvasAndVideoElements();
        Quagga.start();
      }
    });

    return this.scanResult;
  }

  stop() {
    if (typeof this.scanResult !== 'undefined') {
      // this.scanResult.unsubscribe();
    }
    Quagga.stop();
  }

  private onProcessed(result: QuaggaJSResultObject) {
    const drawingCtx = Quagga.canvas.ctx.overlay;
    const drawingCanvas = Quagga.canvas.dom.overlay;

    if (result) {
      if (result.boxes) {
        drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute('width'), 10),
          parseInt(drawingCanvas.getAttribute('height'), 10));
        // result.boxes.filter((box) => box !== result.box).forEach((box) => {
        //   Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: 'green', lineWidth: 2});
        // });
      }

      // if (result.box) {
      //   Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: '#00F', lineWidth: 2});
      // }

      if (result.codeResult && result.codeResult.code) {
        drawingCtx.shadowBlur = 5;
        drawingCtx.shadowColor = "red";
        drawingCtx.shadowOffsetY = 3;
        Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'white', lineWidth: 3});
        drawingCtx.shadowBlur = 5;
        drawingCtx.shadowColor = "red";
        drawingCtx.shadowOffsetY = -3;
        Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'white', lineWidth: 3});
      }
    }
  }

  private resizeCanvasAndVideoElements() {
    const canvasElements = document.getElementsByClassName('drawingBuffer');
    const videoElements = document.getElementsByTagName('video');
    if (canvasElements && videoElements && canvasElements.length > 0 && videoElements.length > 0) {
      const canvas = canvasElements[0] as HTMLCanvasElement;
      const video = videoElements[0] as HTMLVideoElement;
      // video.width = canvas.width = window.innerWidth;
      // video.height = canvas.height = window.innerHeight;
      canvas.width = video.width = document.body.clientWidth;
      canvas.height = video.height = document.body.clientHeight;
    }
  }
}
