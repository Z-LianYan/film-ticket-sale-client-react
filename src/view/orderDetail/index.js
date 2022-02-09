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
  Popup,
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
import { get_order_detail, pay_order } from "@/api/order";
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

class OrderDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSkeleton: true,
      isDownImage: false,
      orderDetail: {},
    };
  }
  componentDidMount() {
    this.getOrderDetail();
  }
  async getOrderDetail() {
    let { history, location, match } = this.props;
    // console.log("location", this.props, match.params.order_id);
    try {
      let result = await get_order_detail({
        order_id: match.params.order_id,
      });
      // console.log(result);
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
  changeCanvasToPic() {
    let { isDownImage } = this.state;
    const node = document.getElementById("film-ticket");
    if (isDownImage) return;
    Toast.show({
      icon: "loading",
      duration: 2000,
      content: "正在处理中...",
    });
    this.setState({
      isDownImage: true,
    });
    domToImage.toBlob(node).then((blob) => {
      // console.log("url", blob);
      saveAs(blob, "二维码.png");
      // Toast.show({
      //   duration: 2000,
      //   content: "已保存！",
      // });
      Toast.clear();
      this.setState({
        isDownImage: false,
      });
    });
  }
  handerDate(date) {
    let today = dayjs().format("YYYY-MM-DD");
    let tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");
    let houtian = dayjs().add(2, "day").format("YYYY-MM-DD");
    let cur_y = dayjs(date).format("YYYY");
    let y = dayjs().format("YYYY");
    switch (dayjs(date).format("YYYY-MM-DD")) {
      case today:
        return "今天 " + dayjs(date).format("M月D日");
      case tomorrow:
        return "明天 " + dayjs(date).format("M月D日");
      case houtian:
        return "后天 " + dayjs(date).format("M月D日");
      default:
        return (
          this.handleWeek(dayjs(date).day()) +
          dayjs(date).format(cur_y == y ? "M月D日" : "YY年M月D日")
        );
    }
  }
  handleWeek(day) {
    switch (day) {
      case 0:
        return "周日 ";
      case 1:
        return "周一 ";
      case 2:
        return "周二 ";
      case 3:
        return "周三 ";
      case 4:
        return "周四 ";
      case 5:
        return "周五 ";
      case 6:
        return "周六 ";
      default:
        return "";
    }
  }
  render() {
    let { history } = this.props;
    let { isSkeleton, orderDetail } = this.state;
    let seat_label = [];
    if (orderDetail.select_seats) {
      orderDetail.select_seats.map((item, index) => {
        if (orderDetail.is_section == 1) {
          seat_label.push(
            <span className="section-name" key={index + "s"}>
              {index == 0 ? "" : "|"} {item.section_name}
            </span>
          );
          item.seatList.map((it, idx) => {
            seat_label.push(
              <span className="seat" key={idx + "se" + index}>
                {it.row_id}排{it.column_id}座
              </span>
            );
          });
        } else {
          seat_label.push(
            <span className="seat" key={index + "se"}>
              {item.row_id}排{item.column_id}座
            </span>
          );
        }
      });
    }
    return (
      <div className="order-detail-container">
        {isSkeleton ? <CustomSkeleton section={5} row={5} /> : null}
        <NavBar
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            right: 0,
            zIndex: 1000,
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
          {orderDetail.order_expire ? "观影结束" : this.handlerTitle()}
        </NavBar>
        <div style={{ height: "0.4rem" }}></div>
        <div className="content-container">
          <div className="header-content">
            <div className="head-top">
              <div
                className="cinema-name-wrapper"
                onClick={() => {
                  if (!orderDetail.cinema_has_schedule) return;
                  history.push({
                    pathname: `/cinema/detail`,
                    state: {
                      cinema_id: orderDetail && orderDetail.cinema_id,
                    },
                  });
                }}
              >
                <div className="cinema-name">{orderDetail.cinema_name}</div>
                {orderDetail.cinema_has_schedule && (
                  <RightOutline style={{ margin: "0 0.1rem" }} fontSize={20} />
                )}{" "}
                |
              </div>

              <EnvironmentOutline
                style={{ margin: "0 0.2rem" }}
                fontSize={20}
                onClick={() => {
                  history.push({
                    pathname: "/viewlocation",
                    state: {
                      lat: orderDetail.lat,
                      lng: orderDetail.lng,
                      cinema_name: orderDetail.cinema_name,
                      cinema_address: orderDetail.cinema_address,
                    },
                  });
                }}
              />
              <a href={"tel:" + orderDetail.phone}>
                <PhoneFill
                  color="#fff"
                  style={{ margin: "0 0.1rem" }}
                  fontSize={20}
                />
              </a>
            </div>
            <div className="content-wrapper">
              <div className="content" id="film-ticket">
                <div className="top-half-circle"></div>
                <div className="top-wrapper">
                  <div className="top">
                    <div className="left">
                      <h3 className="film-name">{orderDetail.film_name}</h3>
                      <p>
                        {orderDetail.language}
                        {orderDetail.play_type_name} {orderDetail.ticket_count}
                        张
                      </p>
                    </div>
                    <Image
                      src={orderDetail.poster_img}
                      className="img"
                      width={75}
                      height={90}
                      fit="fill"
                    />
                  </div>
                  <div className="bot">
                    <div className="date-hall">
                      <span className="date">
                        {this.handerDate(orderDetail.start_runtime)}
                      </span>
                      <span>{orderDetail.hall_name}</span>
                    </div>
                    <div className="time-seat">
                      <span className="time">
                        {dayjs(orderDetail.start_runtime).format("HH:mm")}～
                        {dayjs(orderDetail.start_runtime)
                          .add(orderDetail.runtime, "minute")
                          .format("HH:mm")}
                      </span>
                      <span className="hall-section-seat">{seat_label}</span>
                    </div>
                  </div>
                </div>
                <div className="separator-wrapper">
                  <div className="circle left-circle"></div>
                  <div className="circle line"></div>
                  <div className="circle right-circle"></div>
                </div>
                <div className="qr-code">
                  <h3>取电影票</h3>
                  <div className="code">
                    {orderDetail.order_verify_code ? (
                      <QRCode
                        id="qrCode"
                        value={orderDetail.order_verify_code} // value参数为生成二维码的链接
                        size={150} // 二维码的宽高尺寸
                        fgColor={
                          orderDetail.order_expire ||
                          orderDetail.order_status == 2
                            ? "#ccc"
                            : "#000"
                        } // 二维码的颜色
                      />
                    ) : null}
                    {orderDetail.order_status == 2 ? (
                      <i className="iconfont icon-yiwancheng already-complete"></i>
                    ) : orderDetail.order_status == 1 &&
                      orderDetail.order_expire ? (
                      <i className="iconfont icon-yiguoqi already-complete"></i>
                    ) : null}
                  </div>
                  <div className="verify-code">
                    验证码：
                    <span
                      className={[
                        `code-num ${
                          orderDetail.order_expire ||
                          orderDetail.order_status == 2
                            ? "text-line-through"
                            : ""
                        }`,
                      ]}
                    >
                      {this.handleVerifyCode()}
                    </span>
                  </div>
                </div>
              </div>
              {orderDetail.order_status == 1 ? (
                <div
                  className="save-qr"
                  id="down_link"
                  onClick={() => {
                    this.changeCanvasToPic();
                  }}
                >
                  <DownlandOutline fontSize={20} />
                  <span>保存二维码</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div style={{ height: "0.3rem" }}></div>
        <div className="order-detail-card">
          {/* <List.Item arrow={true} title='订单明细' extra='价格明细'></List.Item> */}
          <div
            className="order-title"
            onClick={() => {
              this.$child.open();
            }}
          >
            <h4 className="title">订单明细</h4>
            <span className="val">
              价格明细
              <RightOutline color="#000" fontSize={16} />
            </span>
          </div>

          <div className="detail-item">
            <span className="label">实付金额：</span>
            <span className="val">
              ¥{orderDetail.price}（{orderDetail.ticket_count}张电影票）
            </span>
          </div>
          <div className="detail-item">
            <span className="label">手机号码：</span>
            <span className="val">{orderDetail.phone_number}</span>
          </div>
          <div className="detail-item">
            <span className="label">订单编号：</span>
            <span className="val">{orderDetail.order_id}</span>
          </div>
          <div className="detail-item">
            <span className="label">订单时间：</span>
            <span className="val">{orderDetail.created_at}</span>
          </div>
        </div>
        <div style={{ height: "0.5rem" }}></div>

        <MaskDetailComponent
          orderDetail={this.state.orderDetail}
          onRef={(child) => {
            this.$child = child;
          }}
        />
      </div>
    );
  }
  handlerTitle() {
    let { orderDetail } = this.state;
    let { start_runtime } = orderDetail;
    if (!start_runtime) return;
    // return dayjs(dayjs('2022-02-08 15:24').valueOf()).fromNow()
    // if()
    return (
      dayjs(start_runtime).calendar(null, {
        sameDay: "[今天] A h:mm ", // The same day ( Today at 2:30 AM )
        nextDay: "[明天]", // The next day ( Tomorrow at 2:30 AM )
        nextWeek: "[下周]", // The next week ( Sunday at 2:30 AM )
        lastDay: "[昨天]", // The day before ( Yesterday at 2:30 AM )
        lastWeek: "[上周] dddd", // Last week ( Last Monday at 2:30 AM )
        sameElse: "YY年MM月DD日", // Everything else ( 7/10/2011 )
      }) + "开场"
    );
  }
  handleVerifyCode() {
    // console.log(
    //   dayjs("2022-01-20 01:40").diff(dayjs("2022-01-20 01:33"), "minute")
    // );
    let { orderDetail } = this.state;
    let { order_verify_code } = orderDetail;
    if (!order_verify_code) return;
    return (
      order_verify_code.toString().substring(0, 4) +
      " " +
      order_verify_code.toString().substring(4, 8) +
      " " +
      order_verify_code.toString().substring(8, 12) +
      " " +
      order_verify_code.toString().substring(12, 16)
    );
  }
}

export default GroupCommons(OrderDetail);

class MaskDetailComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleMask: false,
      service: [],
      cinema_name: "",
    };
  }
  static defaultProps = {
    orderDetail: {},
  };
  render() {
    let { isVisibleMask } = this.state;
    let { orderDetail } = this.props;
    return (
      <Popup visible={isVisibleMask}>
        <div className="order-detail--mask-container">
          <NavBar
            style={{ backgroundColor: "#fff" }}
            backArrow={false}
            right={
              <CloseOutline
                fontSize={24}
                onClick={() => {
                  this.close();
                }}
              />
            }
            onBack={() => {}}
          >
            价格明细
          </NavBar>
          <div className="content">
            <List>
              <List.Item
                arrow={false}
                border="none"
                extra={orderDetail.ticket_count + "张"}
              >
                电影票
              </List.Item>
              <List.Item
                arrow={false}
                border="none"
                extra={
                  <div>
                    <span className="premium">
                      含服务费{orderDetail.premium}元/张
                    </span>{" "}
                    <span style={{ color: "red" }}>{orderDetail.price}</span>元
                  </div>
                }
              >
                原价
              </List.Item>
              <List.Item
                arrow={false}
                border="none"
                extra={
                  <div>
                    <span className="premium">
                      <span style={{ color: "red" }}>¥{orderDetail.price}</span>
                    </span>
                  </div>
                }
              >
                实际支付
              </List.Item>
              {/* <List.Item arrow={false} border="none" extra={'-3元'}>
                抵用券
              </List.Item> */}
            </List>
          </div>
        </div>
      </Popup>
    );
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  componentWillUnmount = () => {
    this.setState = (state, callback) => {
      return;
    };
  };
  open(service, cinema_name) {
    this.setState({
      isVisibleMask: true,
    });
  }
  close() {
    this.setState({
      isVisibleMask: false,
    });
  }
}
