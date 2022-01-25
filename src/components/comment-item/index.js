import React, { Component } from "react";
import "./index.scss";
import { MoreOutline,MinusOutline,DownOutline,UpOutline,PlayOutline } from "antd-mobile-icons";
import { Button, Tag, Image, Dialog, ActionSheet } from "antd-mobile";
import { GroupCommons } from "@/modules/group";
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
    showThumbUpBtn:true,
    showReplyMessageBtn:false,
    showUnfoldPackUp:false,
    showUnfold:true,
    showPackUp:false,
    itemPaddingTop:0.15,
    itemPaddingRight:0.15,
    itemPaddingBottom:0.1,
    itemPaddingLeft:0.15,
  };
  render() {
    let { isVisibleAction } = this.state;
    let {
      isShowMineCommentTag,//是否显示我的评分tag
      commentContent,//评论内容
      scoreText,//评分
      avatar,//头像
      separator,//分割线
      messageNum,//回复评论数
      dzNum,//点赞数
      date,//评论日期
      isShowMenuBtn,//是否显示菜单按钮
      nickname,//评论人名称
      replyName,//回复人
      actionsOption,//菜单设置项
      onAction,//选中菜单项返回事件
      onThumbUp,//点赞按钮事件
      onReplyMessage,//右边的信息按钮
      userInfo,//用户信息
      history,//路由历史对象
      onReplyTextBtn,//左边回复按钮事件
      children,//插槽
      itemPaddingTop,
      itemPaddingRight,
      itemPaddingBottom,
      itemPaddingLeft,
      showUnfoldPackUp,//是否显示展开收起按钮
      isShowUnfoldPackUp,
      showUnfold,//显示展开
      // showPackUp,//显示收起
    } = this.props;
    // console.log(this.props)
    return (
      <div className="comment-item" style={{padding:`${itemPaddingTop}rem ${itemPaddingRight}rem ${itemPaddingBottom}rem ${itemPaddingLeft}rem`}}>
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
              <div className="nickname">
                <div 
                className="nk" style={{maxWidth:replyName?'calc(100vw - 2.7rem)':''}}>{nickname}</div>
                {replyName&&<div 
                className="rp"> <PlayOutline color='#000' /> {replyName}</div>}
              </div>
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
                  if(userInfo){
                    this.setState({
                      isVisibleAction: true,
                    });
                  }else{
                    history && history.push({
                      pathname: "/login",
                    });
                  }
                }}
              />
            )}
          </div>
          <div className="comment-content">{commentContent}</div>
          <div className="bottom-box">
            <div className="left-date">
              {date} {
                onReplyTextBtn && <span className="reply-text-btn" onClick={()=>{
                  if(userInfo){
                    onReplyTextBtn && onReplyTextBtn();
                  }else{
                    history && history.push({
                      pathname: "/login",
                    });
                  }
                }}>回复</span>
              }
            </div>
            <div className="right-dz-message">
              {
                onThumbUp && <span
                className="dz"
                onClick={() => {
                  if(userInfo){
                    onThumbUp && onThumbUp();
                  }else{
                    history && history.push({
                      pathname: "/login",
                    });
                  }
                }}
              >
                <i className="dz-icon iconfont icon-dianzan"></i>
                {dzNum}
              </span>
              }
              {
                onReplyMessage && <span
                  className="message"
                  onClick={() => {
                    onReplyMessage && onReplyMessage();
                  }}
                >
                  <i className="me-icon iconfont icon-duihuaxinxi"></i>
                  {messageNum}
                </span>
              }
            </div>
          </div>
          <div className="animation-comment-content">
            {
              Array.isArray(children)? children.map(item=>{
                return item
              }):children
            }
          </div>
          
          {
            showUnfoldPackUp && <div className="unfold-reply-btn">
              <MinusOutline color="#ccc"/> {showUnfold?<span 
              className="btn">展开{messageNum}条回复<DownOutline className="icon"/></span>:<span 
              className="btn">收起<UpOutline className="icon"/></span>
            } 
            {/* {showPackUp && <span 
              className="btn" for="check">收起<UpOutline className="icon"/></span>} */}
            </div>
          }
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
export default GroupCommons(CommentItem);
