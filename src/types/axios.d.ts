import "axios";

declare module "axios" {
    export interface AxiosRequestConfig {
        skipAuthInterceptor?: boolean;
        _retry?: boolean;
    }
}
