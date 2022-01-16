import React, { Component } from "react";
import "./index.scss";
import {
  List,
  Search,
  NavBar,
  Input,
  NumberKeyboard,
  Button,
  Toast,
} from "antd-mobile";
import { GroupCommons } from "@/modules/group/index";
import { CloseOutline, CloseCircleFill } from "antd-mobile-icons";

class Recharge extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { history } = this.props;
    let {} = this.state;
    return (
      <div className="order-detail-container">
        <NavBar
          style={{
            "--height": "0.44rem",
            color: "#000",
          }}
          left={
            <i
              className="iconfont icon-shouye"
              onClick={() => {
                history.push("/");
              }}
              style={{ fontSize: "0.2rem" }}
            ></i>
          }
          onBack={() => {
            history.goBack();
          }}
        >
          29分钟后开场
        </NavBar>
        <div style={{ marginTop: "0.5rem" }}></div>
        {/* <List
          style={{
            "--prefix-width": "6em",
          }}
          mode="card"
        >
          <List.Item title="充值金额">
            
          </List.Item>
        </List> */}
        123456789
      </div>
    );
  }
}

export default GroupCommons(Recharge);
