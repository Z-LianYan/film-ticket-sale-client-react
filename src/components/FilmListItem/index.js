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
                width: `calc(100vw - ${btnTxt ? 1.73 : 1}rem)`,
              }}
            >
              主演：{actors}
            </p>
            <p 
            className="area"
            style={{
              width: `calc(100vw - ${btnTxt ? 1.73 : 1}rem)`,
            }}
            >
              {bottomText}
            </p>
          </div>
          {btnTxt ? (
            <Button
              color={btnColor}
              size="mini"
              className="btn"
              fill="outline"
              onClick={(e) => {
                this.props.onRightClick && this.props.onRightClick();
                e.stopPropagation && e.stopPropagation();
                e.cancelBubble = true;
                // window.event
                //   ? (window.event.cancelBubble = true)
                //   : e.stopPropagation();
              }}
            >
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
