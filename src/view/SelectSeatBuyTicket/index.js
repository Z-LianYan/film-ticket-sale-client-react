import React, { Component } from "react";
import "./index.scss";
import { NavBar, NoticeBar, Space, Button, Toast } from "antd-mobile";
import { DownOutline, UpOutline, CloseOutline } from "antd-mobile-icons";
import hammerjs from "hammerjs";
import { get_schedule_info, get_seat } from "@/api/selectSeatBuyTicket";
import dayjs from "dayjs";
import noSelectedIcon from "@/static/img/no-selected.png";
import disableIcon from "@/static/img/disable.png";
import alreadySaleIcon from "@/static/img/already-sale.png";
import selectedIcon from "@/static/img/selected.png";
import sectionA from "@/static/img/sectionA.png";
import sectionB from "@/static/img/sectionB.png";
import sectionC from "@/static/img/sectionC.png";
import sectionD from "@/static/img/sectionD.png";

import { GroupCommons } from "@/modules/group";
class SelectSeatBuyTicket extends Component {
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
    };
  }
  componentDidMount() {
    console.log("this.props", this.props);
    this.onGestureHander();
    this.getCinemaDetail();
  }
  onGestureHander() {
    let seatsList = document.querySelector(".seat-list");
    // let dis = (seatsList.offsetWidth - document.body.clientWidth) / 2;
    // this.setState({
    //   left: -dis,
    //   sideDistance: dis,
    // });
    // console.log("window", document.body.clientWidth, seatsList.offsetWidth);
    //创建一个新的hammer对象并且在初始化时指定要处理的dom元素
    var hammertime = new hammerjs(document.querySelector(".seats-box"));
    hammertime.get("pan").set({ direction: hammerjs.DIRECTION_ALL });
    hammertime.get("pinch").set({ enable: true });

    // hammertime.get("rotate").set({ enable: true });
    //为该dom元素指定触屏移动事件
    let _this = this;
    hammertime.on("pinch", function (ev) {
      console.log(ev);
      // Toast.show({
      //   content: "X" + ev.deltaX + "Y" + ev.deltaY,
      // });

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
      console.log("pan", ev);
      let offsetW = ev.deltaX + _this.state.left;
      let offsetH = ev.deltaY + _this.state.top;
      if (ev.isFinal) {
        _this.setState({
          deltaX: 0,
          deltaY: 0,
          left: offsetW,
          top: offsetH,
          // left: offsetW >= 0 ? 0 : offsetW,
          // top: offsetH >= 0 ? 0 : offsetH,
        });

        // Toast.show({
        //   content:
        //     seatsList.offsetWidth * _this.state.scaleX +
        //     "-" +
        //     document.body.clientWidth +
        //     "x" +
        //     _this.state.left +
        //     "y" +
        //     _this.state.top,
        // });

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
    let { history, location } = this.props;
    let result = await get_schedule_info({
      cinema_id: location.state.cinema_id,
      film_id: location.state.film_id,
      date: location.state.date,
    });
    this.setState({
      scheduleInfo: result,
      scheduleList: result.film.schedule,
    });
    if (location.state.hall_id) {
      result.film.schedule.map((item, index) => {
        if (item.id == location.state.schedule_id) {
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
    }
  }
  async getSeatList() {
    let { selectedSchedule } = this.state;
    // console.log('座位列表',selectedSchedule)
    let result = await get_seat({
      hall_id: selectedSchedule.hall_id,
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
      seat_real_rows,
    });
    console.log("seat_real_rows", this.state.seat_real_rows);
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
        totalPrice += Number(selectedSchedule.price);
      }
    }
    return totalPrice.toFixed(2);
  }
  render() {
    let { history, location, seatSectionShowColor } = this.props;
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
    } = this.state;
    let { film } = scheduleInfo;
    let cellWidth = 100 / hallDetail.seat_column_num;
    return (
      <div className="select-seat-buy-ticket-box">
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
                    {/* <p>¥{item.price}</p> */}
                  </div>

                  {/* <i
                    className="iconfont icon-kexuanzuowei seat-icon"
                    style={{ color: seatSectionShowColor[item.section_id] }}
                  ></i>{" "}
                  <span className="section-price">¥{item.price}</span> */}
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
                transform: `translateY(${top + deltaY + 50}px) scale(${
                  scaleX >= 1.5 ? 1.5 : scaleX
                },${scaleY})`,
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
                      fontSize: cellWidth * 0.2 + "vw",
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
                top + deltaY + 50
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
                    this.setState({
                      scaleX: scaleX >= 1.3 ? scaleX : 1.3,
                      scaleY: scaleX >= 1.3 ? scaleX : 1.3,
                    });
                    if (item.disabled !== 0) return;

                    // let { selectedSeat } = this.state;
                    let seats = selectedSeat.map((im) => im.id);
                    if (
                      selectedSeat.length >= selectedSchedule.buy_max &&
                      selectedSchedule.buy_max !== 0 &&
                      !seats.includes(item.id)
                    ) {
                      //selectedSchedule.buy_max
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
                        item.disabled == 0
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
                <h5 className="film-name">{film && film.film_name}</h5>
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
                {film ? this.handerDate(film.schedule_date) : ""}{" "}
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
                                this.getSeatList();
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
                              ? item.price
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
                          ? selectedSchedule.price
                          : this.handlerSelectedSectionPrice(item)}
                      </p>
                    </div>
                    <div className="right">
                      <CloseOutline
                        onClick={() => {
                          console.log("关闭");
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
              Toast.show({
                icon: "none",
                duration: 2000,
                content: "去购买",
              });
              // history.push({
              //   pathname: "/film/cinema",
              //   state: {
              //     film_id: 234,
              //   },
              // });
            }}
          >
            {this.calcTotalPrice()}元 确认选座
          </Button>
        </div>
      </div>
    );
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

export default GroupCommons(SelectSeatBuyTicket);
