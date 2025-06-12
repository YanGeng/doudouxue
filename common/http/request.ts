import http from '@/common/http/interceptor';
import { RequestEnum } from '@/libs/enums/httpEnum';

// 更新request函数的类型定义
function request<T>(url: string, method: RequestEnum, data?: any, token?: boolean): Promise<T> {
  return http<T>({
    url,
    method,
    data,
    token,
  });
}

// 封装不同请求方法并使用上面定义的类型
export function getRequest(url: string, data?: any, token?: boolean): Promise<DataType> {
  return request<DataType>(url, RequestEnum.GET, data, token);
}

export function postRequest(url: string, data?: any, token?: boolean): Promise<DataType> {
  return request<DataType>(url, RequestEnum.POST, data, token);
}

export function putRequest(url: string, data?: any, token?: boolean): Promise<DataType> {
  return request<DataType>(url, RequestEnum.PUT, data, token);
}

export function deleteRequest(url: string, data?: any, token?: boolean): Promise<DataType> {
  return request<DataType>(url, RequestEnum.DELETE, data, token);
}