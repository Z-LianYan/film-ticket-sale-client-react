import React, { Component } from "react";
import "./index.scss";
import { NavBar, NoticeBar, Space, Button, Toast } from "antd-mobile";
import { DownOutline, UpOutline, CloseOutline } from "antd-mobile-icons";
import hammerjs from "hammerjs";
import { get_schedule_info, get_seat } from "@/api/selectSeat";
import { get_buy_ticket_detail } from "@/api/order";
import dayjs from "dayjs";
import tools from "@/utils/tools";

import { GroupCommons } from "@/modules/group";
class BuyTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scheduleInfo: {},
      isSkeleton: true,
      scheduleList: [],
      selectedSchedule: {},
    };
  }
  componentDidMount() {
    console.log("1234", this.props);
    this.getCinemaDetail();
  }

  handerDate(date) {
    let today = dayjs().format("YYYY-MM-DD");
    let tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");
    let houtian = dayjs().add(2, "day").format("YYYY-MM-DD");
    let cur_y = dayjs(date).format("YYYY");
    let y = dayjs().format("YYYY");
    switch (dayjs(date).format("YYYY-MM-DD")) {
      case today:
        return "今天" + dayjs(date).format("MM月DD日");
      case tomorrow:
        return "明天" + dayjs(date).format("MM月DD日");
      case houtian:
        return "后天" + dayjs(date).format("MM月DD日");
      default:
        return (
          this.handleWeek(dayjs(date).day()) +
          dayjs(date).format(cur_y == y ? "MM月DD日" : "YY年MM月DD日")
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
  async getCinemaDetail() {
    let { history, location } = this.props;
    let result = await get_buy_ticket_detail({
      schedule_id: location.state.schedule_id,
      select_seat_ids: location.state.select_seat_ids.join(","),
    });
    // this.setState({
    //   scheduleInfo: result,
    //   scheduleList: result.film.schedule,
    // });
  }

  calcTotalPrice() {
    let { selectedSeat, selectedSchedule } = this.state;
    let totalPrice = 0;
    for (let i = 0; i < selectedSeat.length; i++) {
      if (selectedSchedule.is_section == 1) {
        for (let j = 0; j < selectedSchedule.sectionPrice.length; j++) {
          let it = selectedSchedule.sectionPrice[j];
          if (selectedSeat[i].section_id === it.section_id) {
            totalPrice += Number(it.price);
          }
        }
      } else {
        totalPrice += Number(selectedSchedule.price);
      }
    }
    return totalPrice.toFixed(2);
  }
  render() {
    let { history, location } = this.props;
    let { scheduleInfo } = this.state;
    let { film } = scheduleInfo;
    return (
      <div className="select-seat-buy-ticket-box">
        <NavBar
          style={{ backgroundColor: "#fff" }}
          backArrow={true}
          onBack={() => {
            history.goBack();
          }}
        >
          支付订单
        </NavBar>
      </div>
    );
  }
}

export default GroupCommons(BuyTicket);
