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
    // area: "",
    // time: "",
    bottomText: "",
    separator: true,
    isShowScore: true,
    imgUrl: "",
    btnTxt: "购票",
    btnColor: "primary",
  };
  render() {
    let {
      separator,
      title,
      playType,
      score,
      actors,
      bottomText,
      isShowScore,
      // area,
      // time,
      imgUrl,
      btnTxt,
      btnColor,
    } = this.props;
    return (
      <div
        className="film-list-item-container"
        onClick={() => {
          this.props.onClick && this.props.onClick();
        }}
      >
        <div className="film-list-item">
          <img className="left" src={imgUrl} />
          <div className="middle">
            <p className="title">
              {title}
              <span className="tag">{playType}</span>
            </p>
            {isShowScore ? (
              <p className="score-wrapper">
                观众评分 <span className="score">{score}</span>
              </p>
            ) : null}
            <p
              className="actors"
              style={{
                width: `calc(100vw - ${btnTxt ? 1.58 : 1.16}rem)`,
              }}
            >
              主演：{actors}
            </p>
            <p className="area">
              {bottomText}
              {/* {area}｜{time} */}
            </p>
          </div>
          {btnTxt ? (
            <Button color={btnColor} size="mini" fill="outline">
              {btnTxt}
            </Button>
          ) : null}
        </div>
        {separator ? <div className="line"></div> : null}
      </div>
    );
  }
}
export default FilmListItem;
