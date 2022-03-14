import React, { Component, useEffect, useRef, useState } from "react";
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
import {
  DownOutline,
  UpOutline,
  CloseOutline,
  ClockCircleOutline,
} from "antd-mobile-icons";
import hammerjs from "hammerjs";
import {
  create_order,
  pay_order,
  cancle_order,
  get_buy_ticket_detail,
} from "@/api/order";
import { get_user_info } from "@/api/user";
import dayjs from "dayjs";
import tools from "@/utils/tools";

import { GroupCommons } from "@/modules/group";
import CustomSkeleton from "@/components/CustomSkeleton/index";

class BuyTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderDetail: {},
      isSkeleton: true,
      expire_time: 0,
      // selectedSchedule: {},
      timerSetInterVal: "",

      isNotCancelOrder: false, //本页面操作标识
    };
  }
  componentDidMount() {
    this.getOrderDetail();
  }

  handerDate(date) {
    let today = dayjs().format("YYYY-MM-DD");
    let tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");
    let houtian = dayjs().add(2, "day").format("YYYY-MM-DD");
    let cur_y = dayjs(date).format("YYYY");
    let y = dayjs().format("YYYY");
    switch (dayjs(date).format("YYYY-MM-DD")) {
      case today:
        return "今天" + dayjs(date).format("M月D日");
      case tomorrow:
        return "明天" + dayjs(date).format("M月D日");
      case houtian:
        return "后天" + dayjs(date).format("M月D日");
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
        return "周日";
      case 1:
        return "周一";
      case 2:
        return "周二";
      case 3:
        return "周三";
      case 4:
        return "周四";
      case 5:
        return "周五";
      case 6:
        return "周六";
      default:
        return "";
    }
  }
  async getOrderDetail() {
    let { history, location, match } = this.props;
    let { params } = match;
    try {
      let result = await get_buy_ticket_detail({
        order_id: params && params.order_id,
      });
      this.setState({
        isSkeleton: false,
        orderDetail: result,
      });
      this.setState({ expire_time: result.expireTime });
      this.onSetInterval();
    } catch (err) {
      if (err.error == 400) {
        setTimeout(() => {
          history.goBack();
        }, 1500);
      }
      if (err.error == 401) {
        this.props.login(null); //如果token认证过期 清空当前缓存的登录信息
        history.replace({
          pathname: "/login",
        });
      }
    }
  }
  onDialog() {
    Dialog.alert({
      content: "支付超时，该订单已失效，请重新选座购票",
      closeOnMaskClick: false,
      onConfirm: () => {
        this.setState(
          {
            isNotCancelOrder: true,
          },
          () => {
            this.props.history.goBack();
          }
        );
      },
    });
  }
  onSetInterval() {
    let timer = setInterval(() => {
      let { expire_time } = this.state;
      if (expire_time <= 0) {
        this.onDialog();
        clearInterval(timer);
      } else {
        expire_time -= 1;
        this.setState({ expire_time: expire_time });
      }
    }, 1000);
    this.setState({
      timerSetInterVal: timer,
    });
  }
  handleMinute() {
    let { expire_time } = this.state;
    let m = Math.floor(expire_time / 60);
    let s = expire_time % 60;
    return m + ":" + (s > 9 ? s : "0" + s);
  }

  async onGoToPay() {
    let { history } = this.props;
    let { orderDetail } = this.state;
    let { select_seats } = orderDetail;
    try {
      const result = await Dialog.confirm({
        content: "您确认支付吗？",
      });
      if (!result) return;
      // let seat_ids = [];
      // for (let item of select_seats) {
      //   if (orderDetail.is_section == 1) {
      //     for (let it of item.seatList) {
      //       seat_ids.push(it.id);
      //     }
      //   } else {
      //     seat_ids.push(item.id);
      //   }
      // }
      let pay_result = await pay_order({
        order_id: orderDetail.order_id,
        pay_type: "user_balance",
      });
      if (pay_result) this.getUserInfo();
      setTimeout(() => {
        history.replace("/order/detail/" + pay_result.order_id);
      }, 800);
    } catch (err) {
      if (err.error == "noBalance") {
        await Dialog.confirm({
          title: err.message,
          content: "",
          confirmText: "前往充值",
          onConfirm: () => {
            history.push("/recharge");
          },
        });
      }
    }
  }

  async getUserInfo() {
    let result = await get_user_info();
    if (result) this.props.login(result, () => {});
  }

  render() {
    let { history, location } = this.props;
    let { orderDetail, isSkeleton, expire_time } = this.state;
    let arr_label = [
      <span className="hall-name" key={"abc"}>
        {orderDetail.hall_name}
      </span>,
    ];
    if (orderDetail.select_seats) {
      orderDetail.select_seats.map((item, index) => {
        if (orderDetail.is_section == 1) {
          arr_label.push(
            <span className="section-name" key={index + "s"}>
              {index == 0 ? "" : "|"} {item.section_name}
            </span>
          );
          item.seatList.map((it, idx) => {
            arr_label.push(
              <span className="seat" key={idx + "se" + index}>
                {it.row_id}排{it.column_id}座
              </span>
            );
          });
        } else {
          arr_label.push(
            <span className="seat" key={index + "se"}>
              {item.row_id}排{item.column_id}座
            </span>
          );
        }
      });
    }
    return (
      <div className="buy-ticket-detail-box">
        {isSkeleton ? <CustomSkeleton section={5} row={5} /> : null}
        <NavBar
          style={{ backgroundColor: "#fff" }}
          backArrow={true}
          onBack={async () => {
            history.goBack();
          }}
        >
          支付订单
        </NavBar>
        {/* <ExpireTimeDom expireTime={orderDetail.expireTime} /> */}
        <div className="expire-time-wrapper">
          <ClockCircleOutline fontSize={16} color="#fff" />{" "}
          <span className="time">{this.handleMinute()}</span>
        </div>
        <div className="header-wrapper">
          <Image
            src={orderDetail.poster_img}
            width={72}
            height={100}
            fit="fill"
          />
          <div className="right-wrapper">
            <div className="title-box">
              <h3>{orderDetail.film_name}</h3>
              <div className="count-price">
                {orderDetail.ticket_count}张{" "}
                <span>原价 ¥{orderDetail.origin_price}</span>
              </div>
            </div>
            <div className="date-time-language-type">
              <span className="date">
                {this.handerDate(orderDetail.start_runtime)}
              </span>
              <span className="time">
                {dayjs(orderDetail.start_runtime).format("HH:mm")}
              </span>
              <span className="language-type">
                ({orderDetail.language}
                {orderDetail.play_type_name})
              </span>
            </div>
            <div className="cinema-box">{orderDetail.cinema_name}</div>
            <div className="hall-section-seat">{arr_label}</div>
          </div>
        </div>

        <div className="content-box">
          <List model="default">
            <List.Item arrow={false} border="none" extra={"无可用"}>
              抵用券
            </List.Item>
            <List.Item
              arrow={false}
              border="none"
              extra={"票价小计 ¥" + orderDetail.price}
            ></List.Item>
          </List>
        </div>
        <div className="bottom-bar">
          <div className="price">{orderDetail.price}</div>
          <div className="right-wrapper">
            <div
              className="detail-box"
              onClick={() => {
                this.$child.open();
              }}
            >
              <span className="txt">明细</span>
              <DownOutline />
            </div>
            <Button
              color="primary"
              onClick={() => {
                this.setState(
                  {
                    isNotCancelOrder: true,
                  },
                  () => {
                    this.onGoToPay();
                  }
                );
              }}
            >
              确认支付
            </Button>
          </div>
        </div>

        <MaskDetailComponent
          orderDetail={this.state.orderDetail}
          onRef={(child) => {
            this.$child = child;
          }}
        />
      </div>
    );
  }
  componentWillUnmount = async () => {
    let { orderDetail, isNotCancelOrder } = this.state;
    let { location } = this.props;
    /**
     * isCancelOrder 是否取消订单 为true取消订单 （从确认选座是进来时返回需要取消订单）
     */
    if (
      orderDetail.order_id &&
      location.state &&
      location.state.isCancelOrder &&
      !isNotCancelOrder
    ) {
      //取消订单
      await cancle_order({ order_id: orderDetail.order_id });
    }
    clearInterval(this.state.timerSetInterVal);

    this.setState = (state, callback) => {
      return;
    };
  };
}

export default GroupCommons(BuyTicket);

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
                    {orderDetail.price}元
                  </div>
                }
              >
                原价
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

// function ExpireTimeDom({ expireTime }) {
//   // console.log("哈哈哈哈", typeof expireTime);
//   if (!expireTime) return;
//   // // if (!expireTime) return;
//   // let [expire_time, set_expire_time] = useState([expireTime]);

//   // useEffect(() => {
//   //   console.log("expireTime---123", expire_time);
//   //   if (expire_time <= 0) return;
//   //   // let type = typeof expire_time;
//   //   console.log("expireTime---123---", expire_time);

//   //   setTimeout(() => {
//   //     expire_time -= 1;
//   //     set_expire_time(expire_time);
//   //   }, 1000);
//   //   return () => {};
//   // });
//   function handleMinute(_expireTime) {
//     let m = Math.floor(_expireTime / 60);
//     let s = _expireTime % 60;
//     return m + ":" + (s > 9 ? s : "0" + s);
//   }

//   let _expireTime = expireTime;

//   let timer = setInterval(() => {
//     if (_expireTime <= 0) {
//       clearInterval(timer);
//     } else {
//       _expireTime -= 1;
//     }
//   }, 1000);

//   return (
//     <div className="expire-time-wrapper">
//       <ClockCircleOutline fontSize={16} color="#fff" />{" "}
//       <span className="time">{handleMinute(_expireTime)}</span>
//     </div>
//   );
// }
