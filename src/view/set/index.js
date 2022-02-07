import React, { Component } from "react";
import "./index.scss";
import { get_cinema_list } from "@/api/cinema";
import { NavBar, List, Button,Dialog } from "antd-mobile";
import { GroupCommons } from "@/modules/group";
import { SetOutline, PayCircleOutline, CouponOutline } from "antd-mobile-icons";
import { login_out } from "@/api/user";

class CinemaSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    let { locationInfo } = this.props;
  }
  async onLoginOut() {
    let { history } = this.props;
    let result = await Dialog.confirm({
      content: '您确定退出登录吗？',
    })
    console.log('result',result);
    if(result){
      await login_out();
      this.props.loginOut();
      history.replace({
        pathname:'/'
      });
    }
    
  }

  render() {
    let {} = this.state;
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
            onClick={()=>{}}
          >
            账号ID
          </List.Item>
          <List.Item arrow={false} extra={userInfo && userInfo.phone_number}  onClick={()=>{}}>
            电话号码
          </List.Item>
          <List.Item arrow={false} border="none" extra={versions} onClick={()=>{}}>
            软件版本
          </List.Item>
          <List.Item arrow={true} border="none" onClick={()=>{
            history.push('/edituserinfo')
          }}>
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
