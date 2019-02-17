// 独立功能  ->  js代码   ->   模块

// 使axios变成Vue插件    -->  把axios相关代码封装成Vue的插件  -->   在main.js里可以Vue.use(axios)

import axios from 'axios'

const HttpServer = {}

HttpServer.install = function (Vue) {
  axios.defaults.baseURL = "http://localhost:8888/api/private/v1/"

  // 当请求时登录时,直接发送请求
  // 当请求不是登录时,先加头部,然后继续发送请求


  // 请求拦截器
  //  headers请求头
  //  URL  请求的标识路径
  axios.interceptors.request.use(function (config) {
    // console.log('拦截器被触发');
    if (config.url !== 'login') {
      const AUTH_TOKEN = localStorage.getItem("token");
      // this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      config.headers["Authorization"] = AUTH_TOKEN;
    }
    return config;
  }, function (error) {
    // 请求错误之后的处理
    return Promise.reject(error);
  });



  Vue.prototype.$http = axios
}

export default HttpServer;
