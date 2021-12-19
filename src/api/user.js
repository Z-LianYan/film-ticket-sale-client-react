import * as HttpUtils from "@/utils/request";
import * as Api from "@/api/constant";
import { Toast } from "antd-mobile";

export function phone_register(params) {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.PHONE_REGISTER, params, "努力加载中...").then((res) => {
      switch (res.error) {
        case 0:
          resolve(res.data);
          Toast.show({
            icon: "success",
            duration: 2000,
            content: res.message,
          });
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

export function send_verify_code(params) {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.SEND_VERIFY_CODE, params, "努力加载中...").then(
      (res) => {
        switch (res.error) {
          case 0:
            resolve(res.data);
            Toast.show({
              icon: "success",
              duration: 2000,
              content: res.message,
            });
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
      }
    );
  });
}
