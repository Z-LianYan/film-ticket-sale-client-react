import * as HttpUtils from "@/utils/request";
import * as Api from "@/api/constant";

export function get_film_hot(params) {
  return new Promise((resolve, reject) => {
    HttpUtils.get(Api.GET_FILM_HOT, params, "努力加载中...").then((res) => {
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
export function get_film_soon_show(params) {
  return new Promise((resolve, reject) => {
    HttpUtils.get(Api.GET_FILM_SOONSHOW, params, "努力加载中...").then(
      (res) => {
        switch (res.error) {
          case 0:
            resolve(res.data);
            break;
          default:
            reject(res.data);
            break;
        }
      }
    );
  });
}

export function get_banner(params) {
  return new Promise((resolve, reject) => {
    HttpUtils.get(Api.GET_BANNER, params, "努力加载中...").then((res) => {
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


export function get_film_detail(params) {
  return new Promise((resolve, reject) => {
    HttpUtils.get(Api.GET_FILM_DETAIL, params, "努力加载中...").then((res) => {
      switch (res.error) {
        case 0:
          resolve(res.data.rows);
          break;
        default:
          reject(res.data);
          break;
      }
    });
  });
}
