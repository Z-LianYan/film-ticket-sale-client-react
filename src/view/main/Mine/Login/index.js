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
import { phone_register, send_verify_code } from "@/api/user";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.login = this.login.bind(this);
  }

  async login() {
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

    await phone_register({
      phone_number: 13536681616,
      verify_code: 1234,
    });
  }
  async sendVerifyCode() {
    await send_verify_code({
      phone_number: "",
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
              className="verify-btn"
              onClick={() => {
                this.sendVerifyCode();
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

        <Button
          className="login-btn"
          color="primary"
          size="middle"
          block
          onClick={this.login}
        >
          登录
        </Button>
      </div>
    );
  }
}

export default GroupCommons(Login);
