import React, { Component } from "react";
import "./index.scss";
import {
  get_banner,
} from "@/api/film";
import Swiper from "swiper";
import "swiper/css/swiper.min.css";
class CustomSwiper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bannerList:[]
    };
  }
  async componentDidMount() {
    await this.getBanneer();
    new Swiper ('.custom-swiper-container', {
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
          // this.slideTo(this.clickedIndex,500)
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
    return <div className="swiper-container custom-swiper-container">
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
    </div>
  }
}

export default CustomSwiper;
