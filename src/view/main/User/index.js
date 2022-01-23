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
          {userInfo && userInfo.avatar ? (
            <img className="img" src={userInfo && userInfo.avatar} />
          ) : (
            <svg
              t="1635787436480"
              className="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="4658"
              width="70"
              height="70"
            >
              <path
                d="M1021.92 515.28a506.32 506.32 0 0 1-91.92 291.76c-3.44 4.96-7.04 9.84-10.72 14.64-8.56 11.36-17.68 22.4-27.12 32.96a507.28 507.28 0 0 1-349.52 168.56l-13.92 0.56h-31.04a506.64 506.64 0 0 1-365.44-171.44q-13.44-15.12-25.6-31.36c-3.84-5.04-7.52-10.08-11.12-15.28a508.72 508.72 0 1 1 926.4-290.4z"
                fill="#C0C0C0"
                p-id="9284"
              ></path>
              <path
                d="M724.48 720a305.92 305.92 0 0 1-205.92 81.28c-81.28 0-152-32.56-211.36-81.28-64.88 33.68-135.52 83.12-174.96 132.64A506.64 506.64 0 0 0 497.68 1024h31.04l13.92-0.56a507.28 507.28 0 0 0 349.52-168.56c-38.72-48.64-106.08-99.28-167.68-134.88z"
                fill="#FFFFFF"
                p-id="9285"
              ></path>
              <path
                d="M513.12 237.36c-135.44 0-243.84 113.76-243.84 249.28C269.28 627.6 383.04 736 513.12 736c135.52 0 243.84-113.84 243.84-249.28S648.64 237.36 513.12 237.36z"
                fill="#FFFFFF"
                p-id="9286"
              ></path>
            </svg>
          )}

          <div className="content">
            {userInfo && userInfo.phone_number && (
              <span>
                手机号：<span>{userInfo && userInfo.phone_number}</span>
              </span>
            )}
            {userInfo && userInfo.balance && (
              <div>
                余额：
                <span className="balance">{userInfo && userInfo.balance}</span>
              </div>
            )}
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
