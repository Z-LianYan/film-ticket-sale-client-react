import React, { Component } from "react";
import "./index.scss";

import { GroupCommons } from "../../../../modules/group";
import { List } from 'antd-mobile'
import { SetOutline,PayCircleOutline,CouponOutline } from 'antd-mobile-icons'

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(props) {
    let { userInfo, history } = props;
    // if (userInfo === null) {
    //   history.replace("/mine/login");
    // }
  }

  render() {
    let { userInfo } = this.props;
    return (
      <div className="app-mine-user-page">
        <div className="header-wrapper">
          <img className="img" src="https://mall.s.maizuo.com/64ee4289878c7370c31544e32f9a09aa.jpg"/>
          <span>13536681616</span>
        </div>
        
        <List>
          <List.Item 
          arrow={true}
          prefix={<CouponOutline />}
          >订单</List.Item>
          <List.Item 
          arrow={true}
          extra='¥ 12'
          prefix={<PayCircleOutline />}
          >余额</List.Item>
          <List.Item 
          arrow={true}
          prefix={<SetOutline />}
          >设置</List.Item>
        </List>


        <div>{!userInfo || userInfo.username}</div>
        <button onClick={this.props.exit}>exit</button>

      </div>
    );
  }
}

export default GroupCommons(User);
