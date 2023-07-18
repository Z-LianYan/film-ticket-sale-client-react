import React, { Component } from "react";
import "./index.scss";
import { get_cinema_list } from "@/api/cinema";
import { NavBar, List, Button, Dialog } from "antd-mobile";
import { GroupCommons } from "@/modules/group";
import {
  SetOutline,
  PayCircleOutline,
  CouponOutline,
  RightOutline,
} from "antd-mobile-icons";
import { login_out } from "@/api/user";
import { app_versions_check_update } from "../../api/common";

class CinemaSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appInfo: null
    };
  }
  async componentDidMount() {
    let { locationInfo } = this.props;


    const result = await app_versions_check_update({
      platform: 'android',
      packageName: 'com.filmticketsaleclientrnts',
    });
    console.log('result->>>',result);
    this.setState({
      appInfo: result
    })
  }
  async onLoginOut() {
    let { history } = this.props;
    let result = await Dialog.confirm({
      content: "您确定退出登录吗？",
    });
    if (result) {
      await login_out();
      this.props.loginOut();
      history.replace({
        pathname: "/",
      });
    }
  }

  render() {
    let { appInfo } = this.state;
    let { history, userInfo, versions } = this.props;
    return (
      <div className="set-container">
        <NavBar
          onBack={() => {
            history.goBack();
          }}
        >
          设置
        </NavBar>
        <List>
          <List.Item
            arrow={false}
            border="none"
            extra={userInfo && userInfo.user_id}
          >
            账号ID
          </List.Item>
          <List.Item arrow={false} extra={userInfo && userInfo.phone_number}>
            电话号码
          </List.Item>
          <List.Item 
          arrow={true} 
          border="none" 
          extra={appInfo?`版本号v${appInfo.versionName +" 共" + Math.floor(appInfo.size/1024/1024)}M`:''}
          onClick={ async ()=>{
            
            let result = await Dialog.confirm({
              content: "您确定下载吗？",
            });
            if(!result || !appInfo) return;

            const a = document.createElement('a');
            a.href = appInfo.download_url;
            a.click();
          }}>
            android端app
          </List.Item>
          <List.Item
            arrow={true}
            border="none"
            onClick={() => {
              history.push("/edituserinfo");
            }}
            // extra={
            //   <RightOutline
            //     onClick={() => {
            //       history.push("/edituserinfo");
            //     }}
            //   />
            // }
          >
            修改会员信息
          </List.Item>
        </List>
        <div className="login-out-btn-wrapper">
          <Button
            color="primary"
            fill="outline"
            block
            className="login-out-btn"
            onClick={() => {
              this.onLoginOut();
            }}
          >
            退出登录
          </Button>
        </div>
      </div>
    );
  }
  componentWillUnmount = () => {
    this.setState = (state, callback) => {
      return;
    };
  };
}

export default GroupCommons(CinemaSearch);
