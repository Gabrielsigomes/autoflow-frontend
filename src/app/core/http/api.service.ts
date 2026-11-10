import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiRequest } from './api-request';
import { createApiError } from './api-error';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private readonly http = inject(HttpClient);

  public request<TResponse, TBody = unknown>(request: ApiRequest<TBody>): Observable<TResponse> {
    return this.http.request<TResponse>(
      request.method,
      this.buildUrl(request.endpoint),
      {
        body: request.body,
        headers: request.headers,
        params: request.params,
        context: request.context,
        withCredentials: request.withCredentials
      }
    ).pipe(
      
      catchError(error => throwError(() => createApiError))
    );
  }

  private buildUrl(endpoint: string): string {
    if (/^https?:\/\//i.test(endpoint)) {
      throw new Error('ApiService aceita somente caminhos internos da API.');
    }

    const baseUrl = environment.apiUrl.replace(/\/+$/,'');

    if(!baseUrl){
      throw new Error('A URL da API não foi configurada para este ambiente.');
    }

    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${path}`;
  }

}