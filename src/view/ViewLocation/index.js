import React, { Component } from "react";
import "./index.scss";
import {
  NavBar,
  NoticeBar,
  Space,
  Button,
  Toast,
  Image,
  List,
  Popup,
  Dialog,
  ActionSheet,
} from "antd-mobile";
import { DownOutline, UpOutline, CloseOutline } from "antd-mobile-icons";
import dayjs from "dayjs";
import tools from "@/utils/tools";
import goapparrow from "@/static/img/goapparrow.png";

import { GroupCommons } from "@/modules/group";
import CustomSkeleton from "@/components/CustomSkeleton/index";
class ViewLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // isSkeleton: true,
      isVisibleActionSheet:false,
      actionsOptions:[
        { text: '高德', key: 'amap' },
        { text: '腾讯', key: 'qq' },
        { text: '百度', key: 'baidu' },
      ]
    };
  }
  componentDidMount() {
    let { location } = this.props;
    console.log("location", location);
    const AMap = window.AMap;
    let center = [
      location.state && location.state.lng,
      location.state && location.state.lat,
    ];
    var map = new AMap.Map("location-map-container", {
      // viewMode: "3D", // 默认使用 2D 模式，如果希望使用带有俯仰角的 3D 模式，请设置 viewMode: '3D',
      zoom: 18, //[23.01185,113.38798]
      center: center,
    });
    // 实例化点标记
    function addMarker() {
      let marker = new AMap.Marker({
        icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        position: center,
        offset: new AMap.Pixel(-13, -30),
      });
      marker.setMap(map);
    }
    addMarker();
  }
  mapUrl(mapType){
    let { location } = this.props;
    let lng = location.state && location.state.lng;
    let lat = location.state && location.state.lat;
    let cinema_name = location.state && location.state.cinema_name;
    let cinema_address = location.state && location.state.cinema_address;
    console.log('567890',mapType)
    //只有在浏览器中才可以实现打开已安装地图app，其他类似微信内置浏览器则不能直接打开地图app。
    //解决方式：放弃直接打开地图app，通过跳转对应地图移动端页面，由其负责打开app应用。
    switch(mapType){
      case 'amap':
        return window.location.href = `https://uri.amap.com/marker?position=${lng},${lat}&name=${cinema_name}&callnative=1`;
      case 'qq':
        return window.location.href = `https://apis.map.qq.com/uri/v1/marker?marker=coord:${lat},${lng};addr:${cinema_address};title:${cinema_name}&referer=keyfree`;
      case 'baidu':
          return window.location.href = `http://api.map.baidu.com/marker?location=${lat},${lng}&title=${cinema_name}&content=${cinema_address}&output=html&src=webapp.reformer.appname&coord_type=gcj02`;
    }
  }

  render() {
    let { history, location } = this.props;
    let { isVisibleActionSheet,actionsOptions } = this.state;
    return (
      <div className="view-location-map-container" id="location-map-container">
        <NavBar
          style={{
            position:'fixed',
            left:0,
            right:0,
            top:0,
            zIndex:100,
            "--height": "0.44rem",
            backgroundColor: "#64663e",
            color: "#fff",
            fontWeight: "bold",
          }}
          left={
            <i
              className="iconfont icon-shouye"
              onClick={() => {
                history.push("/");
              }}
              style={{ fontSize: "0.2rem" }}
            ></i>
          }
          onBack={() => {
            history.goBack();
          }}
        >
          {location.state && location.state.cinema_name}
        </NavBar>
        <div className="poi-info">
          <div className="poi-title">
            <span className="poi-name">
              {location.state && location.state.cinema_name}
            </span>
            <span className="poi-addr">
              {location.state && location.state.cinema_address}
            </span>
            <div
              className="actTonav tonav"
              onClick={() => {
                this.setState({
                  isVisibleActionSheet:true
                })
              }}
            >
              <i data-adtag="poitonav"></i>
              <span className="tonavCover"></span>
            </div>
          </div>
        </div>
        <ActionSheet
          extra='选择您要使用的地图'
          visible={isVisibleActionSheet}
          actions={actionsOptions}
          cancelText='取消'
          onAction={action => {
            this.mapUrl(action.key);
          }}
          onClose={() => {
            this.setState({
              isVisibleActionSheet:false
            })
          }}
        />
      </div>
    );
  }
}

export default GroupCommons(ViewLocation);
