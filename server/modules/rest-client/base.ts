import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import logger from '../logger';

class RestClient {
  private http: AxiosInstance;
  public baseUrl?: string;
  public willSendRequest?(config: object): AxiosRequestConfig;

  public constructor() {
    this.http = axios.create({
      timeout: 5000,
    });

    this.initInterceptors();
  }

  private initInterceptors(): any {
    return this.http.interceptors.request.use(
      axiosConfig => {
        const config = { ...axiosConfig };
        const requestConfig = {
          auth: {
            set: (username: string, password: string) => {
              config.auth = {
                username,
                password,
              };
            },
          },
          baseUrl: {
            set: (url: string) => {
              config.baseURL = url;
            },
          },
          headers: {
            set: (key: string, value: string) => {
              config.headers.common[key] = value;
            },
          },
        };

        if (this.willSendRequest) {
          this.willSendRequest(requestConfig);
        }

        return config;
      },
      error => {
        logger.error({ err: error }, 'REST-CLIENT: Init interceptors failed');
      }
    );
  }

  public get(urlPath: string, options?: AxiosRequestConfig): any {
    return this.http
      .get(urlPath, options)
      .then((response: any) => {
        return { response: response.data, error: null };
      })
      .catch((error: any) => {
        return {
          response: null,
          error: {
            status: error.response.status,
            code: error.response.statusText,
            message: error.response.data.message,
          },
        };
      });
  }

  public post(
    urlPath: string,
    requestBody?: object | string,
    options?: AxiosRequestConfig
  ): any {
    return this.http
      .post(urlPath, requestBody, options)
      .then((response: any) => {
        return { response: response.data, error: null };
      })
      .catch((error: any) => {
        return {
          response: null,
          error: {
            status: error.response.status,
            code: error.response.statusText,
            message: error.response.data.message,
          },
        };
      });
  }

  public put(
    urlPath: string,
    requestBody?: object,
    options?: AxiosRequestConfig
  ): any {
    return this.http
      .put(urlPath, requestBody, options)
      .then((response: any) => {
        return { response: response.data, error: null };
      })
      .catch((error: any) => {
        return {
          response: null,
          error: {
            status: error.response.status,
            code: error.response.statusText,
            message: error.response.data.message,
          },
        };
      });
  }

  public patch(
    urlPath: string,
    requestBody?: object,
    options?: AxiosRequestConfig
  ): any {
    return this.http
      .patch(urlPath, requestBody, options)
      .then((response: any) => {
        return { response: response.data, error: null };
      })
      .catch((error: any) => {
        return {
          response: null,
          error: {
            status: error.response.status,
            code: error.response.statusText,
            message: error.response.data.message,
          },
        };
      });
  }

  public delete(urlPath: string, options?: AxiosRequestConfig): any {
    return this.http
      .delete(urlPath, options)
      .then((response: any) => {
        return { response: response.data, error: null };
      })
      .catch((error: any) => {
        return {
          response: null,
          error: {
            status: error.response.status,
            code: error.response.statusText,
            message: error.response.data.message,
          },
        };
      });
  }
}

export { RestClient };
