import React, { Component } from "react";
import "./index.scss";
import { Button } from "antd-mobile";

// import { NavLink } from "react-router-dom";

class FilmListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static defaultProps = {
    title: "",
    playType: "",
    score: 0,
    actors: "",
    area: "",
    time: "",
    separator: true,
    imgUrl: "",
  };
  render() {
    let { separator, title, playType, score, actors, area, time, imgUrl } =
      this.props;
    return (
      <div className="film-list-item-container">
        <div className="film-list-item">
          <img className="left" src={imgUrl} />
          <div className="middle">
            <p className="title">
              {title}
              <span className="tag">{playType}</span>
            </p>
            <p className="score-wrapper">
              观众评分 <span className="score">{score}</span>
            </p>
            <p className="actors">主演：{actors}</p>
            <p className="area">
              {area}｜{time}
            </p>
          </div>
          <Button color="primary" size="mini" fill="outline">
            购票
          </Button>
        </div>
        {separator ? <div className="line"></div> : null}
      </div>
    );
  }
}
export default FilmListItem;
