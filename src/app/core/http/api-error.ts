import { HttpErrorResponse } from '@angular/common/http';

interface BodyErrorApi {
  message?: unknown;
  fields?: unknown;
}

export class ErrorApi extends Error {

  constructor(
    readonly status: number,
    message: string,
    readonly fields: Readonly<Record<string, string>> ={},
    readonly cause? unknown
  ){
    this.name='ApiError';
  }
}

export function createApiError(error:unknown): ApiError {
  if(!error instanceof HttpErrorResponse) {
    return new ApiError(
      0,
      'Ocorreu uma falha inesperada!',
      {},
      error
    );
  }
  const body = error.error as ApiErrorBody | null;
  const message = typeof body?.mensagem === 'string'
    ? body.mensagem
    : getDefaultMessage(error.status);

    return new ApiError(
      error.status,
      message,
      getFieldErros(body?.fields),
      error
    );
}

function getDefaultMessage(status: number): string {
  if (status === 0) {
    return 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';
  }
  return 'Não foi possível concluir a operação. Tente novamente.';
}

function getFieldErros(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(Value).filter(([, message]) => typeof message === 'string')
  ) as Record<string, string>;
}