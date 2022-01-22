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
import { get_buy_ticket_detail, pay_order } from "@/api/order";
import CustomSkeleton from "@/components/CustomSkeleton/index";
import dayjs from "dayjs";

class Recharge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSkeleton: true,
      isDownImage: false,
      orderDetail: {},
    };
  }
  componentDidMount() {
    
  }
  
  
  render() {
    let { history } = this.props;
    let { isSkeleton, orderDetail } = this.state;
    
    return (
      <div className="comment-container">
        <NavBar
          style={{
            "--height": "0.44rem",
            fontWeight: "bold",
          }}
          // left={
          //   <i
          //     className="iconfont icon-shouye"
          //     onClick={() => {
          //       history.push("/");
          //     }}
          //     style={{ fontSize: "0.2rem" }}
          //   ></i>
          // }
          onBack={() => {
            history.goBack();
          }}
          right={
            <Button color='primary' shape='rounded' type="button" size="small" onClick={()=>{
              this.onRefresh()
            }}>发布</Button>
          }
        >
            我的评论
            <div>野性的呼唤</div>
        </NavBar>
        <div className="content-container">
          12345
        </div>
      </div>
    );
  }
}

export default GroupCommons(Recharge);
