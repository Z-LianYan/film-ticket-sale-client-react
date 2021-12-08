import React, { Component } from "react";
import "./index.scss";
import { NavBar, NoticeBar, Space, Button, Toast } from "antd-mobile";
import { DownOutline, UpOutline, CloseOutline } from "antd-mobile-icons";
import hammerjs from "hammerjs";
import { get_schedule_info, get_seat } from "@/api/selectSeatBuyTicket";
import dayjs from "dayjs";
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
      // seatList: {},
      seatList: [],
      selectedSeat: [],
      hallDetail: {},
    };
  }
  componentDidMount() {
    console.log("this.props", this.props);
    this.onGestureHander();
    this.getCinemaDetail();
  }
  onGestureHander() {
    let seatsList = document.querySelector(".seat-list");
    let dis = (seatsList.offsetWidth - document.body.clientWidth) / 2;
    this.setState({
      left: -dis,
      sideDistance: dis,
    });
    console.log("window", document.body.clientWidth, seatsList.offsetWidth);
    //创建一个新的hammer对象并且在初始化时指定要处理的dom元素
    var hammertime = new hammerjs(document.querySelector(".seats-box"));
    hammertime.get("pan").set({ direction: hammerjs.DIRECTION_ALL });
    hammertime.get("pinch").set({ enable: true });

    // hammertime.get("rotate").set({ enable: true });
    //为该dom元素指定触屏移动事件
    let _this = this;
    hammertime.on("pinch", function (ev) {
      if (ev.additionalEvent == "pinchin" && _this.state.scaleX <= 1) {
        _this.setState({
          scaleX: 1,
          scaleY: 1,
        });
        return;
      }
      if (ev.additionalEvent == "pinchout" && _this.state.scaleX >= 3) {
        _this.setState({
          scaleX: 3,
          scaleY: 3,
        });
        return;
      }
      // setTimeout(() => {
      _this.setState({
        scaleX:
          ev.additionalEvent == "pinchout"
            ? _this.state.scaleX + 0.05
            : _this.state.scaleX - 0.08,
        scaleY:
          ev.additionalEvent == "pinchout"
            ? _this.state.scaleY + 0.05
            : _this.state.scaleY - 0.08,
      });
      // });
    });
    hammertime.on("pan", function (ev) {
      let offsetW = ev.deltaX + _this.state.left;
      let offsetH = ev.deltaY + _this.state.top;
      if (ev.isFinal) {
        _this.setState({
          deltaX: 0,
          deltaY: 0,
          left: offsetW,
          top: offsetH,
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
    // let obj = {};
    // for (let item of seat) {
    //   if (!obj[item.row]) {
    //     obj[item.row] = [item];
    //   } else {
    //     obj[item.row].push(item);
    //   }
    // }
    this.setState({
      // seatList: obj,
      hallDetail: result,
      seatList: seat,
      selectedSeat: [],
    });
    // console.log("result", this.state.seatList);
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
    } = this.state;
    let { film } = scheduleInfo;
    let cellWidth = 100 / hallDetail.seat_row_num;
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
                <li className="price-item" key={index}>
                  <i
                    className="iconfont icon-kexuanzuowei seat-icon"
                    style={{ color: seatSectionShowColor[item.section_id] }}
                  ></i>{" "}
                  <span className="section-price">¥{item.price}</span>
                </li>
              );
            })}
          </ul>
        ) : null}

        <div className="seats-box">
          {/* <svg data-v-6ef675ea="" 
          aria-hidden="true" class="icon">
            <use data-v-6ef675ea="" xlink:href="#icon-1-2"></use>
          </svg> */}
          <ul
            className="seat-list"
            style={{
              transform: `translate(${left + deltaX}px, ${
                top + deltaY
              }px) scale(${scaleX},${scaleY})`,
              height: cellWidth * hallDetail.seat_column_num + "vw",
            }}
          >
            {seatList.map((item, index) => {
              // if(item.disabled==2) return;
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
                    if (item.disabled !== 0) return;
                    let { selectedSeat } = this.state;
                    let flag = true;
                    this.setState({
                      // scaleX: 3,
                      // scaleY: 3,
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
                  {item.disabled === 0 ? (
                    this.handleSelectedSeat(item) ? (
                      <i
                        className="iconfont icon-kexuanzuowei seat selected-seat"
                        style={{ fontSize: cellWidth * 0.9 + "vw" }}
                      ></i>
                    ) : (
                      <i
                        className="iconfont icon-kexuanzuowei seat can-select"
                        style={{
                          color: seatSectionShowColor[item.section_id],
                          fontSize: cellWidth * 0.9 + "vw",
                        }}
                      ></i>
                    )
                  ) : item.disabled === 1 ? (
                    <i
                      className="iconfont icon-kexuanzuowei seat no-select-seat"
                      style={{ fontSize: cellWidth * 0.9 + "vw" }}
                    ></i>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>

        {/* <div className="seats-box">
          <ul
            className="seat-list"
            style={{
              transform: `translate(${left + deltaX}px, ${
                top + deltaY
              }px) scale(${scaleX},${scaleY})`,
            }}
          >
            {Object.keys(seatList).map((key) => {
              return (
                <li className="row" key={key}>
                  {seatList[key].map((item, index) => {
                    return (
                      <div
                        className="cell"
                        key={key + index.toString()}
                        onClick={() => {
                          //disabled 0可选 1不可选 2无座
                          if (item.disabled !== 0) return;

                          let { selectedSeat } = this.state;
                          let flag = true;
                          this.setState({
                            scaleX: 3,
                            scaleY: 3,
                            isShowScheduleList:false,
                          })
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
                        {item.disabled === 0 ? (
                          this.handleSelectedSeat(item) ? (
                            <i className="iconfont icon-kexuanzuowei seat selected-seat"></i>
                          ) : (
                            <i 
                            className="iconfont icon-kexuanzuowei seat can-select" style={{color:seatSectionShowColor[item.section_id]}}></i>
                          )
                        ) : item.disabled === 1 ? (
                          <i className="iconfont icon-kexuanzuowei seat no-select-seat"></i>
                        ) : null}
                      </div>
                    );
                  })}
                </li>
              );
            })}
          </ul>
        </div> */}
        <div className="bottom-wrapper">
          {!isShowScheduleList ? (
            <div className="seat-template-status">
              <div className="status-item">
                <i className="iconfont icon-kexuanzuowei seat no-select-seat"></i>
                <span className="txt">不可选</span>
              </div>
              <div className="status-item">
                <i className="iconfont icon-kexuanzuowei seat sale-out-seat"></i>
                <span className="txt">已售</span>
              </div>
              <div className="status-item">
                <i className="iconfont icon-kexuanzuowei seat can-select"></i>
                <span className="txt">可选</span>
              </div>
              <div className="status-item">
                <i className="iconfont icon-kexuanzuowei seat selected-seat"></i>
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
