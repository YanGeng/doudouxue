import { getRequest, postRequest, putRequest, deleteRequest } from '@/common/http/request';

export function useHttpRequest() {
  return {
    getRequest,
    postRequest,
    putRequest,
    deleteRequest,
  };
}