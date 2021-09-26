import React, { Component } from "react";
import "./index.scss";

import { get_film_hot } from "../../../api/film";
// import { Button, WhiteSpace } from "antd-mobile";
import { Button } from "antd-mobile";

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
    return (
      <div className="app-home">
        app-home
        <Button color="primary">Primary</Button>
        <a href="/list">
          <i className="iconfont icon-yingyuan"></i>
          <span>影院</span>
        </a>
      </div>
    );
  }
}

export default Home;
