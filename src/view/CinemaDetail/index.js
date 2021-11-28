import React, { Component } from "react";
import "./index.scss";
import { List, Image, Mask, NavBar, Tag, Tabs } from "antd-mobile";
import { RightOutline, CloseOutline } from "antd-mobile-icons";
import { get_cinema_detail } from "@/api/cinema";

import Swiper from "swiper";
import "swiper/css/swiper.min.css";
function CellItem(obj = {}) {
  return (
    <div className="cell-item-container">
      <div className="left-box">
        <div className="left-item">
          <p>{obj.startTime}</p>
          <p className="bottom">{obj.endTime}散场</p>
        </div>
        <div className="left-item">
          <p>{obj.showType}</p>
          <p className="bottom">{obj.hall}</p>
        </div>
      </div>
      <div className="right-box">
        <div className="price">{obj.price}</div>
        <div
          className="btn"
          onClick={() => {
            obj.onClick && obj.onClick();
          }}
        ></div>
      </div>
    </div>
  );
}
class FileDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowNavBarTitle: false,
      filmList: [
        {
          film_img_url:
            "https://pic.maizuo.com/usr/movie/aa9819a58933cb4797cd0ac568210aff.jpg",
        },
        {
          film_img_url:
            "https://pic.maizuo.com/usr/movie/fe5f0ef6c6cbf8d87f206cbd9835bd96.jpg",
        },
        {
          film_img_url:
            "https://pic.maizuo.com/usr/movie/602506deba12aa489ffc30184dca1b08.jpg",
        },
        {
          film_img_url:
            "https://pic.maizuo.com/usr/movie/94b567a409dbdbab6aaddfe7ee0853dc.jpg",
        },
        {
          film_img_url:
            "https://pic.maizuo.com/usr/movie/f01d1a5b47e2700f337ea738fb1d2754.jpg",
        },
      ],
      activeBgImg: "",
      cinemaDetail: {},
    };
  }
  componentDidMount() {
    let { history } = this.props;
    let { location } = history;
    console.log("props---cinema", location.state);
    window.addEventListener("scroll", (e) => {
      var scrollTop = window.scrollY;
      this.setState({
        isShowNavBarTitle: scrollTop >= 100 ? true : false,
      });
    });
    this.setState({
      activeBgImg: this.state.filmList[0].film_img_url,
    });
    this.newSwiper();
    this.getCinemaDetail();
  }
  async getCinemaDetail() {
    let { history } = this.props;
    let { location } = history;
    let result = await get_cinema_detail({
      cinema_id: location.state.cinema_id,
    });
    console.log("result---", result);
    this.setState({
      cinemaDetail: result.rows,
    });
  }
  newSwiper() {
    let _this = this;
    new Swiper(".swiper-container", {
      direction: "horizontal", // 垂直切换选项
      loop: false, // 循环模式选项
      slidesPerView: 3.5,
      // slidesPerView: "auto",
      spaceBetween: 15,
      centeredSlides: true,
      on: {
        slideChangeTransitionStart: function (e) {
          _this.setState({
            activeBgImg: _this.state.filmList[this.activeIndex].film_img_url,
          });
        },
        click: function (e) {
          this.slideTo(this.clickedIndex, 500);
        },
      },
    });
  }
  renderSwiper() {
    let { filmList, activeBgImg } = this.state;
    return (
      <div className="wrapper-container">
        <div
          className="bg-img"
          style={{
            background: `url(${activeBgImg})`,
          }}
        ></div>
        <div className="swiper-container">
          <div className="swiper-wrapper">
            {filmList.map((item, index) => {
              return (
                <div className="swiper-slide" key={index}>
                  <div className="img-wraper">
                    <img src={item.film_img_url} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bottom-arrow"></div>
      </div>
    );
  }
  render() {
    let { isShowNavBarTitle, cinemaDetail } = this.state;
    let { history } = this.props;
    return (
      <div className="cinema-detail-container">
        <NavBar
          backArrow={true}
          onBack={() => {
            history.goBack();
          }}
        >
          {isShowNavBarTitle ? "电影" : ""}
        </NavBar>
        <div className="header-title">{cinemaDetail.name}</div>
        <div
          className="services-wrapper"
          onClick={() => {
            this.child.open();
          }}
        >
          <div className="tags">
            <Tag className="tag-item" color="#ffb232" fill="outline">
              Primary
            </Tag>
          </div>
          <RightOutline color="#ffb232" />
        </div>
        <div className="location-wrapper">
          <svg
            t="1635787316258"
            className="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2446"
            width="30"
            height="30"
          >
            <path
              d="M512 32c176.448 0 320 151.392 320 337.504 0 60.992-15.616 120.8-45.12 172.896l-247.552 435.936a26.432 26.432 0 0 1-22.688 13.664h-0.192a26.4 26.4 0 0 1-22.656-13.28L239.776 546.976A350.592 350.592 0 0 1 192 369.504C192 183.36 335.552 32 512 32z m219.808 478.272A288.192 288.192 0 0 0 768 370.112C768 219.168 653.12 96 512.096 96S256 219.168 256 370.112c0 50.976 13.536 100.736 38.464 143.872L515.968 896l215.84-385.728zM512 192c88.224 0 160 71.776 160 160 0 86.72-69.504 160-160 160-89.376 0-160-72.32-160-160 0-88.224 71.776-160 160-160z m0.064 256A95.936 95.936 0 0 0 608 352c0-52.768-43.104-96-95.936-96A96.384 96.384 0 0 0 416 352c0 52.896 43.008 96 96.064 96z"
              p-id="2447"
              fill="#cccccc"
            ></path>
          </svg>
          <div className="addr">{cinemaDetail.address}</div>
          <div className="phone-icon">
            <a href={"tel:" + cinemaDetail.phone}>
              <svg
                t="1635787436480"
                className="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="4658"
                width="25"
                height="25"
              >
                <path
                  d="M647.786667 845.397333c-76.053333-24.234667-157.248-76.266667-240.917334-163.648-81.152-84.757333-131.626667-164.864-157.504-238.442666-16.832-47.829333-21.056-85.546667-18.581333-111.402667a50.986667 50.986667 0 0 1 0.384-3.221333l0.341333-3.349334c0.469333-18.112 10.922667-46.144 22.122667-59.264a414.677333 414.677333 0 0 1 34.56-39.466666c9.834667-9.877333 19.306667-18.133333 27.946667-24.192 12.885333-9.045333 21.162667-11.328 23.317333-10.069334-0.213333 0.021333 1.045333 1.322667 2.837333 3.776 3.157333 4.288 7.082667 10.517333 11.669334 18.410667a1030.4 1030.4 0 0 1 31.04 59.264 3473.109333 3473.109333 0 0 1 58.368 126.229333c1.706667 3.84 0.938667 12.309333-1.344 15.722667l-47.04 69.824a27.52 27.52 0 0 0-3.370667 7.424c-7.509333 25.92 12.309333 66.517333 73.834667 129.216 37.504 38.186667 70.293333 63.061333 98.496 77.077333 18.944 9.429333 33.28 12.8 42.730666 12.586667 4.48-0.192 8.256-1.450667 11.52-3.626667l69.546667-46.933333c3.584-2.410667 12.416-3.349333 16.533333-1.685333l8.704 3.477333a3178.794667 3178.794667 0 0 1 91.477334 38.464c7.04 3.114667 13.802667 6.144 20.266666 9.088 21.76 9.962667 39.637333 18.773333 52.629334 25.984 6.784 3.797333 12.074667 7.061333 15.573333 9.642667 1.429333 1.066667 2.432 1.877333 2.901333 2.346666a10.602667 10.602667 0 0 1-2.197333-3.968l1.472 3.2c4.522667 8.064-16.853333 38.122667-51.562667 68.714667a626.624 626.624 0 0 1-20.544 17.344 21.333333 21.333333 0 1 0 26.453334 33.450667 669.056 669.056 0 0 0 22.293333-18.794667c52.48-46.293333 80.661333-85.866667 60.544-121.642667l1.472 3.2c-6.037333-16.64-32.277333-31.274667-91.306667-58.261333-6.613333-3.050667-13.546667-6.144-20.736-9.322667a2876.629333 2876.629333 0 0 0-101.610666-42.538666c-17.109333-6.912-40.874667-4.416-56.234667 5.930666l-69.546667 46.933334 10.922667-3.626667c0.576-0.021333-0.554667-0.149333-2.986667-0.725333a92.693333 92.693333 0 0 1-19.306666-7.424c-23.68-11.776-52.693333-33.792-87.04-68.778667-51.797333-52.757333-65.322667-80.490667-63.317334-87.445333a16.021333 16.021333 0 0 1-1.92 4.074666l46.741334-69.376c10.474667-15.573333 12.586667-39.530667 5.013333-56.725333l-4.138667-9.365333a3937.258667 3937.258667 0 0 0-46.122666-100.202667c-3.029333-6.293333-5.973333-12.416-8.874667-18.304-30.997333-63.082667-48.512-93.290667-64.213333-100.48-18.922667-11.157333-42.261333-4.672-67.456 12.992-10.922667 7.658667-22.186667 17.472-33.642667 28.970667a456.597333 456.597333 0 0 0-37.610667 42.88c-16.853333 19.712-30.805333 57.173333-31.509333 84.906666l0.341333-3.349333c-0.277333 1.493333-0.597333 3.797333-0.896 6.954667-3.050667 31.893333 1.877333 75.818667 20.821334 129.621333 27.946667 79.466667 81.664 164.736 166.912 253.781333 88.490667 92.416 175.765333 148.330667 258.773333 174.805334 27.797333 8.853333 53.888 13.952 77.973333 15.957333a21.333333 21.333333 0 0 0 3.52-42.517333 310.570667 310.570667 0 0 1-68.522666-14.08z"
                  fill="#cccccc"
                  p-id="4659"
                ></path>
              </svg>
            </a>
          </div>
        </div>

        {this.renderSwiper()}
        <div
          className="film-info-wrapper"
          onClick={() => {
            history.push({
              pathname: "/film/detail",
              state: { film_id: 123 },
            });
          }}
        >
          <div className="info">
            <p className="film-name-score">
              入殓师
              <span className="score">
                7.6<span className="unit">分</span>
              </span>
            </p>
            <p className="plot">
              剧情 | 131分钟 |
              离开圣诞节快到了沙发极乐世界弗兰克的世界里睡大觉啦卡拉胶
            </p>
          </div>
          <RightOutline fontSize={15} />
        </div>
        <Tabs defaultActiveKey="fruits">
          <Tabs.Tab title="今天11月2日" key="fruits">
            <CellItem
              startTime={"12:21"}
              endTime={"12:30"}
              showType={"原版3D"}
              hall={"12号厅"}
              price={40}
              onClick={() => {
                console.log("goupiao");
                history.push({
                  pathname: "/buy/ticket",
                  state: {
                    film_id: 1234,
                  },
                });
              }}
            />
          </Tabs.Tab>
          <Tabs.Tab title="今天11月3日" key="vegatables">
            今天11月3日
          </Tabs.Tab>
          <Tabs.Tab title="今天11月4日" key="animals1">
            今天11月4日
          </Tabs.Tab>
        </Tabs>
        <MaskComponent
          onRef={(child) => {
            this.child = child;
          }}
        />
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

class MaskComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleMask: false,
    };
  }
  static defaultProps = {};
  render() {
    let { isVisibleMask } = this.state;
    return (
      <Mask visible={isVisibleMask}>
        <div className="cinema-detail-service-mask-container">
          <div className="header-wrapper">
            <NavBar
              backArrow={<CloseOutline />}
              onBack={() => {
                this.setState({ isVisibleMask: false });
              }}
            />
            <div className="header-title">广州中影火山湖电影城东山口店</div>
          </div>
          <div className="service-default-contianer">
            <ul className="service-default-box">
              <li className="service-item">
                <Tag className="tag" color="#ffb232" fill="outline">
                  Primary
                </Tag>
                <div className="service-content">
                  该影院支持卖座卡前台兑换，您可前往影院服务台，出示卖座卡卡号和密码，凭卡换取纸质电影票，入场观影。
                </div>
              </li>
            </ul>
          </div>
        </div>
      </Mask>
    );
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  open() {
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
