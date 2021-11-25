import * as HttpUtils from "@/utils/request";
import * as Api from "@/api/constant";

export function get_cinema_list(params) {
  return new Promise((resolve, reject) => {
    HttpUtils.get(Api.GET_CINEMA_LIST, params, "努力加载中...").then((res) => {
      switch (res.error) {
        case 0:
          resolve(res.data);
          break;
        default:
          reject(res.data);
          break;
      }
    });
  });
}