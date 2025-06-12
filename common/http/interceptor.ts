/**
 * @description 此处请求封装适用于普通request请求，根据需要携带token，并且是无痛刷新token的应用场景
 * @param config config 是全局的配置文件对象
 * @param md5 md5 是采用数据加盐进行md5加密
 * @param timeout timeout 设置请求超时时间 
 * @param isRefreshingToken isRefreshingToken 是否需要刷新token(默认为false不需要刷新token)
 * @param subscribeWaitRequests subscribeWaitRequests 订阅请求等待队列数组
 * ---------------------------cut-off----------------------------
 * @description  如果token为true的时候需要token(一般会在登录的时候存储token和token_type)  为false不需要token
 * @description  config.header['Authorization'] = 'Bearer ' + uni.getStorageSync('token'); // token_type 一般情况下为'Bearer ' 切记有空格
 * @description  config.header['Content-Type'] = 'application/x-www-form-urlencoded'; // 常规请求头配置
 */
import config from '@/common/config' // 导入私有配置
import md5 from '@/common/md5/md5-service'; // 导入md5加密配置

const _config = config.http;
const env = process.env.NODE_ENV === 'development';

let timeout = 10000;
let isRefreshingToken = false;
let subscribeWaitRequests: (() => void)[] = [];

const http: HttpInterceptor = <T>(options: RequestOptions): Promise<T> => {
	const { url, data, token } = options;

	const formattedUrl = _config.url + url;
	const formattedData = typeof data === "string" ? JSON.parse(data) : data;
	const signature = generateSignature(data);

	const header = {
		'Content-Type': typeof data === "object" ? 'application/json' : 'application/x-www-form-urlencoded',
		'signature': signature,
		...(token && { 'Authorization': uni.getStorageSync('token') }),
	};

	_config.header = header;
	// 使用统一默认timeout
	let requestTimeout = timeout;

	return new Promise((resolve, reject) => {
		logRequest(options, formattedUrl, formattedData, signature);

		uni.request({
			..._config,
			...options,
			url: formattedUrl,
			data: formattedData,
			timeout: requestTimeout,
			complete: (response: ResponseData) => handleResponse(response, options, resolve, reject)
		});
	});
}

const generateSignature = (data: any): string => {
	if (!data) return md5("" + config.salt);

	const jsonData = JSON.stringify(data);
	return md5(md5(jsonData) + config.salt);
}

const logRequest = (options: RequestOptions, url: string, data: any, signature: string) => {
	env && console.log(`发起请求：${url}，参数：${JSON.stringify(data)}，签名：${signature}`);
}

const handleResponse = (response: ResponseData, options: RequestOptions, resolve: (value?: any) => void, reject: (reason?: any) => void) => {
	const { statusCode, data } = response;

	if (statusCode === 200) {
		env && console.log(`请求：${options.url} 成功，返回值：${JSON.stringify(data)}`);
		if (data.code === 10001) { // 此处code码，请与后台协商
			// 刷新token的函数,这需要添加一个开关，防止重复请求
			if (!isRefreshingToken) {
				isRefreshingToken = true;
				refreshTokenFetch(options).then(() => {
					onAccessTokenFetched();
					resolve();
				}).catch((error) => {
					reject(error);
				}).finally(() => {
					isRefreshingToken = false;
				});
			} else {
				subscribeRequests(resolve);
			}
		} else if (data.code === 10002) {
			resolveAliSMS(data.result)
			reject(data.result)
		} else {
			resolve(data);
		}
	} else {
		env && console.log(`请求：${options.url} 失败，返回值：${JSON.stringify(response)}`);
		handleError(statusCode, response, options);
		reject(response);
		// handleCatch(response, options, resolve, reject);
	}
}

// 获取新的令牌请求
const refreshTokenFetch = async (options: RequestOptions) => {
	// 需在此处实现令牌刷新请求逻辑
}

// 请求成功后重新请求
const onAccessTokenFetched = () => {
	subscribeWaitRequests.forEach(callback => {
		callback();
	});
	isRefreshingToken = false;
	subscribeWaitRequests = [];
}

// 订阅收集所有令牌失效的请求
const subscribeRequests = (callback: () => void) => {
	subscribeWaitRequests.push(callback);
}

// 阿里短信统一拦截
const resolveAliSMS = (res: any) => {
	switch (res.code) {
		case "isv.DAY_LIMIT_CONTROL":
			uni.showToast({
				icon: 'none',
				title: '平台短信日发送量已超限，请稍后再试。',
				duration: 2000
			})
			break;
		case "isv.BUSINESS_LIMIT_CONTROL":
			uni.showToast({
				icon: 'none',
				title: '该手机号发送频率超限，请稍后再试。',
				duration: 2000
			})
			break;
		default:
			uni.showToast({
				icon: 'none',
				title: '短信发送失败，请联系客服。',
				duration: 2000
			})
			break;
	}
}

// TODO 处理catch 请求异常（暂时无用）
const handleCatch = (response: ResponseData, options: RequestOptions, resolve: (value?: any) => void, reject: (reason?: any) => void) => {
	// 处理catch 请求，不在本页面之外处理，统一在这里处理
	if ((options as any).handle) {
		env && console.log("请求：", options.url, "异常，请在方法调用处处理该异常，返回值：", JSON.stringify(response.data))
		reject(response)
	} else {
		try {
			Promise.reject(response).catch(err => {
				handleError(response.statusCode || response.errMsg, response, options);
			});
		} catch (err) {
			console.log(err)
		}
	}
}

function handleError(statusCode: string | number | undefined, response: ResponseData, options: RequestOptions) {
	const { url } = options;
	const errorMessage = response.data?.message || 'Unknown error';

	uni.showToast({
		icon: 'none',
		title: errorMessage,
		duration: 2000
	});

	switch (statusCode) {
		case 400:
			env && console.error(`请求接口:${url} 异常，错误代码: 400, 请检查：1、接口名是否书写正确？2、参数是否与接口匹配？3、后台接口开发人员是否已将代码发布到开发环境？`);
			break;
		case 401:
			env && console.error(`请求接口:${url} 授权失败，错误代码: 401, 请检查：header是否设置正确？`);
			break;
		case 404:
			env && console.error(`没有找到接口:${url}，错误代码: 404, 请检查：1、接口名是否书写正确？2、参数是否与接口匹配？3、后台接口开发人员是否已将代码发布到开发环境？`);
			break;
		case 405:
			env && console.error(`请求接口:${url} 异常，错误代码: 405, 请检查：请求method是否填写正确？如：get写成post等`);
			break;
		case 500:
			env && console.error(`请求接口:${url} 后台代码异常，错误代码: 500, 请联系后台接口开发人员检查代码。异常信息: ${errorMessage}`);
			break;
		default:
			env && console.error(`请求接口:${url} 发生未知错误，错误代码: ${statusCode}`);
			break;
	}
}

export default http;