import axios from "axios";

import { Toast } from "antd-mobile";
// import commonState from "@/store/commons/actionCreator";
axios.defaults.withCredentials = true;

// import store from "@/store/index";

const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 * 200, //1m request timeout
  headers: {
    platform: "web",
    "Content-Type": "application/json;charset=UTF-8",
  },
  withCredentials: true,
  crossDomain: true,
});

export default service;
service.interceptors.request.use(
  (config) => {
    // config.headers['token'] = getToken()
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    if (response.data.error === 401) {
      // history && history.push('/login');
      // history.push("/login");
      
      // response.data.data = {};
      return response;
    } else {
      return response;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

let api = ""; //跨域配置的api
if (process.env.NODE_ENV === "development") {
  api = "/api";
}

export function post(url, data, text) {
  return new Promise((resolve, reject) => {
    if (text)
      Toast.show({
        icon: "loading",
        duration: 2000,
        content: text,
      });
    service({
      url: api + url,
      method: "POST",
      data: data,
      headers: {},
    })
      .then((res) => {
        resolve(res.data);
        if (text) Toast.clear();
      })
      .catch((err) => {
        reject(err);
        Toast.show({
          icon: "fail",
          duration: 2000,
          content: err.message,
        });
      });
  });
}

export function get(url, params, text) {
  return new Promise((resolve, reject) => {
    if (text)
      Toast.show({
        icon: "loading",
        duration: 2000,
        content: text,
      });
    service({
      url: api + url,
      method: "GET",
      params: params,
      headers: {},
    })
      .then((res) => {
        resolve(res.data);
        if (text) Toast.clear();
      })
      .catch((err) => {
        reject(err);
        Toast.show({
          icon: "fail",
          duration: 2000,
          content: err.message,
        });
      });
  });
}
