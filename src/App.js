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
import { Toast, Dialog } from "antd-mobile";
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
    this.handlerLocation();
  }
  handlerLocation() {
    let { history, locationInfo } = this.props;
    let _cookies = Cookies.get("locationInfo");
    let _cookiesInfo = null;
    if (_cookies) {
      _cookiesInfo = JSON.parse(_cookies);
      console.log("cookies有值", _cookiesInfo);
      this.props.setLocationInfo({
        isInLocation: true,
        ..._cookiesInfo,
      });
    } else {
      this.props.setLocationInfo({ isInLocation: true });
    }
    tools.geolocation({
      //定位
      onComplete: (result) => {
        console.log("完成定位", result);
        tools.getLocalCity({
          //获取城市ip（adcode）
          onComplete: async (res) => {
            let cityInfo = await get_by_city({ city_id: res.adcode });
            this.props.setLocationInfo({
              isInLocation: false, //结束城市列表页的定位中的状态
              realLocation: {
                city_id: res.adcode,
                city_name: cityInfo.name,
                lng: result.position.lng,
                lat: result.position.lat,
              },
            });
            if (this.props.locationInfo.city_id != res.adcode) {
              Dialog.confirm({
                title: `定位显示在 ${res.city}`,
                content: `是否切换到 ${res.city}？`,
                confirmText: `切换到 ${res.city}`,
                cancelText: "关闭",
                onConfirm: async () => {
                  let obj = {
                    city_id: res.adcode,
                    city_name: cityInfo.name,
                    lng: result.position.lng,
                    lat: result.position.lat,
                  };
                  Cookies.set(
                    "locationInfo",
                    JSON.stringify({
                      city_id: res.adcode,
                      city_name: cityInfo.name,
                    }),
                    {
                      expires: 1,
                    }
                  );
                  this.props.setLocationInfo(obj, () => {
                    this.props.locationInfo.locationReady &&
                      this.props.locationInfo.locationReady();
                    if (
                      this.props.location.pathname == "/" ||
                      this.props.location.pathname == "/cinemas"
                    ) {
                      return;
                    }

                    history.replace({
                      pathname: "/",
                    });
                  });
                },
                onCancel: () => {
                  this.props.setLocationInfo(
                    {
                      // lng: result.position.lng,
                      // lat: result.position.lat,
                      isInLocation: false, //结束城市列表页的定位中的状态
                    },
                    () => {
                      // this.props.locationInfo.locationReady &&
                      //   this.props.locationInfo.locationReady();
                    }
                  );
                },
              });
            } else {
              this.props.setLocationInfo(
                {
                  lng: result.position.lng,
                  lat: result.position.lat,
                  isInLocation: false, //结束城市列表页的定位中的状态
                },
                () => {
                  this.props.locationInfo.locationReady &&
                    this.props.locationInfo.locationReady();
                }
              );
            }
          },
          onError: (err) => {
            console.log("ip失败", err);
            this.props.setLocationInfo({ isInLocation: false });
          },
        });
      },
      onError: (err) => {
        console.log("定位失败", err);
        this.props.setLocationInfo({ isInLocation: false });
      },
    });
  }

  shouldComponentUpdate(props) {
    // console.log("shouldComponentUpdate");
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
