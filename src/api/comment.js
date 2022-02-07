import * as HttpUtils from "@/utils/request";
import * as Api from "@/api/constant";
import { Toast } from "antd-mobile";

export function get_comment_list(params) {
  return new Promise((resolve, reject) => {
    HttpUtils.get(Api.GET_COMMENT_LIST, params, "努力加载中...").then((res) => {
      switch (res.error) {
        case 0:
          resolve(res.data);
          break;
        default:
          Toast.show({
            icon: "fail",
            duration: 2000,
            content: res.message,
          });
          reject(res.data);
          break;
      }
    });
  });
}
export function add_comment(params) {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.ADD_COMMENT, params, "提交中...").then((res) => {
      switch (res.error) {
        case 0:
          Toast.show({
            icon: "success",
            duration: 2000,
            content: res.message,
          });
          resolve(res.data);
          break;
        default:
          Toast.show({
            icon: "fail",
            duration: 2000,
            content: res.message,
          });
          reject(res.data);
          break;
      }
    });
  });
}
export function edit_comment(params) {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.EDIT_COMMENT, params, "编辑中...").then((res) => {
      switch (res.error) {
        case 0:
          Toast.show({
            icon: "success",
            duration: 2000,
            content: res.message,
          });
          resolve(res.data);
          break;
        default:
          Toast.show({
            icon: "fail",
            duration: 2000,
            content: res.message,
          });
          reject(res.data);
          break;
      }
    });
  });
}
export function del_comment(params) {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.DEL_COMMENT, params, "删除中...").then((res) => {
      switch (res.error) {
        case 0:
          Toast.show({
            icon: "success",
            duration: 2000,
            content: res.message,
          });
          resolve(res.data);
          break;
        default:
          Toast.show({
            icon: "fail",
            duration: 2000,
            content: res.message,
          });
          reject(res);
          break;
      }
    });
  });
}

export function get_comment_detail(params) {
  return new Promise((resolve, reject) => {
    HttpUtils.get(Api.GET_COMMENT_DETAIL, params, "删除中...").then((res) => {
      switch (res.error) {
        case 0:
          resolve(res.data);
          break;
        default:
          Toast.show({
            icon: "fail",
            duration: 2000,
            content: res.message,
          });
          reject(res.data);
          break;
      }
    });
  });
}

export function thumb_up(params) {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.THUMB_UP, params, "").then((res) => {
      switch (res.error) {
        case 0:
          resolve(res);
          break;
        default:
          Toast.show({
            icon: "fail",
            duration: 2000,
            content: res.message,
          });
          reject(res);
          break;
      }
    });
  });
}

export function comment_jubao(params) {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.COMMENT_JUBAO, params, "").then((res) => {
      switch (res.error) {
        case 0:
          Toast.show({
            icon: "success",
            duration: 2000,
            content: res.message,
          });
          resolve(res);
          break;
        default:
          Toast.show({
            icon: "fail",
            duration: 2000,
            content: res.message,
          });
          reject(res);
          break;
      }
    });
  });
}



export function get_comment_reply_list(params) {
  return new Promise((resolve, reject) => {
    HttpUtils.get(Api.GET_COMMENT_REPLY_LIST, params, "").then((res) => {
      switch (res.error) {
        case 0:
          resolve(res.data);
          break;
        default:
          Toast.show({
            icon: "fail",
            duration: 2000,
            content: res.message,
          });
          reject(res.data);
          break;
      }
    });
  });
}
export function add_comment_reply(params) {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.ADD_COMMENT_REPLY, params, "提交中...").then((res) => {
      switch (res.error) {
        case 0:
          Toast.show({
            icon: "success",
            duration: 2000,
            content: res.message,
          });
          resolve(res.data);
          break;
        default:
          Toast.show({
            icon: "fail",
            duration: 2000,
            content: res.message,
          });
          reject(res);
          break;
      }
    });
  });
}
export function del_comment_reply(params) {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.DEL_COMMENT_REPLY, params, "删除中...").then((res) => {
      switch (res.error) {
        case 0:
          Toast.show({
            icon: "success",
            duration: 2000,
            content: res.message,
          });
          resolve(res.data);
          break;
        default:
          Toast.show({
            icon: "fail",
            duration: 2000,
            content: res.message,
          });
          reject(res);
          break;
      }
    });
  });
}
