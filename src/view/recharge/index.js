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
} from "antd-mobile";
import { GroupCommons } from "@/modules/group/index";
import { CloseOutline, CloseCircleFill } from "antd-mobile-icons";
import { user_recharge, get_user_info } from "@/api/user";

class Recharge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: true,
      rechargePrice: "",
      fontPrice: {
        1: "",
        2: "",
        3: "百",
        4: "千",
        5: "万",
        6: "十万",
        7: "百万",
        8: "千万",
        9: "亿",
        10: "十亿",
        11: "百亿",
      },
      fontPriceIndex: 0,
      submiting: false,
    };
  }
  async getUserInfo() {
    let result = await get_user_info();
    if (result) this.props.login(result, () => {});
  }
  async onGotoRecharge() {
    let { rechargePrice } = this.state;
    if (!rechargePrice)
      return Toast.show({
        // icon: "-",
        duration: 1000,
        content: "请输入充值金额",
      });
    this.setState({
      submiting: true,
    });
    try {
      let result = await user_recharge({
        rechargePrice: Number(rechargePrice),
      });
      console.log("result", result);
      this.setState({
        rechargePrice: "",
        fontPriceIndex: 0,
        submiting: false,
      });
      this.getUserInfo();
    } catch (err) {
      this.setState({
        submiting: false,
      });
    }
  }

  render() {
    let { history } = this.props;
    let { isVisible, rechargePrice, fontPriceIndex, fontPrice, submiting } =
      this.state;
    return (
      <div className="recharge-container">
        <NavBar
          style={{
            "--height": "0.44rem",
            color: "#000",
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
          充值
        </NavBar>
        <div style={{ marginTop: "0.5rem" }}></div>
        <List
          style={{
            "--prefix-width": "6em",
          }}
          mode="card"
        >
          <List.Item title="充值金额">
            <div className="font-price">
              {fontPrice[fontPriceIndex] ? (
                <span>
                  | <span className="font">{fontPrice[fontPriceIndex]}</span>
                </span>
              ) : null}
            </div>
            <div
              className="recharge-price"
              onClick={() => {
                this.setState({
                  isVisible: true,
                });
              }}
            >
              {!isVisible && !rechargePrice ? (
                "请输入金额"
              ) : (
                <span className="price">{rechargePrice}</span>
              )}
              {isVisible ? <div className="focus-bar"></div> : null}

              <CloseCircleFill
                color="var(--adm-color-primary)"
                className="input-close"
                fontSize={20}
                onClick={() => {
                  this.setState({
                    rechargePrice: "",
                    fontPriceIndex: 0,
                  });
                }}
              />
            </div>
          </List.Item>
        </List>

        <Button
          block
          color="primary"
          disabled={submiting}
          size="large"
          className="recharge-button"
          onClick={() => {
            this.onGotoRecharge();
          }}
        >
          充值
        </Button>

        <NumberKeyboard
          visible={isVisible}
          customKey="."
          showCloseButton={true}
          onClose={() => {
            console.log("onClose");
            this.setState({
              isVisible: false,
            });
          }}
          onInput={(val) => {
            let index = rechargePrice.indexOf(".");
            if (
              (val == "." &&
                (index != -1 ||
                  !rechargePrice ||
                  rechargePrice.length == 10)) ||
              rechargePrice.length >= 11
            )
              return;
            if (index != -1) {
              let last_str = rechargePrice.slice(index + 1);
              if (last_str.length >= 2) return;
            }
            this.setState(
              {
                rechargePrice: rechargePrice + val,
              },
              () => {
                this.handleFontPrice();
              }
            );
          }}
          onDelete={(val) => {
            this.setState(
              {
                rechargePrice: rechargePrice
                  ? rechargePrice.substring(0, rechargePrice.length - 1)
                  : "",
              },
              () => {
                this.handleFontPrice();
              }
            );
          }}
          onConfirm={() => {
            this.onGotoRecharge();
          }}
          confirmText="充值"
        />
      </div>
    );
  }
  handleFontPrice() {
    let { rechargePrice } = this.state;
    let index = rechargePrice.indexOf(".");
    if (index != -1) {
      let pre_str = rechargePrice.slice(0, index);
      this.setState({
        fontPriceIndex: pre_str.length,
      });
      return;
    }
    this.setState({
      fontPriceIndex: rechargePrice.length,
    });
  }
}

export default GroupCommons(Recharge);
