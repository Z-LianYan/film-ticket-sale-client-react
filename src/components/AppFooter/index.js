import React, { Component } from "react";
import "./index.scss";

import { NavLink } from "react-router-dom";
import { GroupCommons } from "@/modules/group";

class AppFooter extends Component {
  renderNav() {
    let { navs,userInfo } = this.props;
    return navs.map((item) => (
      <NavLink
        exact={item.exact}
        activeClassName="actived"
        to={!userInfo && item.path=='/user'?'/login?url=/user':item.path}
        key={item.id}
      >
        <i className={item.icon}></i>
        <span>{item.title}</span>
      </NavLink>
    ));
  }

  render() {
    return <footer className="app-footer-nav">{this.renderNav()}</footer>;
  }
}

AppFooter.defaultProps = {
  navs: [
    {
      id: 1,
      path: "/",
      title: "电影",
      icon: "iconfont icon-dianying1",
      exact: true,
    },
    { id: 2, path: "/cinemas", title: "影院", icon: "iconfont icon-yingyuan" },
    // { id: 3, path: "/buycar", title: "咨询", icon: "iconfont icon-zixun" },
    { id: 4, path: "/user", title: "我的", icon: "iconfont icon-wode" },
  ],
};

export default GroupCommons(AppFooter);
