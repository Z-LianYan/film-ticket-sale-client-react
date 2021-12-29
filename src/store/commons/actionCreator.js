import { CHECK_USER_INFO, SET_LOCATION_INFO } from "./const.js";

const actionCreator = {
  login(userInfo, callBack) {
    return (dispatch) => {
      dispatch({
        type: CHECK_USER_INFO,
        userInfo: userInfo,
      });
      callBack && callBack();
    };
  },

  exit() {
    return { type: CHECK_USER_INFO, userInfo: null };
  },

  setLocationInfo(locationInfo, callBack) {
    return async (dispatch) => {
      await dispatch({
        type: SET_LOCATION_INFO,
        locationInfo: locationInfo,
      });
      callBack && callBack();
    };
  },
};

export default actionCreator;
