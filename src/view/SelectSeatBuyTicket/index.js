import React, { Component } from "react";
import "./index.scss";
import { NavBar, NoticeBar, Space, Button } from "antd-mobile";
import { DownOutline, UpOutline, CloseOutline } from "antd-mobile-icons";
import hammerjs from "hammerjs";
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
    };
  }
  componentDidMount() {
    //创建一个新的hammer对象并且在初始化时指定要处理的dom元素
    var hammertime = new hammerjs(document.querySelector(".seat-list"));
    hammertime.get("pan").set({ direction: hammerjs.DIRECTION_ALL });
    hammertime.get("pinch").set({ enable: true });
    // hammertime.get("rotate").set({ enable: true });
    //为该dom元素指定触屏移动事件
    let _this = this;
    // hammertime.on("pinch", function (ev) {
    //   //控制台输出
    //   console.log("哈哈哈--pinch", ev.additionalEvent);
    //   _this.setState({
    //     index: _this.state.index + 1,
    //   });
    //   // alert("--" + ev.additionalEvent);
    // });
    hammertime.on("pan", function (ev) {
      //控制台输出
      console.log("哈哈哈--pinch", ev);
      if (ev.isFinal) {
        _this.setState({
          deltaX: 0,
          deltaY: 0,
          left: ev.deltaX + _this.state.left,
          top: ev.deltaY + _this.state.top,
        });
        return;
      }
      _this.setState({
        deltaX: ev.deltaX,
        deltaY: ev.deltaY,
      });

      // alert("--" + ev.additionalEvent);
      console.log("this", _this.state.left, _this.state.top);
    });

    // hammertime.on("panstart", function (ev) {
    //   //控制台输出
    //   console.log("哈哈哈--press", ev);
    //   _this.setState(
    //     {
    //       left: _this.state.left,
    //       top: _this.state.top,
    //     },
    //     () => {
    //       hammertime.on("pan", function (ev) {
    //         //控制台输出
    //         console.log("哈哈哈--pinch", ev);
    //         _this.setState({
    //           left: ev.deltaX + _this.state.left,
    //           top: ev.deltaY + _this.state.top,
    //         });
    //         // alert("--" + ev.additionalEvent);
    //         console.log("this", _this.state.left, _this.state.top);
    //       });
    //     }
    //   );
    // });
    // hammertime.on("pancancel", function (ev) {
    //   //控制台输出
    //   console.log("哈哈哈-pancancel", ev);
    //   // alert("--");
    // });
  }
  render() {
    let { history } = this.props;
    let { isShowNoticeDetail, isShowScheduleList, left, top, deltaX, deltaY } =
      this.state;
    return (
      <div className="select-seat-buy-ticket-box">
        <NavBar
          style={{ backgroundColor: "#fff" }}
          backArrow={true}
          onBack={() => {
            history.goBack();
          }}
        >
          中影国线巨幕影城（花都狮岭店）
        </NavBar>
        <NoticeBar
          content={"来得及弗拉索夫加拉加斯房间里是否就是开了房间的"}
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
                1个通知 <DownOutline />
                {isShowNoticeDetail ? (
                  <div className="notice-bar-content-detail">
                    <h3 className="notice-title">温馨提示：</h3>
                    <div className="detail-content">
                      <div className="content">
                        看来发动机动力开始减肥路看来发动机动力开始减肥路
                      </div>
                    </div>
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
        <div className="seats-box">
          <ul
            className="seat-list"
            style={{ left: left + deltaX + "px", top: top + deltaY + "px" }}
          >
            {/* <li className="row">
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
            </li>
            <li className="row">
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
            </li>
            <li className="row">
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
            </li>
            <li className="row">
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
              <div className="cell">
                <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              </div>
            </li> */}
          </ul>
        </div>

        <div className="bottom-wrapper">
          <div className="seat-template-status">
            <div className="status-item">
              <i className="iconfont icon-bukexuanzuowei- seat no-select-seat"></i>
              <span className="txt">不可选</span>
            </div>
            <div className="status-item">
              <i className="iconfont icon-bukexuanzuowei- seat sale-out-seat"></i>
              <span className="txt">已售</span>
            </div>
            <div className="status-item">
              <i className="iconfont icon-kexuanzuobiankuang seat can-select"></i>
              <span className="txt">可选</span>
            </div>
            <div className="status-item">
              <i className="iconfont icon-yixuanzuowei seat selected-seat"></i>
              <span className="txt">选中</span>
            </div>
          </div>
          <div className="top-box">
            <div className="film-detail">
              <div className="top">
                <h5 className="film-name">电影名称</h5>
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
              <div className="bot">周六11月20日 11:00 国语2D</div>
            </div>
            {isShowScheduleList ? (
              <div className="shedule-wrapper">
                <div className="she-item">
                  <p className="time">11:00</p>
                  <p className="language">国语2D</p>
                  <p className="price">¥45.9</p>
                </div>
              </div>
            ) : null}
            <div className="line"></div>
            <div className="selected-seat-list">
              <div className="seat">
                <div className="left">
                  <p className="seat-txt">12排10座</p>
                  <p className="price">¥36.9</p>
                </div>
                <div className="right">
                  <CloseOutline
                    onClick={() => {
                      console.log("关闭");
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <Button
            style={{
              "--border-radius": 0,
            }}
            className="select-seat-buy-btn"
            block
            color="primary"
            fill="solid"
            size="large"
            disabled={true}
            onClick={() => {
              history.push({
                pathname: "/film/cinema",
                state: {
                  film_id: 234,
                },
              });
            }}
          >
            46元 确认选座
          </Button>
        </div>
      </div>
    );
  }
  handleShowColor(id) {
    switch (id) {
      case "a":
        return "#16B328";
      case "b":
        return "#C213BF";
      case "c":
        return "#F5222D";
      case "d":
        return "#1890FF";
      default:
        return "#ccc";
    }
  }
}

export default SelectSeatBuyTicket;
