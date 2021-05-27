import axios from 'axios'
import Util from './util'
import Vue from 'vue'
import qs from 'qs';
import {Indicator,Toast} from 'mint-ui'


const $axios = axios.create({
    baseURL: WEBPACK_AJAX_BASE_URL,
    timeout: 30000,
    withCredentials: false
})
const SCUESS_CODE=1000000;
let loadingRequestCount = 0
function showLoading() { 
    if(loadingRequestCount === 0) {
        Indicator.open()
    }
    loadingRequestCount++
}
function hideLoading() { 
    if (loadingRequestCount < 0) return
    loadingRequestCount--
    if(loadingRequestCount === 0){
        Vue.nextTick(() => {
            Indicator.close()
        })
    }
 }

 const serialize = params => {
    const ret = []
    Object.keys(params).forEach(key => {
      const value = params[key]
      if (isPresent(value)) {
        ret.push(`${encode(key)}=${encode(value)}`)
      }
    })
  
    return ret.join('&')
  }

$axios.interceptors.request.use((config) => {
    showLoading()
    if(config.noToken){
        return config
    }
    const token = process.env.NODE_ENV === 'development' 
        ? 'e3b6fb83d90441199b8d8b6590abff84'
        : Util.getCookie('ht_token');
    if (token) {
        config.headers.token = token;
        config.headers.cv = "7.2.5";
        config.headers.terminal = 7;
    }
    
     if (config.method =="post" && config.data && config.data.form) {    
        config.headers['Content-Type'] =
          'application/x-www-form-urlencoded;charset=utf-8'
        config.data = qs.stringify(config.data.form)
      }
    return config
}, (error) => {
    console.log(error)
    setTimeout(() => {
        hideLoading()
    }, 300)
    return Promise.reject(error)
})

//响应拦截器,响应码不是200都会到这里来
$axios.interceptors.response.use(response=>{
    setTimeout(() => {
        hideLoading()
    }, 300)
    if(response.data&&(response.data.code===10000||response.data.code===1000000)){
        
		return response;
    }else if(response.data){
		Toast({
			message: response.data.message,
			duration: 2000,
			className: 'my_toast'
		})
		//处理200情况的报错， ->用户会话过期
		if(response.data.code===1110002||response.data.code===1110004){
			setTimeout(_=>{
				let comeUrl = encodeURIComponent(window.location.href);
				window.location.href=`/netclass/login.php?action=login&mark=1&comeUrl=${comeUrl}`
			},1000)
        }

		return Promise.reject({message:response.data.message})
    }
},error=>{
    setTimeout(() => {
        hideLoading()
    }, 300)
    if (error.response){
        console.log(error.response)
        if(error.response.status===401){
            Toast({
                message: '请重新登陆',
                duration: 2000,
                className: 'my_toast'
            })
            setTimeout(_=>{
                let comeUrl = encodeURIComponent(window.location.href);
                window.location.href=`/netclass/login.php?action=login&mark=1&comeUrl=${comeUrl}`
            },1000)
        }else{
            Toast({
                message: '请求失败，错误码：'+error.response.status,
                duration: 2000,
                className: 'my_toast'
            })
        }
        return Promise.reject(error.response.data)
    }else{
        Toast({
            message: '请求超时',
            duration: 2000
        })
        return Promise.reject({ message: "请求超时" })
    }
})

function myGet(path,params='',headers={},noToken){
    return $axios.get(path,{params,headers,noToken}).then((res)=>{
        return res.data.code===SCUESS_CODE?res:Promise.reject(res);
    })
}

function myPost(url, data = {}) {
    return $axios.post(url, data).then(response => {
            return response.data.code === SCUESS_CODE ? response : Promise.reject(response);
        })
}

export {myGet,myPost}