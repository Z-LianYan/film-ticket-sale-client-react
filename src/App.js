import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { Film, Cinemas, Mine } from "./view/main/index.js";

import AppFooter from "./components/commons/AppFooter";
import Citys from "@/view/citys/index";
import FilmDetail from "@/view/FilmDetail/index";
import CinemaDetail from "@/view/CinemaDetail/index";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //			hasFooter:true
    };
  }

  //判断是否显示AppFooter组件:方法1
  renderFooter() {
    //因为只要路由变化，属性就会变化，就会重新render，就会执行这个函数
    let { pathname } = this.props.location;
    // let no_footer_pathnames = ["/mine/login"];
    // if (no_footer_pathnames.indexOf(pathname) > -1) return "";
    // return <AppFooter />;
    let no_footer_pathnames = ["/mine/user", "/cinemas", "/"];
    if (no_footer_pathnames.indexOf(pathname) > -1) return <AppFooter />;
  }

  //判断是否显示AppFooter组件:方法2
  //	componentWillReceiveProps(props){//props改变时触发此函数
  //		if(props.location.pathname === "/mine"){
  //			this.setState({hasFooter:false})
  //		}else{
  //			this.setState({hasFooter:true})
  //		}
  //	}

  renderRoute() {
    let { routes } = this.props;
    return (
      <Switch>
        {routes.map((item, index) => (
          <Route
            key={index}
            path={item.path}
            component={item.component}
            exact={item.exact}
          />
        ))}
      </Switch>
    );
  }
  render() {
    return (
      <div className="App">
        {this.renderRoute()}
        {this.renderFooter()}
      </div>
    );
  }

  componentDidMount() {}

  shouldComponentUpdate(props) {
    console.log("shouldComponentUpdate");
    return true;
  }
}

App.defaultProps = {
  routes: [
    { path: "/", component: Film, exact: true },
    { path: "/cinemas", component: Cinemas },
    // { path: "/buycar", component: BuyCar },
    { path: "/mine", component: Mine },
    { path: "/citys", component: Citys },
    { path: "/film/detail", component: FilmDetail },
    { path: "/cinema/detail", component: CinemaDetail },
  ],
};

export default withRouter(App);
