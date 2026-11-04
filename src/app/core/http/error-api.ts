import { HttpErrorResponse } from '@angular/common/http';

interface BodyErrorApi {
  message?: unknown;
  fields?: unknown;
}

export class ErrorApi extends Error {

  constructor(readonly status: number, message: string, readonly fields: Readonly<Record<string, string>> ={}, readonly cause? unknown) {
    super(message);
    this.name='ErroApi'
  }

}