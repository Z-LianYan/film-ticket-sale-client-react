import React, { Component } from "react";
import "./index.scss";
import { Button } from "antd-mobile";

class CInemaListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static defaultProps = {
    title: "",
    label: "",
    value: 0,
    distance: "",
    separator: true,
  };
  render() {
    let { title, label, value, distance, separator } = this.props;
    return (
      <div
        className="cinema-item-wrapper"
        onClick={() => {
          this.props.onClick && this.props.onClick();
        }}
      >
        <div className="cinema-item">
          <div className="left-box">
            <div className="title">{title}</div>
            <div className="label">{label}</div>
          </div>
          <div className="right-box">
            <div className="value">
              <span className="symbol">¥</span>
              {value}
              <span className="qi">起</span>
            </div>
            <strong className="distance">{distance}</strong>
          </div>
        </div>
        {separator ? <div className="line"></div> : null}
      </div>
    );
  }
}
export default CInemaListItem;
