import { HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpMethod } from '.http-method';

export interface ApiRequest<TBody = unknown> {
  method: HttpMethod;
  endpoint: string;
  body?: TBody;
  headers?: HttoHeaders;
  params?: HttpParams;
  context?: HttpContext;
  withCredencials?: boolean;
}