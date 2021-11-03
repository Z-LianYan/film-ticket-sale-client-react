import React, { Component } from "react";
import "./index.scss";

import { GroupCommons } from "../../../../modules/group";
import { List } from 'antd-mobile'
import { SetOutline,PayCircleOutline } from 'antd-mobile-icons'

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
        <div className="header-wrapper"></div>

        <List>
          <List.Item 
          clickable 
          arrow={true}
          extra='12'
          prefix={<PayCircleOutline />}
          >余额</List.Item>
          <List.Item 
          clickable 
          arrow={true}
          extra='12'
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
