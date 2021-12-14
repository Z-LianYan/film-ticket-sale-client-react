import React, { Component } from "react";
import "./index.scss";
import { GroupCommons } from "../../../../modules/group";
import {
  List,
  Image,
  Mask,
  NavBar,
  ImageViewer,
  Button,
  Input,
} from "antd-mobile";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.login = this.login.bind(this);
  }

  login() {
    console.log("login");
    let username = "123";
    let password = "456";
    let { history } = this.props;
    this.props.login({
      username,
      password,
      success() {
        //成功回调
        history.replace("/mine/user");
      },
      fail() {
        //失败回调
      },
    });
  }

  render() {
    let { history } = this.props;
    return (
      <div className="login-container">
        <NavBar
          style={{
            "--height": "0.44rem",
            color: "#000",
          }}
          onBack={() => {
            // this.setState({ isVisibleMask: false });
            history.goBack();
          }}
        >
          登录
        </NavBar>

        <div
          style={{ height: "1rem", lineHeight: "1rem", textAlign: "center" }}
        ></div>
        <List.Item
          prefix=""
          extra={
            <div
              style={{
                background: "#eee",
                borderRadius: "0.8rem",
                padding: "0.08rem",
                color: "#999",
              }}
            >
              发送验证码
            </div>
          }
        >
          <Input placeholder="请输入手机号" clearable />
        </List.Item>

        <List.Item prefix="">
          <Input placeholder="请输入短信验证码" clearable />
        </List.Item>

        <button onClick={this.login}>login</button>
      </div>
    );
  }
}

export default GroupCommons(Login);
