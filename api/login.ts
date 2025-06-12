import { useHttpRequest } from '@/libs/hooks/useHttpRequest';
const { postRequest } = useHttpRequest();

const loginUrl = {
	miniLogin_url: '/api/user/login',
}

// mini login
export const miniLoginApi = (data: API.MiniLogin) => {
	return postRequest(loginUrl.miniLogin_url, data)
}