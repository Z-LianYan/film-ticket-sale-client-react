import React, { Component } from "react";
import "./index.scss";
import {
  List,
  Search,
  NavBar,
  Input,
  NumberKeyboard,
  Button,
  Toast,
  Image,
} from "antd-mobile";
import { GroupCommons } from "@/modules/group/index";
import {
  CloseOutline,
  CloseCircleFill,
  RightOutline,
  EnvironmentOutline,
  PhoneFill,
  DownlandOutline,
} from "antd-mobile-icons";
import { get_buy_ticket_detail, pay_order } from "@/api/order";
import QRCode from "qrcode.react";
import domToImage from "dom-to-image";
import { saveAs } from "file-saver";
import CustomSkeleton from "@/components/CustomSkeleton/index";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
var relativeTime = require("dayjs/plugin/relativeTime");
var calendar = require("dayjs/plugin/calendar");
dayjs.extend(relativeTime);
dayjs.extend(calendar);
dayjs.locale("zh-cn");
// console.log(dayjs().toNow());

class Recharge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSkeleton: true,
      isDownImage: false,
      orderDetail: {},
    };
  }
  componentDidMount() {
    // this.getOrderDetail();
    this.setState({ isSkeleton: false });
  }
  async getOrderDetail() {
    let { history, location, match } = this.props;
    console.log("location", this.props, match.params.order_id);
    try {
      let result = await get_buy_ticket_detail({
        order_id: match.params.order_id,
      });
      console.log(result);
      this.setState({
        isSkeleton: false,
        orderDetail: result,
      });
    } catch (err) {
      if (err.error == 401) {
        this.props.login(null); //如果token认证过期 清空当前缓存的登录信息
        history.replace({
          pathname: "/login",
        });
      }
    }
  }

  render() {
    let { history } = this.props;
    let { isSkeleton, orderDetail } = this.state;

    return (
      <div className="order-list-container">
        {isSkeleton ? <CustomSkeleton section={5} row={5} /> : null}
        <NavBar
          style={{
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
          订单
        </NavBar>
        订单列表
      </div>
    );
  }
}

export default GroupCommons(Recharge);
