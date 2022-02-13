import React, { Component } from "react";
import "./index.scss";
import {
  Rate,
  ProgressBar
} from "antd-mobile";
import {
  DownOutline,
  RightOutline
} from "antd-mobile-icons";
class ProgressBarAndRateScore extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { detail,history } = this.props;
    return <div className='progress-bar-and-rate-bar' style={{...this.props.style}}>
    <div className="progress-bar-wrapper">
      <div className="pro-left">
        <i className="iconfont icon-rentitezheng-daiyanjing-L daiyanjing-icon"></i>
        <p className="koubei">口碑</p>
      </div>
      <div className="pro-right">
        {
          detail.score_subsection && detail.score_subsection.map(item=>{
            return <div className="pro-bar-item">
            <p className='score-scope'>{
              item.label
            }</p>
            <div className="pro-bar">
              <ProgressBar percent={item.percent} style={{
                '--fill-color':'var(--adm-color-warning)'
              }}/>
            </div>
            
            <p className="score-pro">{item.percent}%</p>
          </div>
          })
        }
      </div>
    </div>
    <div className="rate-bar-wrapper" onClick={() => {
      history.push({
        pathname: "/commentList",
        state: {
          film_id: detail.id,
          film_name: detail.film_name,
        },
      });
    }}>
      <p className="pingfen">评分</p>
      <div className="rate-score">
        9.6分<Rate
          className="star"
          value={9}
          style={{
            "--star-size": "0.12rem",
            marginLeft: "0.02rem",
            color: "var(--adm-color-warning)",
            "--active-color": "var(--adm-color-warning)",
          }}
          allowHalf
          readOnly
        />
      </div>
      <p className="pingfen-num">
       8765人 <RightOutline/>
      </p>
      
    </div>
  </div>;
  }
}

export default ProgressBarAndRateScore;
