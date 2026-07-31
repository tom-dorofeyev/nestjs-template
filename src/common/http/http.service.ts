import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class HttpService {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create();
  }

  private async request<T>(
    config: AxiosRequestConfig,
    extraConfig?: Partial<AxiosRequestConfig>,
  ): Promise<T> {
    try {
      const mergedConfig = { ...config, ...extraConfig };
      const response: AxiosResponse<T> =
        await this.axiosInstance.request(mergedConfig);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }

  get<T>(
    url: string,
    params?: any,
    headers?: any,
    extraConfig?: Partial<AxiosRequestConfig>,
  ): Promise<T> {
    return this.request<T>(
      { method: 'GET', url, params, headers },
      extraConfig,
    );
  }

  post<T>(
    url: string,
    data?: any,
    headers?: any,
    extraConfig?: Partial<AxiosRequestConfig>,
  ): Promise<T> {
    return this.request<T>({ method: 'POST', url, data, headers }, extraConfig);
  }

  put<T>(
    url: string,
    data?: any,
    headers?: any,
    extraConfig?: Partial<AxiosRequestConfig>,
  ): Promise<T> {
    return this.request<T>({ method: 'PUT', url, data, headers }, extraConfig);
  }

  delete<T>(
    url: string,
    params?: any,
    headers?: any,
    extraConfig?: Partial<AxiosRequestConfig>,
  ): Promise<T> {
    return this.request<T>(
      { method: 'DELETE', url, params, headers },
      extraConfig,
    );
  }

  patch<T>(
    url: string,
    data?: any,
    headers?: any,
    extraConfig?: Partial<AxiosRequestConfig>,
  ): Promise<T> {
    return this.request<T>(
      { method: 'PATCH', url, data, headers },
      extraConfig,
    );
  }
}
