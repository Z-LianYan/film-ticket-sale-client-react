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
import QRCode from "qrcode.react";
import domToImage from "dom-to-image";
import { saveAs } from "file-saver";

class Recharge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDownImage: false,
    };
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
      console.log("url", blob);
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
  render() {
    let { history } = this.props;
    let {} = this.state;
    return (
      <div className="order-detail-container">
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
          29分钟后开场
        </NavBar>
        <div className="content-container">
          <div className="header-content">
            <div className="head-top">
              <div className="cinema-name">嘉应国际影城（好的方式分）</div>
              <RightOutline style={{ margin: "0 0.1rem" }} fontSize={20} />|
              <EnvironmentOutline
                style={{ margin: "0 0.1rem" }}
                fontSize={20}
              />
              <PhoneFill style={{ margin: "0 0.1rem" }} fontSize={20} />
            </div>
            <div className="content-wrapper">
              <div className="content" id="film-ticket">
                <div className="top-half-circle"></div>
                <div className="top-wrapper">
                  <div className="top">
                    <div className="left">
                      <h3 className="film-name">误杀</h3>
                      <p>国语2D 2张</p>
                    </div>
                    <Image
                      src={
                        "https://images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80"
                      }
                      className="img"
                      width={75}
                      height={90}
                      fit="fill"
                    />
                  </div>
                  <div className="bot">
                    <div className="date-hall">
                      <span className="date">今天 12-19</span>
                      <span>今天 12-19</span>
                    </div>
                    <div className="time-seat">
                      <span className="time">16:40～19:50</span>
                      <span className="seat">
                        <span className="seat-item">9排11座</span> |
                        <span className="seat-item">9排11座</span>
                      </span>
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
                    <QRCode
                      id="qrCode"
                      value={"1234"} // value参数为生成二维码的链接
                      size={150} // 二维码的宽高尺寸
                      fgColor="#000000" // 二维码的颜色
                    />
                  </div>
                  <div className="verify-code">
                    验证码：
                    <span className="code-num">2022 0120 4587 4286</span>
                  </div>
                </div>
              </div>
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GroupCommons(Recharge);
