import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actionCreator from "../../store/template/actionCreator";

export default connect(
  (state) => state.template,
  (dispatch) => {
    return bindActionCreators(actionCreator, dispatch);
  }
);
