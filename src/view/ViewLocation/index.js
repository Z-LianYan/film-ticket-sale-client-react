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

  render() {
    let { history, location } = this.props;
    return (
      <div className="view-location-map-container" id="location-map-container">
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
                window.location.href = `amapuri://route/plan/?sid=BGVIS1&&did=BGVIS2&dlat=${
                  location.state && location.state.lat
                }&dlon=${location.state && location.state.lng}&dname=${
                  location.state && location.state.cinema_name
                }&dev=0&t=0`;
              }}
            >
              <i data-adtag="poitonav"></i>
              <span className="tonavCover"></span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GroupCommons(ViewLocation);
