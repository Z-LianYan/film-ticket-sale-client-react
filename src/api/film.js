import * as HttpUtils from "@/utils/request";
import * as Api from "@/api/constant";

export function get_film_hot(params) {
  return new Promise((resolve, reject) => {
    HttpUtils.get(Api.GET_FILM_HOT, params, { isLoading: true }).then((res) => {
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
