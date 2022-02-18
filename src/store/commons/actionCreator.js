import { CHECK_USER_INFO, SET_LOCATION_INFO } from "./const.js";

const actionCreator = {
  login(userInfo, callBack) {//login() 就是 action 创建函数（就是生成action的方法）
    return (dispatch) => {
      let action = {
        type: CHECK_USER_INFO,
        userInfo: userInfo,
      }
      dispatch(action);
      callBack && callBack();
    };
  },

  loginOut() {//这里不需要 dispatch 是因为 bindActionCreators() 可以自动把多个 action 创建函数 绑定到 dispatch() 方法上。
    return { type: CHECK_USER_INFO, userInfo: null };
  },

  setLocationInfo(locationInfo, callBack) {
    return async (dispatch) => {
      dispatch({
        type: SET_LOCATION_INFO,
        locationInfo: locationInfo,
      });
      callBack && callBack();
    };
  },
};

export default actionCreator;
