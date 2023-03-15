import state from "./state";
import { CHECK_USER_INFO, SET_LOCATION_INFO, SET_SOCKET } from "./const.js";

const reducer = (previousState = state, action) => {
  let new_state = { ...previousState };
  switch (action.type) {
    case CHECK_USER_INFO:
      new_state.userInfo = action.userInfo;
      break;
    case SET_LOCATION_INFO:
      new_state.locationInfo = {
        ...new_state.locationInfo,
        ...action.locationInfo,
      };
      break;
    case SET_SOCKET:
        new_state.socket = action.socket;
        break;
    default:
      break;
  }
  return new_state;
};

export default reducer;
