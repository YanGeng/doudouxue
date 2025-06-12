import { useHttpRequest } from '@/libs/hooks/useHttpRequest';
const { getRequest, postRequest, putRequest, deleteRequest } = useHttpRequest();

const homeUrl = {
	get_url: '/api/test/get',
	post_url: '/api/test/post',
	put_url: '/api/test/put',
	delete_url: '/api/test/delete'
}

// getRequest
export const testGetApi = (data?: any) => {
	return getRequest(homeUrl.get_url, data)
}

// postRequest
export const testPostApi = (data?: any) => {
	return postRequest(homeUrl.post_url, data)
}

// putRequest
export const testPutApi = (data?: any) => {
	return putRequest(homeUrl.put_url, data)
}

// deleteRequest
export const testDeleteApi = (data?: any) => {
	return deleteRequest(homeUrl.delete_url, data)
}