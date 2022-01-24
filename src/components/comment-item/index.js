import React, { Component } from "react";
import "./index.scss";
import { MoreOutline } from "antd-mobile-icons";
import { Button, Tag, Image, Dialog, ActionSheet } from "antd-mobile";

class CommentItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleAction: false,
    };
  }
  static defaultProps = {
    date: "",
    dzNum: "",
    messageNum: "",
    avatar: "",
    scoreText: "",
    separator: true,
    isShowMineCommentTag: false,
    commentContent: "",
  };
  render() {
    let { isVisibleAction } = this.state;
    let {
      isShowMineCommentTag,
      commentContent,
      scoreText,
      avatar,
      separator,
      messageNum,
      dzNum,
      date,
      isShowMenuBtn,
      nickname,
      actionsOption,
      onAction,
      onThumbUp,
      onReplyMessage,
    } = this.props;
    return (
      <div className="comment-item">
        <div className="left-wrapper">
          {avatar ? (
            <Image className="avatar" src={avatar} fit="cover" />
          ) : (
            <svg
              t="1635787436480"
              className="avatar"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="4658"
              width="70"
              height="70"
            >
              <path
                d="M1021.92 515.28a506.32 506.32 0 0 1-91.92 291.76c-3.44 4.96-7.04 9.84-10.72 14.64-8.56 11.36-17.68 22.4-27.12 32.96a507.28 507.28 0 0 1-349.52 168.56l-13.92 0.56h-31.04a506.64 506.64 0 0 1-365.44-171.44q-13.44-15.12-25.6-31.36c-3.84-5.04-7.52-10.08-11.12-15.28a508.72 508.72 0 1 1 926.4-290.4z"
                fill="#C0C0C0"
                p-id="9284"
              ></path>
              <path
                d="M724.48 720a305.92 305.92 0 0 1-205.92 81.28c-81.28 0-152-32.56-211.36-81.28-64.88 33.68-135.52 83.12-174.96 132.64A506.64 506.64 0 0 0 497.68 1024h31.04l13.92-0.56a507.28 507.28 0 0 0 349.52-168.56c-38.72-48.64-106.08-99.28-167.68-134.88z"
                fill="#FFFFFF"
                p-id="9285"
              ></path>
              <path
                d="M513.12 237.36c-135.44 0-243.84 113.76-243.84 249.28C269.28 627.6 383.04 736 513.12 736c135.52 0 243.84-113.84 243.84-249.28S648.64 237.36 513.12 237.36z"
                fill="#FFFFFF"
                p-id="9286"
              ></path>
            </svg>
          )}
        </div>
        <div className="right-wrapper">
          <div className="head">
            <div className="nickname-score">
              <p className="nickname">{nickname}</p>
              <p className="score-box">
                {isShowMineCommentTag && (
                  <Tag
                    className="tag-item"
                    color="primary"
                    round
                    fill="outline"
                  >
                    我的评价
                  </Tag>
                )}
                {scoreText && <span>{scoreText}</span>}
              </p>
            </div>
            {isShowMenuBtn && (
              <MoreOutline
                className="menu"
                onClick={() => {
                  this.setState({
                    isVisibleAction: true,
                  });
                }}
              />
            )}
          </div>
          <div className="comment-content">{commentContent}</div>
          <div className="bottom-box">
            <div className="left-date">{date}</div>
            <div className="right-dz-message">
              <span
                className="dz"
                onClick={() => {
                  onThumbUp && onThumbUp();
                }}
              >
                <i className="dz-icon iconfont icon-dianzan"></i>
                {dzNum}
              </span>
              <span
                className="message"
                onClick={() => {
                  onReplyMessage && onReplyMessage();
                }}
              >
                <i className="me-icon iconfont icon-duihuaxinxi"></i>
                {messageNum}
              </span>
            </div>
          </div>

          {separator ? <div className="line"></div> : null}
        </div>
        <ActionSheet
          extra=""
          cancelText="取消"
          visible={isVisibleAction}
          actions={actionsOption}
          closeOnAction
          onAction={(action) => {
            onAction && onAction(action);
          }}
          onClose={() => {
            this.setState({
              isVisibleAction: false,
            });
          }}
        />
      </div>
    );
  }
}
export default CommentItem;
