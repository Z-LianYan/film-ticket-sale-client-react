import React, { Component } from "react";
import "./index.scss";
import { DownOutline, UpOutline } from "antd-mobile-icons";
class FileDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    let { history } = this.props;
    let { location } = history;
    console.log("props---cinema", location.state);
  }
  render() {
    return (
      <div className="file-detail-container">
        <div
          className="header-wrapper"
          style={{
            backgroundImage:
              "url(https://pic.maizuo.com/usr/movie/e1d72175999c1756a2c80a6de0853b62.jpg?x-oss-process=image/quality,Q_70)",
          }}
        ></div>
        <div className="film-detail">
          <h3 className="film-name">
            演员 <span className="show-type">2D</span>
          </h3>
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
      </div>
    );
  }
}

export default FileDetail;
