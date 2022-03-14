import React, { Component } from "react";
import "./index.scss";
import { NavBar, NoticeBar, Space, Button, Toast } from "antd-mobile";
import { DownOutline, UpOutline, CloseOutline } from "antd-mobile-icons";
import hammerjs from "hammerjs";
import { get_schedule_info, get_seat } from "@/api/selectSeat";
import dayjs from "dayjs";
import noSelectedIcon from "@/static/img/no-selected.png";
import disableIcon from "@/static/img/disable.png";
import alreadySaleIcon from "@/static/img/already-sale.png";
import selectedIcon from "@/static/img/selected.png";
import sectionA from "@/static/img/sectionA.png";
import sectionB from "@/static/img/sectionB.png";
import sectionC from "@/static/img/sectionC.png";
import sectionD from "@/static/img/sectionD.png";
import CustomSkeleton from "@/components/CustomSkeleton/index";

import { create_order } from "@/api/order";

import { GroupCommons } from "@/modules/group";
import { alert } from "antd-mobile/es/components/dialog/alert";
class SelectSeat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowNoticeDetail: false,
      isShowScheduleList: false,
      left: 0,
      top: 0,
      deltaX: 0,
      deltaY: 0,
      scaleX: 1,
      scaleY: 1,

      scheduleInfo: {},
      isSkeleton: true,
      scheduleList: [],
      selectedSchedule: {},
      seatList: [],
      selectedSeat: [],
      hallDetail: {},
      seat_real_rows: [],
      seatListTopHeight: 50,
    };
  }
  componentDidMount() {
    console.log("登录信息", this.props);
    this.onGestureHander();
    this.getCinemaDetail();
  }
  onGestureHander() {
    let { seatListTopHeight } = this.state;
    //创建一个新的hammer对象并且在初始化时指定要处理的dom元素
    var hammertime = new hammerjs(document.querySelector(".seats-box"));
    hammertime.get("pan").set({ direction: hammerjs.DIRECTION_ALL });
    hammertime.get("pinch").set({ enable: true });

    // hammertime.get("rotate").set({ enable: true });
    //为该dom元素指定触屏移动事件
    let _this = this;
    hammertime.on("pinch", function (ev) {
      if (ev.deltaY < 5 && ev.deltaY > -5 && ev.deltaX < 5 && ev.deltaX > -5)
        return;

      if (ev.additionalEvent == "pinchin" && _this.state.scaleX <= 1) {
        _this.setState({
          scaleX: 1,
          scaleY: 1,
        });
        return;
      }
      if (ev.additionalEvent == "pinchout" && _this.state.scaleX >= 2) {
        _this.setState({
          scaleX: 2,
          scaleY: 2,
        });
        return;
      }
      _this.setState({
        scaleX:
          ev.additionalEvent == "pinchout"
            ? _this.state.scaleX + 0.03
            : _this.state.scaleX - 0.03,
        scaleY:
          ev.additionalEvent == "pinchout"
            ? _this.state.scaleY + 0.03
            : _this.state.scaleY - 0.03,
      });
    });
    hammertime.on("pan", function (ev) {
      let seatsList = document.querySelector(".seat-list");
      let seatsBox = document.querySelector(".seats-box");

      let offsetWidth = seatsList.offsetWidth;
      let offsetHeight = seatsList.offsetHeight;

      let clientWidth = document.body.clientWidth;
      let clientHeight = seatsBox.offsetHeight;

      let total_offsetWidth = offsetWidth * _this.state.scaleX;
      let total_offsetHeight = offsetHeight * _this.state.scaleY;
      let cz_width = total_offsetWidth - clientWidth;
      let cz_Height = total_offsetHeight - clientHeight;

      let offsetW = ev.deltaX + _this.state.left;
      let offsetH = ev.deltaY + _this.state.top;

      // Toast.show({
      //   content:
      //     "total_offsetHeight" +
      //     total_offsetHeight +
      //     "seatsBox-height" +
      //     clientHeight +
      //     "cz_Height" +
      //     cz_Height +
      //     "offsetH" +
      //     offsetH,
      // });
      if (ev.isFinal) {
        _this.setState({
          deltaX: 0,
          deltaY: 0,
          left:
            offsetW >= cz_width + 40
              ? cz_width + 40
              : offsetW <= -cz_width - 40
              ? -cz_width - 40
              : offsetW,
          // top:
          //   offsetH >= cz_Height
          //   ? cz_Height
          //   : offsetH <= -cz_Height-seatListTopHeight
          //   ? -cz_Height-seatListTopHeight
          //   : offsetH,
          top:
            cz_Height <= 0
              ? offsetH >= clientHeight / 2
                ? clientHeight / 2
                : offsetH <= -10 - seatListTopHeight
                ? -10 - seatListTopHeight
                : offsetH
              : offsetH >= cz_Height + seatListTopHeight + 30
              ? cz_Height + seatListTopHeight + 30
              : offsetH <= -cz_Height - seatListTopHeight
              ? -cz_Height - seatListTopHeight
              : offsetH,
        });

        return;
      }
      _this.setState({
        deltaX: ev.deltaX,
        deltaY: ev.deltaY,
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
    let { history, location, match } = this.props;
    let { params } = match;
    try {
      let result = await get_schedule_info({
        schedule_id: params && params.schedule_id,
      });
      this.setState({
        scheduleInfo: result,
        scheduleList: result.schedule,
      });
      result.schedule.map((item, index) => {
        if (item.id == params.schedule_id) {
          this.setState(
            {
              selectedSchedule: item,
            },
            () => {
              this.getSeatList();
            }
          );
        }
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
  async getSeatList(schedule_id) {
    let { selectedSchedule, scheduleInfo } = this.state;
    let result = await get_seat({
      hall_id: selectedSchedule.hall_id,
      schedule_id: schedule_id ? schedule_id : scheduleInfo.schedule_id,
    });

    let seat = result.seat;

    this.setState({
      hallDetail: result,
      seatList: seat,
      selectedSeat: [],
    });

    let seat_real_rows = [];
    let obj = {};
    for (let item of seat) {
      if (!obj[item.row_id]) {
        obj[item.row_id] = true;
        seat_real_rows.push({
          row: item.row, //生成座位时的排数
          row_id: item.row_id, //真实座位排数
        });
      }
    }
    this.setState({
      isSkeleton: false,
      seat_real_rows,
    });
  }

  handlerSectionPrice(sectionPrice) {
    let price = 0;
    let num = 0;
    sectionPrice.map((item, index) => {
      item.price = Number(item.price);
      if (price === Number(item.price) && index !== 0) {
        num += 1;
      }
      if (price === 0) {
        price = item.price;
      } else if (item.price < price) {
        price = item.price;
      }
    });
    return price + (num + 1 == sectionPrice.length ? "" : " 起");
  }
  renderNotice() {
    let { scheduleInfo, isShowNoticeDetail } = this.state;
    return scheduleInfo.notices && scheduleInfo.notices.length ? (
      <NoticeBar
        content={
          scheduleInfo.notices &&
          scheduleInfo.notices.map((item) => item.text).join(" ")
        }
        color="alert"
        extra={
          <Space>
            <span
              onClick={() => {
                this.setState({
                  isShowNoticeDetail: !this.state.isShowNoticeDetail,
                });
              }}
            >
              {scheduleInfo.notices.length}个通知 <DownOutline />
              {isShowNoticeDetail ? (
                <div className="notice-bar-content-detail">
                  <h3 className="notice-title">温馨提示：</h3>
                  {scheduleInfo.notices.map((item, index) => {
                    return (
                      <div className="detail-content" key={index}>
                        <div className="content">{item.text}</div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </span>
          </Space>
        }
        style={{
          "--text-color": "#e68e1a",
          position: "relative",
        }}
      />
    ) : null;
  }
  handleSelectedSeat(item) {
    let { selectedSeat } = this.state;
    let flag = false;
    for (let i = 0; i < selectedSeat.length; i++) {
      if (selectedSeat[i].id === item.id) {
        flag = true;
      }
    }
    return flag;
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
        totalPrice += Number(selectedSchedule.sale_price);
      }
    }
    return totalPrice.toFixed(2);
  }
  render() {
    let { history, location } = this.props;
    let {
      isShowNoticeDetail,
      isShowScheduleList,
      left,
      top,
      deltaX,
      deltaY,
      scaleX,
      scaleY,
      scheduleInfo,
      scheduleList,
      selectedSchedule,
      seatList,
      selectedSeat,
      hallDetail,
      seat_real_rows,
      seatListTopHeight,
      isSkeleton,
    } = this.state;
    let { already_sale_seat } = hallDetail;
    let { film } = scheduleInfo;
    let cellWidth = 100 / hallDetail.seat_column_num;
    return (
      <div className="select-seat-buy-ticket-box">
        {isSkeleton ? <CustomSkeleton section={5} row={5} /> : null}
        <NavBar
          style={{ backgroundColor: "#fff" }}
          backArrow={true}
          onBack={() => {
            history.goBack();
          }}
        >
          {scheduleInfo.cinema_name}
        </NavBar>
        {this.renderNotice()}
        {selectedSchedule.is_section == 1 ? (
          <ul className="section-price-wrapper">
            {selectedSchedule.sectionPrice.map((item, index) => {
              return (
                <li className="section-item" key={index}>
                  <div
                    className="icons"
                    style={{
                      backgroundImage: `url(${
                        item.section_id == "a"
                          ? sectionA
                          : item.section_id == "b"
                          ? sectionB
                          : item.section_id == "c"
                          ? sectionC
                          : item.section_id == "d"
                          ? sectionD
                          : null
                      }`,
                    }}
                  ></div>
                  <div className="name-price">
                    <p>{item.section_name}</p>
                    <p className="price">¥{item.price}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : null}

        <div className="seats-box">
          {selectedSchedule.hall_name ? (
            <div
              className="screen-wrapper"
              style={{
                transform: `translateX(${left + deltaX}px)`,
              }}
            >
              <div className="screen-icon">
                {selectedSchedule.hall_name +
                  "/" +
                  selectedSchedule.hall_type_name}
              </div>
            </div>
          ) : null}

          {seat_real_rows.length ? (
            <div
              className="row-num-list"
              style={{
                transform: `translateY(${
                  top + deltaY + seatListTopHeight
                }px) scale(${scaleX >= 1.5 ? 1.5 : scaleX},${scaleY})`,
                height: cellWidth * hallDetail.seat_row_num + "vw",
              }}
            >
              {seat_real_rows.map((item, index) => {
                return (
                  <div
                    className="row"
                    key={index}
                    style={{
                      height: cellWidth + "vw",
                      top: cellWidth * (item.row - 1) + "vw",
                      // fontSize: cellWidth * 0.2 + "vw",
                    }}
                  >
                    <div className="cell">{item.row_id}</div>
                  </div>
                );
              })}
            </div>
          ) : null}

          <ul
            className="seat-list"
            style={{
              transform: `translate(${left + deltaX}px, ${
                top + deltaY + seatListTopHeight
              }px) scale(${scaleX},${scaleY})`,
              height: cellWidth * hallDetail.seat_row_num + "vw",
            }}
          >
            <div
              className="middle-line"
              style={{ height: cellWidth * hallDetail.seat_row_num + "vw" }}
            ></div>
            {seatList.map((item, index) => {
              return (
                <li
                  className="cell"
                  key={index}
                  style={{
                    width: cellWidth + "vw",
                    height: cellWidth + "vw",
                    top: cellWidth * item.row - cellWidth + "vw",
                    left: cellWidth * item.column - cellWidth + "vw",
                  }}
                  onClick={() => {
                    //disabled 0可选 1不可选 2无座
                    if (
                      item.disabled !== 0 ||
                      already_sale_seat.includes(item.id)
                    )
                      return;
                    let seats = selectedSeat.map((im) => im.id);
                    if (
                      selectedSeat.length >= selectedSchedule.buy_max &&
                      selectedSchedule.buy_max &&
                      !seats.includes(item.id)
                    ) {
                      return Toast.show({
                        content: `1次最多购买${selectedSchedule.buy_max}张`,
                      });
                    }
                    let flag = true;
                    this.setState({
                      isShowScheduleList: false,
                    });
                    for (let i = 0; i < selectedSeat.length; i++) {
                      if (selectedSeat[i].id === item.id) {
                        selectedSeat.splice(i, 1);
                        this.setState({
                          selectedSeat: selectedSeat,
                        });
                        flag = false;
                      }
                    }
                    if (flag) {
                      selectedSeat.push(item);
                      this.setState({
                        selectedSeat: selectedSeat,
                      });
                    }
                  }}
                >
                  <div
                    className="icons"
                    style={{
                      width: "70%",
                      height: "70%",
                      backgroundImage: `url(${
                        already_sale_seat.includes(item.id)
                          ? alreadySaleIcon
                          : item.disabled == 0
                          ? this.handleSelectedSeat(item)
                            ? selectedIcon
                            : selectedSchedule.is_section == 1
                            ? item.section_id == "a"
                              ? sectionA
                              : item.section_id == "b"
                              ? sectionB
                              : item.section_id == "c"
                              ? sectionC
                              : item.section_id == "d"
                              ? sectionD
                              : noSelectedIcon
                            : noSelectedIcon
                          : item.disabled == 1
                          ? disableIcon
                          : null
                      })`,
                    }}
                  ></div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="bottom-wrapper">
          {!isShowScheduleList ? (
            <div className="seat-template-status">
              <div className="status-item">
                <div
                  className="icons"
                  style={{ backgroundImage: `url(${disableIcon})` }}
                ></div>
                <span className="txt">不可选</span>
              </div>
              <div className="status-item">
                <div
                  className="icons"
                  style={{ backgroundImage: `url(${alreadySaleIcon})` }}
                ></div>
                <span className="txt">已售</span>
              </div>
              <div className="status-item">
                <div
                  className="icons"
                  style={{ backgroundImage: `url(${noSelectedIcon})` }}
                ></div>
                <span className="txt">可选</span>
              </div>
              <div className="status-item">
                <div
                  className="icons"
                  style={{ backgroundImage: `url(${selectedIcon})` }}
                ></div>
                <span className="txt">选中</span>
              </div>
            </div>
          ) : null}
          <div className="top-box">
            <div className="film-detail">
              <div className="top">
                <h5 className="film-name">
                  {scheduleInfo && scheduleInfo.film_name}
                </h5>
                <div
                  className="right"
                  onClick={() => {
                    this.setState({
                      isShowScheduleList: !this.state.isShowScheduleList,
                    });
                  }}
                >
                  切换场次{" "}
                  {isShowScheduleList ? <UpOutline /> : <DownOutline />}
                </div>
              </div>
              <div className="bot">
                {scheduleInfo
                  ? this.handerDate(scheduleInfo.schedule_date)
                  : ""}{" "}
                {dayjs(selectedSchedule.start_runtime).format("HH:mm")}{" "}
                {selectedSchedule.language}
                {selectedSchedule.play_type_name}
              </div>
            </div>
            <div className="shedule-wrapper">
              {isShowScheduleList
                ? scheduleList.length
                  ? scheduleList.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className={[
                            `she-item ${
                              selectedSchedule.id == item.id
                                ? "active-schedule-item"
                                : ""
                            }`,
                          ]}
                          onClick={() => {
                            if (selectedSchedule.id == item.id) return;

                            this.setState(
                              {
                                left: 0,
                                top: 0,
                                deltaX: 0,
                                deltaY: 0,
                                scaleX: 1,
                                scaleY: 1,
                                selectedSchedule: item,
                              },
                              () => {
                                this.getSeatList(item.id);
                              }
                            );
                          }}
                        >
                          <p className="time">
                            {dayjs(item.start_runtime).format("HH:mm")}
                          </p>
                          <p className="language">
                            {item.language}
                            {item.play_type_name}
                          </p>
                          <p className="price">
                            ¥{" "}
                            {item.is_section === 0
                              ? item.sale_price
                              : this.handlerSectionPrice(item.sectionPrice)}
                          </p>
                        </div>
                      );
                    })
                  : null
                : null}
            </div>

            <div className="line"></div>
            <div className="selected-seat-list">
              {selectedSeat.map((item, index) => {
                return (
                  <div
                    className="seat"
                    key={index}
                    onClick={() => {
                      // selectedSeat.splice(index, 1);
                      // this.setState({
                      //   selectedSeat,
                      // });
                    }}
                  >
                    <div className="left">
                      <p className="seat-txt">
                        {item.row_id}排{item.column_id}座
                      </p>
                      <p className="price">
                        ¥{" "}
                        {selectedSchedule.is_section === 0
                          ? selectedSchedule.sale_price
                          : this.handlerSelectedSectionPrice(item)}
                      </p>
                    </div>
                    <div className="right">
                      <CloseOutline
                        onClick={() => {
                          selectedSeat.splice(index, 1);
                          this.setState({
                            selectedSeat,
                          });
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="select-seat-buy-btn-box">
          <Button
            style={{
              "--border-radius": 0,
            }}
            className="select-seat-buy-btn"
            block
            color="primary"
            fill="solid"
            size="middle"
            disabled={selectedSeat.length ? false : true}
            onClick={() => {
              // history.push({
              //   pathname: "/buy/ticket",
              //   state: {
              //     schedule_id: selectedSchedule.id,
              //     buy_seat_ids: selectedSeat.map((item) => item.id),
              //     isCancelOrder: true,
              //   },
              // });
              this.onCreateOreder();
            }}
          >
            {this.calcTotalPrice()}元 确认选座
          </Button>
        </div>
      </div>
    );
  }
  async onCreateOreder() {
    let { selectedSeat, selectedSchedule } = this.state;
    let { history } = this.props;
    try {
      let result = await create_order({
        schedule_id: selectedSchedule.id,
        buy_seat_ids: selectedSeat.map((item) => item.id).join(","),
      });
      console.log("生成订单", result);
      if (!result) return;
      history.push({
        pathname: "/buy/ticket/" + result.order_id,
        state: {
          isCancelOrder: true,
        },
      });
    } catch (err) {
      console.log("err", err.message);
    }
  }
  handlerSelectedSectionPrice(it) {
    let { selectedSchedule } = this.state;
    let price = 0;
    selectedSchedule.sectionPrice.map((item, index) => {
      item.price = Number(item.price);
      if (item.section_id === it.section_id) {
        price = item.price;
      }
    });
    return price;
  }
}

export default GroupCommons(SelectSeat);
