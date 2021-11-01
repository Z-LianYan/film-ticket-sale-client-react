import React, { Component } from "react";
import "./index.scss";
import { DownOutline, UpOutline } from "antd-mobile-icons";
import { List, Image, Mask, NavBar, ImageViewer, Tag } from "antd-mobile";
import { RightOutline, EnvironmentOutline, PhoneFill } from "antd-mobile-icons";
import { ColorExtractor } from "react-color-extractor";
import imgJpeg from "@/view/CinemaDetail/img.jpeg";
import { Swiper } from 'swiper/react/swiper';
import { SwiperSlide } from 'swiper/react/swiper-slide';
import 'swiper/swiper-bundle.min.css';
class FileDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowNavBarTitle: false,
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
    // setTimeout(()=>{
    //   var mySwiper = new Swiper ('.swiper-container', {
    //     direction: 'vertical', // 垂直切换选项
    //     loop: true, // 循环模式选项
        
    //     // 如果需要分页器
    //     pagination: {
    //       el: '.swiper-pagination',
    //     },
        
    //     // 如果需要前进后退按钮
    //     navigation: {
    //       nextEl: '.swiper-button-next',
    //       prevEl: '.swiper-button-prev',
    //     },
        
    //     // 如果需要滚动条
    //     scrollbar: {
    //       el: '.swiper-scrollbar',
    //     },
    //   })
    // },4000)
    
  }
  render() {
    let { isShowNavBarTitle } = this.state;
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
        <div className="header-title">广州中影火山湖电影城东山口店</div>
        <div className="services-wrapper">
          <div className="tags">
            <Tag className="tag-item" color="#ffb232" fill="outline">
              Primary
            </Tag>
          </div>
          <RightOutline color="#ffb232" />
        </div>
        <div className="location-wrapper">
          <EnvironmentOutline fontSize={20} />
          <div className="addr">
            广州市海珠区海珠叠景路157—170号（双号）合生广场L5-01/17号单位
          </div>
          <div className="phone-icon">
            <PhoneFill fontSize={20} />
          </div>
        </div>

        <ColorExtractor
          getColors={(colors) => {
            console.log("color-----", colors);
          }}
        >
          <img src={imgJpeg} alt="" />
        </ColorExtractor>

        <Swiper
          spaceBetween={50}
          slidesPerView={3}
          onSlideChange={() => console.log('slide change')}
          onSwiper={(swiper) => console.log(swiper)}
        >
          <SwiperSlide>Slide 1</SwiperSlide>
          <SwiperSlide>Slide 2</SwiperSlide>
          <SwiperSlide>Slide 3</SwiperSlide>
          <SwiperSlide>Slide 4</SwiperSlide>
        </Swiper>


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
