import React, { Component } from "react";
import "./index.less";

import { get_film_hot } from "../../../api/film";
import { Button, WhiteSpace } from "antd-mobile";

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
        <Button>default</Button>
        <WhiteSpace />
        <Button disabled>default disabled</Button>
        <WhiteSpace />
        <Button type="primary">primary</Button>
        <WhiteSpace />
        <Button type="primary" disabled>
          primary disabled
        </Button>
        <WhiteSpace />
        <Button type="warning">warning</Button>
        <WhiteSpace />
        <Button type="warning" disabled>
          warning disabled
        </Button>
        <WhiteSpace />
        <Button loading>loading button</Button>
        <WhiteSpace />
        <Button icon="check-circle-o">with icon</Button>
        <WhiteSpace />
        <a href="/list">
          <i className="iconfont icon-yingyuan"></i>
          <span>影院</span>
        </a>
      </div>
    );
  }
}

export default Home;
