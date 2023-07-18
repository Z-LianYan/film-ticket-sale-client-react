import React, { Component } from "react";
import "./index.scss";
import { Loading } from "antd-mobile";
class InfiniteScrollContent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static defaultProps = {
    hasMore: true,
    noContent: true,
    text: "暂无内容哦",
  };
  render() {
    let { hasMore, noContent, text } = this.props;
    return (
      <div className="infinite-scroll-content">
        {hasMore ? (
          <div>
            <span>Loading</span>
            <Loading />
          </div>
        ) : (
          <div>
            {noContent ? (
              <div className="no-content-text">{text}</div>
            ) : (
              <span style={{fontSize: "0.12rem"}}>- 我是有底线的 -</span>
            )}
          </div>
        )}
      </div>
    );
  }
}
export default InfiniteScrollContent;
