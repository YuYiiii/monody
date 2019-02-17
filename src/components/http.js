// 独立功能  ->  js代码   ->   模块

// 使axios变成Vue插件    -->  把axios相关代码封装成Vue的插件  -->   在main.js里可以Vue.use(axios)

import axios from 'axios'

const HttpServer = {}

HttpServer.install = function (Vue) {
  axios.defaults.baseURL = "http://localhost:8888/api/private/v1/"

  const AUTH_TOKEN = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

  Vue.prototype.$http = axios
}

export default HttpServer;
