import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class HttpService {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create();
  }

  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> =
        await this.axiosInstance.request(config);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }

  get<T>(url: string, params?: any, headers?: any): Promise<T> {
    return this.request<T>({ method: 'GET', url, params, headers });
  }

  post<T>(url: string, data?: any, headers?: any): Promise<T> {
    return this.request<T>({ method: 'POST', url, data, headers });
  }

  put<T>(url: string, data?: any, headers?: any): Promise<T> {
    return this.request<T>({ method: 'PUT', url, data, headers });
  }

  delete<T>(url: string, params?: any, headers?: any): Promise<T> {
    return this.request<T>({ method: 'DELETE', url, params, headers });
  }

  patch<T>(url: string, data?: any, headers?: any): Promise<T> {
    return this.request<T>({ method: 'PATCH', url, data, headers });
  }
}
