import React, { Component } from "react";
import "./index.scss";
import Img404 from "@/static/img/404.png";
import { NavBar } from "antd-mobile";
class ErrorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { history } = this.props;
    return (
      <div className="not-found-page">
        <NavBar
          // style={{ backgroundColor: "#fff" }}
          backArrow={true}
          onBack={() => {
            history.goBack();
          }}
        >
          404
        </NavBar>
        <img className="icon-404" src={Img404} />
        未发现该页
      </div>
    );
  }
}

export default ErrorPage;
