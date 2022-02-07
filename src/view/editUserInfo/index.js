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
  Image,
  Rate,
  TextArea,
  Avatar,
  Form,
} from "antd-mobile";
import { GroupCommons } from "@/modules/group/index";
// import { } from "antd-mobile-icons";
import { edit_user_info, get_user_info } from "@/api/user";

class EditUserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        nickname: "",
        avatar: "",
      },
    };
  }

  componentDidMount() {
    // let { userInfo } = this.props;
    // let { formData } = this.state;
    // console.log("formData", userInfo);
    // formData.nickname = userInfo && userInfo.nickname;
    // formData.avatar = userInfo && userInfo.avatar;
    // this.setState({
    //   formData,
    // });

    this.getUserInfo();
  }

  async onEditUserInfo() {
    let { location } = this.props;
    let { formData } = this.state;
    if (!formData.nickname)
      return Toast.show({
        duration: 1000,
        content: "用户名不能为空",
      });
    await edit_user_info({
      ...formData,
    });

    this.getUserInfo();
  }

  async getUserInfo() {
    let { formData } = this.state;
    let result = await get_user_info();
    if (!result) return;
    formData.nickname = result.nickname;
    formData.avatar = result.avatar;
    this.setState({
      formData,
    });
    this.props.login(result, () => {});
  }

  render() {
    let { history, location } = this.props;
    let { formData } = this.state;

    return (
      <div className="edit-user-info-container">
        <div className="header-wrapper">
          <NavBar
            style={{
              "--height": "0.44rem",
              fontWeight: "bold",
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
            <div className="comment-title">编辑会员信息</div>
          </NavBar>
        </div>
        <div style={{ height: "0.5rem" }}></div>
        <List layout="vertical">
          <List.Item
            extra={
              <Input
                placeholder="请输入用户名"
                maxLength={8}
                value={formData.nickname}
                clearable
                onChange={(val) => {
                  formData.nickname = val;
                  this.setState({
                    formData,
                  });
                }}
              />
            }
          >
            用户名
          </List.Item>
        </List>
        {/* <Form layout='vertical'>
          <Form.Item label='用户名' name='nickname'>
            <Input
              placeholder='请输入用户名'
              value={formData.nickname}
              clearable
              onChange={val => {
                formData.nickname = val;
                this.setState({
                  formData
                })
              }}
            />
          </Form.Item> 
        </Form> */}

        <Button
          block
          color="primary"
          style={{ position: "fixed", bottom: "1rem" }}
          onClick={() => {
            this.onEditUserInfo();
          }}
        >
          编辑
        </Button>
      </div>
    );
  }
}

export default GroupCommons(EditUserInfo);
