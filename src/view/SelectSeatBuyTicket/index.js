import React, { Component } from "react";
import "./index.scss";
import { NavBar,NoticeBar,Space } from "antd-mobile";
import { DownOutline } from 'antd-mobile-icons'
import hammerjs from 'hammerjs'
class SelectSeatBuyTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowNoticeDetail:false
    };
  }
  componentDidMount(){
    //创建一个新的hammer对象并且在初始化时指定要处理的dom元素
    var hammertime = new hammerjs(document.querySelector(".seats-box"));
    hammertime.get('pinch').set({ enable: true });
    hammertime.get('rotate').set({ enable: true });
    //为该dom元素指定触屏移动事件
    hammertime.on("pan", function (ev) {
        //控制台输出
        console.log('哈哈哈',ev);
        // alert('--')
    });
  }
  render() {
    let { history } = this.props;
    let { isShowNoticeDetail } = this.state;
    return <div className="select-seat-buy-ticket-box">
      <NavBar
        backArrow={true}
        onBack={() => {
          history.goBack();
        }}
      >
        中影国线巨幕影城（花都狮岭店）
      </NavBar>
      <NoticeBar 
      content={'来得及弗拉索夫加拉加斯房间里是否就是开了房间的'} 
      color='alert' 
      extra={
        <Space>
          <span onClick={()=>{
            this.setState({
              isShowNoticeDetail:!this.state.isShowNoticeDetail
            })
          }}>
            1个通知 <DownOutline/>
            {
            isShowNoticeDetail? <div className="notice-bar-content-detail">
                <h3 className="notice-title">温馨提示：</h3>
                <div className="detail-content">
                  <div className="content">看来发动机动力开始减肥路看来发动机动力开始减肥路</div>
                </div>
              </div>:null
            }
          </span>
          
        </Space>
      }
      style={{
        "--text-color":'#e68e1a',
        position:'relative'
      }}/>
      <div className='seats-box'>
        <div className="box">
          <div className="wrapper">
            12345健康大煞风景的拉萨附近数量大幅减少到了福建省劳动法律的房间里都是减肥路上的肌肤立刻删掉
          </div>
        </div>
      </div>

    </div>
  }
}

export default SelectSeatBuyTicket;
