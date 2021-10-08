import React, { Component } from "react";
import "./index.scss";

import { get_film_hot } from "../../../api/film";
// import { Button, WhiteSpace } from "antd-mobile";
import { Button } from "antd-mobile";
import { GroupCommons } from "@/modules/group";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    get_film_hot({}).then((res) => {
      console.log("666", res);
    });
  }

  render() {
    let { userInfo, locationInfo, history } = this.props;

    console.log("history", this.props);
    return (
      <div className="app-home">
        app-home
        <Button
          color="primary"
          onClick={() => {
            history.push("/citys");
          }}
        >
          Primary {locationInfo && locationInfo.name}
        </Button>
        <a href="/list">
          <i className="iconfont icon-yingyuan"></i>
          <span>影院 {!userInfo || userInfo.username}</span>
        </a>
      </div>
    );
  }
}

export default GroupCommons(Home);
