import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { Film, Cinemas, Mine } from "./view/main/index.js";

import AppFooter from "./components/commons/AppFooter";
import Citys from "@/view/Citys/index";
import FilmDetail from "@/view/FilmDetail/index";
import CinemaDetail from "@/view/CinemaDetail/index";
import SelectCinema from "@/view/main/Cinemas/index";
import CinemaSearch from "@/view/CinemaSearch/index";
import SelectSeatBuyTicket from "@/view/SelectSeatBuyTicket/index";
import { GroupCommons } from "@/modules/group";
import Cookies from "js-cookie";
import tools from "@/utils/tools";
import { Toast } from "antd-mobile";
import { get_by_city } from "@/api/citys";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //hasFooter:true
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

  componentDidMount() {
    console.log("app---->", this.props.locationInfo);
    // Cookies.set("locationInfo", JSON.stringify(this.props.locationInfo), {
    //   expires: 0.001,
    // });
    // console.log("Cookies", JSON.parse(Cookies.get("locationInfo")));
    // Cookies.get("zly");
    let _cookie = Cookies.get("locationInfo");
    let locationInfo = _cookie ? JSON.parse(_cookie) : "";
    console.log("_cookie--locationInfo", locationInfo);
    if (!locationInfo) {
      tools.geolocation({
        onComplete: (result) => {
          console.log("完成定位", result);
          tools.getLocalCity({
            onComplete: async (res) => {
              console.log("code--getLocalCity--😄", res);
              Toast.show({
                icon: "loading",
                duration: 2000,
                content: "您当前所在城市是广州，是否切换到广州？",
              });
              let cityInfo = await get_by_city({city_id:res.adcode});
              console.log('cityInfo',cityInfo)
              let obj = {
                adcode: res.adcode,
                city_name: cityInfo.name,
                lng: result.position.lng,
                lat: result.position.lat,
              }
              this.props.setLocationInfo(obj,() => {
                this.props.locationInfo.locationReady && this.props.locationInfo.locationReady();
              });
              Cookies.set("locationInfo", JSON.stringify(obj), {
                expires: 0.001,
              });
            },
            onError: (err) => {
              console.log("ip失败", err);
            },
          });
        },
        onError: (err) => {
          console.log("定位失败", err);
        },
      });
    }
    console.log("src/App.js");
  }

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
    { path: "/film/cinema", component: SelectCinema },
    { path: "/cinema/search", component: CinemaSearch },
    { path: "/buy/ticket", component: SelectSeatBuyTicket },
  ],
};

export default GroupCommons(withRouter(App));
