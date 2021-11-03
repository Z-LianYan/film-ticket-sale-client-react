import React, { Component } from "react";
import "./index.scss";
import {
  get_banner,
} from "@/api/film";
import _Swiper from "swiper";
import { Swiper } from "antd-mobile";
import "swiper/css/swiper.min.css";
class CustomSwiper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bannerList:[]
    };
  }
  static defaultProps = {
    useSwiperType:'antdMobile'
  }
  async componentDidMount() {
    let { useSwiperType,onClick } = this.props;
    await this.getBanneer();
    if(useSwiperType=='antdMobile') return;
    new _Swiper ('.custom-swiper-container', {
      direction: 'horizontal', // 垂直切换选项
      loop: true, // 循环模式选项
      autoplay : {
        delay: 1500,
        disableOnInteraction: false,
        
      },
      autoplayDisableOnInteraction : true,
      
      // 如果需要分页器
      pagination: {
        el: '.swiper-pagination',
        clickable :true,
      },
      on: {
        click: function (e) {
          console.log('click',this.clickedIndex)
          onClick && onClick();
        },
      },
      
    })        
  }
  async getBanneer() {
    let result = await get_banner();
    this.setState({
      bannerList: result.rows,
    });
    console.log("result--banner", result);
  }
  render() {
    let { bannerList } = this.state;
    let { useSwiperType } = this.props;
    return <div>
      {useSwiperType=='antdMobile'?this.renderAntdMobileSwiper():<div className="swiper-container custom-swiper-container">
        <div className="swiper-wrapper">
          {bannerList.map((item,index)=>{
            return <div className="swiper-slide" key={index}>
              <img
                className="left"
                style={{ width: "100%", height: "100%" }}
                src={item.poster_img}
              />
            </div>
          })}
        </div>
        <div className="swiper-pagination"></div>
      </div>}
    </div>
    
    
  }

  renderAntdMobileSwiper() {
    let { bannerList } = this.state;
    return (
      <Swiper
        indicatorProps={{
          color: "white",
          style: {
            "--dot-color": "#fff",
            "--dot-opcity": "0.4",
            "--active-dot-color": "#ff5f16",
            "--dot-size": "8px",
            "--active-dot-size": "20px",
            "--dot-border-radius": "50%",
            "--active-dot-border-radius": "10px",
            "--dot-spacing": "8px",
          },
        }}
        allowTouchMove={true}
        loop={true}
        autoplay={true}
      >
        {bannerList.map((item, index) => {
          return (
            <Swiper.Item
              key={index}
              onClick={() => {
                console.log("123");
              }}
            >
              <img
                className="left"
                style={{ width: "100%", height: "2.1rem" }}
                src={item.poster_img}
              />
            </Swiper.Item>
          );
        })}
      </Swiper>
    );
  }
}

export default CustomSwiper;
