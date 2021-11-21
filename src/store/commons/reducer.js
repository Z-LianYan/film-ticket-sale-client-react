import state from "./state";
import { CHECK_USER_INFO, SET_LOCATION_INFO } from "./const.js";

const reducer = (previousState = state, action) => {
  let new_state = { ...previousState };
  switch (action.type) {
    case CHECK_USER_INFO:
      new_state.userInfo = action.userInfo;
      break;
    case SET_LOCATION_INFO:
      console.log("action.locationInfo", action.locationInfo);
      new_state.locationInfo = action.locationInfo;
      break;

    default:
      break;
  }
  return new_state;
};

export default reducer;
