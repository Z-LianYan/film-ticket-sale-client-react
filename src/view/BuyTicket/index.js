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
  Dialog
} from "antd-mobile";
import { DownOutline, UpOutline, CloseOutline } from "antd-mobile-icons";
import hammerjs from "hammerjs";
import { get_schedule_info, get_seat } from "@/api/selectSeat";
import { get_buy_ticket_detail } from "@/api/order";
import dayjs from "dayjs";
import tools from "@/utils/tools";

import { GroupCommons } from "@/modules/group";
import Item from "antd-mobile/es/components/dropdown/item";
import CustomSkeleton from "@/components/CustomSkeleton/index";

class BuyTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderDetail: {},
      isSkeleton: true,
      // selectedSchedule: {},
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
    let { history, location } = this.props;
    try {
      let result = await get_buy_ticket_detail({
        schedule_id: location.state.schedule_id,
        select_seat_ids: location.state.select_seat_ids.join(",")
      });
      this.setState({
        isSkeleton:false,
        orderDetail: result,
      });
    } catch (err) {
      if(err.error==401){
        this.props.login(null)//如果token认证过期 清空当前缓存的登录信息
        history.replace({
          pathname:'/login'
        })
      }
    }
  }

  async onGoToPay(){
    let { orderDetail } = this.state;
    const result = await Dialog.confirm({
      content: '您确认支付吗？',
    })
    if (result) {
      
      // Toast.show({ content: '点击了确认', position: 'bottom' })
    } else {
      // Toast.show({ content: '点击了取消', position: 'bottom' })
    }
  }

  render() {
    let { history, location } = this.props;
    let { orderDetail,isSkeleton } = this.state;
    console.log("orderDetail----", orderDetail);
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
        {isSkeleton?<CustomSkeleton section={5} row={5}/>:null}
        <NavBar
          style={{ backgroundColor: "#fff" }}
          backArrow={true}
          onBack={() => {
            history.goBack();
          }}
        >
          支付订单
        </NavBar>
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
                <span>原价 ¥{orderDetail.origin_total_price}</span>
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
              extra={"票价小计 ¥" + orderDetail.total_price}
            ></List.Item>
          </List>
        </div>
        <div className="bottom-bar">
          <div className="price">{orderDetail.total_price}</div>
          <div className="right-wrapper">
            <div className="detail-box" onClick={()=>{
              this.$child.open();
            }}>
              <span className="txt">明细</span>
              <DownOutline/>
            </div>
            <Button color='primary' onClick={()=>{
              this.onGoToPay()
            }}>确认支付</Button>
          </div>
        </div>

        <MaskDetailComponent orderDetail={this.state.orderDetail} onRef={(child)=>{
          this.$child = child;
        }}/>
      </div>
    );
  }
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
    orderDetail:{}
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
            right={<CloseOutline fontSize={24} onClick={()=>{
              this.close()
            }}/>}
            onBack={() => {
            }}
          >
            价格明细
          </NavBar>
          <div className="content">
            <List>
              <List.Item arrow={false} border="none" extra={orderDetail.ticket_count+"张"}>
                电影票
              </List.Item>
              <List.Item arrow={false} border="none" extra={<div><span className="premium">含服务费{orderDetail.premium}元/张</span> {orderDetail.total_price}元</div>}>
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
