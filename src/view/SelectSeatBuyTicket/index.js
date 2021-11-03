import React, { Component } from "react";
import "./index.scss";
import { NavBar,NoticeBar,Space } from "antd-mobile";
import { DownOutline } from 'antd-mobile-icons'
class SelectSeatBuyTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowNoticeDetail:false
    };
  }
  componentDidMount(){

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
    </div>
  }
}

export default SelectSeatBuyTicket;
