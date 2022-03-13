import React, { Component } from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import { Film, Cinemas, User, Login } from "./view/main/index";

import AppFooter from "./components/AppFooter";
// import Citys from "@/view/Citys/index";
// import FilmDetail from "@/view/FilmDetail/index";
// import CinemaDetail from "@/view/CinemaDetail/index";
// import SelectCinema from "@/view/main/Cinemas/index";
// import CinemaSearch from "@/view/CinemaSearch/index";
// import SelectSeat from "@/view/SelectSeat/index";
// import SetPage from "@/view/set/index";
// import BuyTicket from "@/view/BuyTicket/index";
// import UserPage from "@/view/main/User/index";
// import LoginPage from "@/view/main/Login/index";
import { GroupCommons } from "@/modules/group";
import Cookies from "js-cookie";
import tools from "@/utils/tools";
import { Toast, Dialog } from "antd-mobile";
import { get_by_city } from "@/api/citys";
import { get_user_info } from "@/api/user";
import routerData from "@/router/router";
import NotFound from "@/view/notFound/index";

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
    let no_footer_pathnames = ["/user", "/cinemas", "/"];
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
    let { routes, userInfo } = this.props;
    return (
      <Switch>
        {routes.map((item, index) => {
          return (
            <Route
              key={index}
              path={item.path}
              // component={item.component}
              exact={item.exact}
              render={(props) => {
                console.log("12345", props);
                return !item.auth ? (
                  <item.component {...props} />
                ) : userInfo ? (
                  <item.component {...props} />
                ) : (
                  <Redirect
                    to={{
                      pathname: "/login",
                      state: { from: props.location },
                    }}
                  />
                );
              }}
            />
          );
        })}
        {/* 所有错误路由跳转页面 */}
        <Route component={NotFound} />
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

  async getUserInfo() {
    let result = await get_user_info();
    if (result) this.props.login(result, () => {});
  }

  componentDidMount() {
    this.getUserInfo();
    this.handlerLocation();
  }
  handlerLocation() {
    let { history, locationInfo } = this.props;
    let _cookies = Cookies.get("locationInfo");
    let _cookiesInfo = null;
    if (_cookies) {
      _cookiesInfo = JSON.parse(_cookies);
      // console.log("cookies有值", _cookiesInfo);
      this.props.setLocationInfo({
        ..._cookiesInfo,
      });
    }
    // this.props.setLocationInfo({ isInLocation: true });
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
              isShowSwitchLocationModal: true,
              lng: result.position.lng,
              lat: result.position.lat,
              realLocation: {
                city_id: res.adcode,
                city_name: cityInfo.name,
                lng: result.position.lng,
                lat: result.position.lat,
              },
            });

            setTimeout(() => {
              this.props.setLocationInfo({
                isShowSwitchLocationModal: false, //关闭首页（film）banner 里的，切换城市的模态框
              });
            }, 10000);
            // console.log("获取城市ip（adcode）", this.props.location.pathname);
            if (
              this.props.location.pathname == "/cinemas" ||
              this.props.location.pathname == "/film/cinema"
            ) {
              this.props.locationInfo.locationReady &&
                this.props.locationInfo.locationReady();
            }

            // if (this.props.locationInfo.city_id != res.adcode) {
            //   Dialog.confirm({
            //     title: `定位显示在 ${res.city}`,
            //     content: `是否切换到 ${res.city}？`,
            //     confirmText: `切换到 ${res.city}`,
            //     cancelText: "关闭",
            //     onConfirm: async () => {
            //       let obj = {
            //         city_id: res.adcode,
            //         city_name: cityInfo.name,
            //         lng: result.position.lng,
            //         lat: result.position.lat,
            //       };
            //       Cookies.set(
            //         "locationInfo",
            //         JSON.stringify({
            //           city_id: res.adcode,
            //           city_name: cityInfo.name,
            //         }),
            //         {
            //           expires: 1,
            //         }
            //       );
            //       this.props.setLocationInfo(obj, () => {
            //         this.props.locationInfo.locationReady &&
            //           this.props.locationInfo.locationReady();
            //         if (
            //           this.props.location.pathname == "/" ||
            //           this.props.location.pathname == "/cinemas"
            //         ) {
            //           return;
            //         }

            //         history.replace({
            //           pathname: "/",
            //         });
            //       });
            //     },
            //     onCancel: () => {
            //       this.props.setLocationInfo(
            //         {
            //           lng: result.position.lng,
            //           lat: result.position.lat,
            //         },
            //         () => {
            //           this.props.locationInfo.locationReady &&
            //             this.props.locationInfo.locationReady();
            //         }
            //       );
            //     },
            //   });
            // } else {
            //   this.props.setLocationInfo(
            //     {
            //       lng: result.position.lng,
            //       lat: result.position.lat,
            //     },
            //     () => {
            //       // if (this.props.location.pathname == "/cinemas") {
            //       this.props.locationInfo.locationReady &&
            //         this.props.locationInfo.locationReady();
            //       // }
            //     }
            //   );
            // }
          },
          onError: (err) => {
            console.log("获取城市ip失败", err); //获取城市编码adcode
            this.props.setLocationInfo({ isInLocation: false }, () => {
              this.props.locationInfo.locationReady &&
                this.props.locationInfo.locationReady();
            });
          },
        });
      },
      onError: (err) => {
        console.log("定位失败", err);
        this.props.setLocationInfo({ isInLocation: false }, () => {
          this.props.locationInfo.locationReady &&
            this.props.locationInfo.locationReady();
        });
      },
    });
  }

  shouldComponentUpdate(props) {
    return true;
  }
}

App.defaultProps = {
  routes: routerData,
};

export default GroupCommons(withRouter(App));
