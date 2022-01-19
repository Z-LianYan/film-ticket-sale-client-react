import React, { Component } from "react";
import "./index.scss";

import { GroupCommons } from "../../../modules/group";
import { List, Button } from "antd-mobile";
import {
  SetOutline,
  PayCircleOutline,
  CouponOutline,
  ReceivePaymentOutline,
} from "antd-mobile-icons";
import { phone_register, send_verify_code, get_user_info } from "@/api/user";

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    let { userInfo, history } = this.props;
    // if (!userInfo) {
    //   history.replace({
    //     pathname: "/login",
    //   });
    // }
  }

  componentWillReceiveProps(props) {
    // let { userInfo, history } = props;
    // if (!userInfo) {
    //   history.replace("/login");
    // }
  }

  render() {
    let { userInfo, history } = this.props;
    console.log("userInfo098765432", userInfo);
    return (
      <div className="app-mine-user-page">
        <div className="header-wrapper">
          <img className="img" src={userInfo && userInfo.avatar} />
          <div className="content">
            <span>
              手机号：<span>{userInfo && userInfo.phone_number}</span>
            </span>
            <div>
              余额：
              <span className="balance">{userInfo && userInfo.balance}</span>
            </div>
          </div>
        </div>

        <List>
          <List.Item
            style={{ fontSize: "0.16rem" }}
            arrow={true}
            prefix={<CouponOutline />}
            onClick={() => {
              history.push({
                pathname: "/order",
              });
            }}
          >
            订单
          </List.Item>
          <List.Item
            style={{ fontSize: "0.16rem" }}
            arrow={true}
            onClick={() => {
              history.push({
                pathname: "/recharge",
              });
            }}
            prefix={<ReceivePaymentOutline />}
          >
            充值
          </List.Item>
          <List.Item
            style={{ fontSize: "0.16rem" }}
            arrow={true}
            onClick={() => {
              history.push({
                pathname: "/set",
              });
            }}
            prefix={<SetOutline />}
          >
            设置
          </List.Item>
        </List>

        {/* <div>{!userInfo || userInfo.username}</div> */}
        {/* <button onClick={this.props.exit}>exit</button> */}
      </div>
    );
  }
}

export default GroupCommons(User);
