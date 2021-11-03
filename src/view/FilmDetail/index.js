import React, { Component } from "react";
import "./index.scss";
import { DownOutline, UpOutline } from "antd-mobile-icons";
import { List, Image, Mask, NavBar, ImageViewer,Button } from "antd-mobile";
class FileDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleMask: false,
      isShowNavBar: "",
    };
  }
  componentDidMount() {
    let { history } = this.props;
    let { location } = history;
    console.log("props---", location.state);
    window.addEventListener("scroll", (e) => {
      var scrollTop = window.scrollY;
      // console.log("scrollTop", scrollTop);
      this.setState({
        isShowNavBar: scrollTop >= 20 ? true : false,
      });
    });
  }

  renderStill() {
    let { isVisibleMask } = this.state;
    return (
      <Mask visible={isVisibleMask}>
        <div className="still-mask-container">
          <NavBar
            onBack={() => {
              this.setState({ isVisibleMask: false });
            }}
          >
            剧照（5）
          </NavBar>
          <div className="img-box">
            <Image
              className="image"
              src="https://pic.maizuo.com/usr/2021/043db08398739865623b677ef36405d9.jpg?x-oss-process=image/quality,Q_70"
              width="33.33333%"
              height="1.24rem"
              fit="fill"
              onClick={() => {
                ImageViewer.Multi.show({
                  defaultIndex: 0,
                  images: [
                    "https://pic.maizuo.com/usr/2021/043db08398739865623b677ef36405d9.jpg?x-oss-process=image/quality,Q_70",
                    "https://pic.maizuo.com/usr/2021/72f41e416a15292c48aef36099c721ee.jpg?x-oss-process=image/quality,Q_70",
                    "https://pic.maizuo.com/usr/2021/a3eff794a8361970ecafc8f5a27baf89.jpg?x-oss-process=image/quality,Q_70",
                  ],
                });
              }}
            />
          </div>
        </div>
      </Mask>
    );
  }

  render() {
    let { isShowNavBar } = this.state;
    let { history } = this.props;
    return (
      <div className="film-detail-container">
        <NavBar
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            background: isShowNavBar ? "#fff" : "",
            "--height": "0.44rem",
            color: "#000",
          }}
          onBack={() => {
            // this.setState({ isVisibleMask: false });
            history.goBack();
          }}
        >
          {isShowNavBar ? "电影名称" : ""}
        </NavBar>
        <div className="header-wrapper">
          <img
            className="image"
            src="https://pic.maizuo.com/usr/movie/723b7f946f894c63146d6159d57f92a1.jpg@1024h_768w_50Q?x-oss-process=image/quality,Q_70"
            alt=""
          ></img>
        </div>
        <div className="film-detail">
          <div className="film-name-score">
            <h3 className="film-name">
              演员 <span className="show-type">2D</span>
            </h3>
            <span className="score-val">
              7.6<span className="score">分</span>
            </span>
          </div>

          <div className="record-film">纪录片</div>
          <div className="show-date"> 2021-10-30上映 </div>
          <div className="area-and-play-time">中国大陆 | 93分钟</div>
          <div className="abstract">
            <input id="label-input" className="label-input" type="checkbox" />
            <p className="text">
              <label className="label" htmlFor="label-input">
                <DownOutline className="down-out-line" />
                <UpOutline className="up-out-line" />
              </label>
              《演员》是中国首部探讨演员德艺的电影。影片以“新中国二十二大电影明星”为切入点，历时五年、以多重形式进行记录，讲述于蓝、秦怡、田华、于洋、王晓棠、金迪、谢芳、祝希娟、牛犇等老一辈艺术家的从影经历和艺术成就，挖掘他们对于演员这一职业超过半个世纪的感悟和思考，并以他们塑造的经典电影形象向百年中国电影致敬。
            </p>
          </div>
        </div>
        <div className="separator"></div>
        <List.Item
          style={{
            "--adm-border-color": "transparent",
          }}
        >
          演员
        </List.Item>
        <div className="actors-wrapper">
          <div className="actor-item">
            <Image
              src="https://pic.maizuo.com/usr/movie/34f3660dc618fc7d420b9997a8f6c377.jpg?x-oss-process=image/quality,Q_70"
              width="100%"
              height="1rem"
              fit="fill"
            />
            <p className="name">名字</p>
            <p className="role">角色繁花似锦看到哈开会</p>
          </div>
        </div>
        <div className="separator"></div>
        <List.Item
          style={{
            "--adm-border-color": "transparent",
          }}
          extra={"全部(5)"}
          onClick={() => {
            this.setState({ isVisibleMask: true });
            console.log("剧照");
          }}
        >
          剧照
        </List.Item>
        <div className="actors-wrapper">
          <div className="actor-item still">
            <img
              className="image"
              src="https://pic.maizuo.com/usr/movie/34f3660dc618fc7d420b9997a8f6c377.jpg?x-oss-process=image/quality,Q_70"
              alt=""
            />
          </div>
          <div className="actor-item still">
            <img
              className="image"
              src="https://pic.maizuo.com/usr/2021/043db08398739865623b677ef36405d9.jpg?x-oss-process=image/quality,Q_70"
              alt=""
            />
          </div>
        </div>
        {this.renderStill()}
        <Button 
        style={{
          '--border-radius':0
        }}
        className="select-seat-buy-btn"  
        block 
        color='primary' 
        fill="solid" 
        size="large"
        onClick={()=>{
          history.push({
            pathname:'/film/cinema',
            state:{
              film_id:234
            }
          })
        }}>
          选座购票
        </Button>
      </div>
    );
  }
  componentWillUnmount = () => {
    this.setState = (state, callback) => {
      return;
    };
  };
}

export default FileDetail;
