import { HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpMethod } from './http-method';

export interface ApiRequest<TBody = unknown> {
  method: HttpMethod;
  endpoint: string;
  body?: TBody;
  headers?: HttpHeaders;
  params?: HttpParams;
  context?: HttpContext;
  withCredentials?: boolean;
}