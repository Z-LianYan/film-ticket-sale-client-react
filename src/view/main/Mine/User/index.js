import React, { Component } from "react";
import "./index.scss";

import { GroupCommons } from "../../../../modules/group";
import { List } from "antd-mobile";
import { SetOutline, PayCircleOutline, CouponOutline } from "antd-mobile-icons";
import { phone_register, send_verify_code, get_user_info } from "@/api/user";

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

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
          <img className="img" src={userInfo && userInfo.avatar} />
          <span>{userInfo && userInfo.phone_number}</span>
        </div>

        <List>
          <List.Item arrow={true} prefix={<CouponOutline />}>
            订单
          </List.Item>
          <List.Item arrow={true} extra="¥ 12" prefix={<PayCircleOutline />}>
            余额
          </List.Item>
          <List.Item arrow={true} prefix={<SetOutline />}>
            设置
          </List.Item>
        </List>

        <div>{!userInfo || userInfo.username}</div>
        <button onClick={this.props.exit}>exit</button>
      </div>
    );
  }
}

export default GroupCommons(User);
