import { combineReducers } from "redux"; //Redux 提供了一个 combineReducers 方法，用于 Reducer 的拆分，要定义各个子 Reducer 函数，然后用这个方法，将它们合成一个大的 Reducer

import commons from "./commons/reducer";
import template from "./template/reducer";

const reducer = combineReducers({
  template: template,
  commons: commons,
});


// //还可以这样合成reducer
// const reducer = function (state = {}, action) {
//   return {
//     template: template(state.template, action),
//     commons: commons(state.commons, action),
//   }
// }


export default reducer;
