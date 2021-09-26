import React, { Component } from "react";
import "./index.scss";
import { IndexBar, List } from "antd-mobile";
class Citys extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <IndexBar>
        <IndexBar.Panel index={"title"} title={`标题1`} key={`标题1`}>
          <List>
            <List.Item key={1}>{"item"}</List.Item>
          </List>
        </IndexBar.Panel>
        )
      </IndexBar>
    );
  }
}

export default Citys;
