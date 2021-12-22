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
  Toast,
} from "antd-mobile";
import { phone_register, send_verify_code } from "@/api/user";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        phone_number: "",
        verify_code: "",
      },
      code_time: 60,
      isCodeDisabled: false,
      timer: null,
      reg_tel:
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
    };
    this.doLogin = this.doLogin.bind(this);
  }

  async doLogin() {
    let { formData, reg_tel } = this.state;
    let { history } = this.props;
    if (!formData.phone_number) {
      return Toast.show({
        duration: 1000,
        content: "请输入手机号",
      });
    }
    if (!reg_tel.test(formData.phone_number)) {
      return Toast.show({
        duration: 1000,
        content: "请输入正确的手机号",
      });
    }
    if (!formData.verify_code) {
      return Toast.show({
        duration: 1000,
        content: "请输入4位数的短信验证码",
      });
    }
    if (formData.verify_code.length < 4) {
      return Toast.show({
        duration: 1000,
        content: "请输入4位数的短信验证码",
      });
    }
    let resutl = await phone_register(formData);
    console.log("12300--99", resutl);
    this.clearIntervalDis();

    return;
    this.props.login({
      username: 123,
      password: 1234,
      success() {
        //成功回调
        history.replace("/mine/user");
      },
      fail() {
        //失败回调
      },
    });
  }
  clearIntervalDis() {
    let { timer } = this.state;
    clearInterval(timer);
    this.setState({
      code_time: 60,
      isCodeDisabled: false,
    });
  }
  async sendVerifyCode() {
    let { formData, reg_tel } = this.state;

    if (!formData.phone_number) {
      return Toast.show({
        duration: 1000,
        content: "请输入手机号",
      });
    }
    if (!reg_tel.test(formData.phone_number)) {
      return Toast.show({
        duration: 1000,
        content: "请输入正确的手机号",
      });
    }
    await send_verify_code({
      phone_number: formData.phone_number,
    });
    let timer = setInterval(() => {
      let { code_time } = this.state;
      code_time -= 1;
      if (code_time <= 0) {
        clearInterval(timer);
      }
      this.setState({
        code_time: code_time <= 0 ? 60 : code_time,
        isCodeDisabled: code_time <= 0 ? false : true,
      });
    }, 1000);

    this.setState({
      timer,
    });
  }

  render() {
    let { history } = this.props;
    let { code_time, isCodeDisabled, formData } = this.state;
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
            <Button
              color="primary"
              fill="outline"
              shape="rounded"
              disabled={isCodeDisabled}
              onClick={() => {
                this.sendVerifyCode();
              }}
            >
              {isCodeDisabled ? code_time + "s后再发送" : "发送验证码"}
            </Button>
          }
        >
          <Input
            placeholder="请输入手机号"
            clearable
            type="tel"
            maxLength={11}
            onChange={(val) => {
              console.log(val);
              let { formData } = this.state;
              formData.phone_number = val;
              this.setState({
                formData,
              });
            }}
          />
        </List.Item>

        <List.Item prefix="">
          <Input
            placeholder="请输入短信验证码"
            clearable
            type="tel"
            maxLength={4}
            onChange={(val) => {
              let { formData } = this.state;
              formData.verify_code = val;
              this.setState({
                formData,
              });
            }}
          />
        </List.Item>

        <Button
          className="login-btn"
          color="primary"
          size="middle"
          block
          onClick={this.doLogin}
        >
          登录
        </Button>
      </div>
    );
  }
  componentWillUnmount = () => {
    this.clearIntervalDis();
    this.setState = (state, callback) => {
      return;
    };
  };
}

export default GroupCommons(Login);
