import * as HttpUtils from "@/utils/request";
import * as Api from "@/api/constant";
import { Toast } from "antd-mobile";

export function get_buy_ticket_detail(params) {
  return new Promise((resolve, reject) => {
    HttpUtils.get(Api.GET_BUY_TICHET_DETAIL, params, "努力加载中...").then(
      (res) => {
        switch (res.error) {
          case 0:
            resolve(res.data);
            break;
          default:
            reject(res);
            Toast.show({
              icon: "fail",
              duration: 2000,
              content: res.message,
            });
            break;
        }
      }
    );
  });
}

export function pay_order(params) {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.PAY_ORDER, params, "支付中...").then(
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
            reject(res);
            Toast.show({
              icon: "fail",
              duration: 2000,
              content: res.message,
            });
            break;
        }
      }
    );
  });
}
