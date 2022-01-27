import React, { Component, useRef } from "react";
import "./index.scss";
import CinemaListItem from "@/components/CinemaListItem/index";
import {
  LeftOutline,
  InformationCircleOutline,
  MoreOutline,
  MinusOutline,
  DownOutline,
  UpOutline,
  PlayOutline,
} from "antd-mobile-icons";
import {
  InfiniteScroll,
  PullToRefresh,
  NavBar,
  Tabs,
  Input,
  Button,
  List,
  Image,
  Dialog,
  DotLoading,
} from "antd-mobile";
import { GroupCommons } from "@/modules/group";
import { get_order_list } from "@/api/order";
import InfiniteScrollContent from "@/components/InfiniteScrollContent/index";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import CommentItem from "@/components/Comment-item/index";
import {
  get_comment_list,
  thumb_up,
  get_comment_reply_list,
  add_comment_reply,
  del_comment_reply,
} from "@/api/comment";
import CustomSkeleton from "@/components/CustomSkeleton/index";

class CommentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchOptions: {
        page: 0,
        limit: 10,
        // status: "",
        // keywords: "",
        film_id: "",
        city_id: "",
        user_id: "",
      },
      commentlist: [],
      isHasMore: false,
      isSkeleton: true,
      film_name: "",
      // isReplyCommentLoading: false,
      isShowUnfold: true,
      selectReplyItem: null,
    };
  }
  async componentDidMount() {
    let { location, locationInfo } = this.props;
    this.getData();
  }
  getData() {
    this.onRefresh();
  }

  onRefresh() {
    this.setState({
      isHasMore: false, //防止执行 this.props.locationInfo.locationReady方法时 死循环
    });
    this.onRefreshList();
  }
  async onRefreshList() {
    let { fetchOptions } = this.state;
    let { history, match, locationInfo, userInfo, location } = this.props;
    let { params } = match;
    fetchOptions.page = 1;
    this.setState(
      {
        fetchOptions,
      },
      async () => {
        try {
          let result = await get_comment_list({
            ...fetchOptions,
            film_id: location.state && location.state.film_id,
            city_id: locationInfo && locationInfo.city_id,
            user_id: userInfo && userInfo.user_id,
          });
          let status_arr = [{ text: "全部", value: "" }];
          for (let key in result.order_status) {
            status_arr.push({ text: result.order_status[key], value: key });
          }
          this.setState(
            {
              commentlist: result.rows,
              isSkeleton: false,
            },
            () => {
              if (this.state.commentlist.length >= result.count) {
                this.setState({
                  isHasMore: false,
                });
              } else {
                this.setState({
                  isHasMore: true,
                });
              }
            }
          );
        } catch (err) {
          if (err.error == 401) {
            this.props.login(null); //如果token认证过期 清空当前缓存的登录信息
            history.replace({
              pathname: "/",
            });
          }
        }
      }
    );
  }

  async getCommentReplyList(item, comment_id) {
    item.isReplyCommentLoading = true;
    item.page = item.page ? item.page + 1 : 1;
    this.setState({
      commentlist: this.state.commentlist,
    });
    let result = await get_comment_reply_list({
      page: item.page,
      limit: 3,
      comment_id: comment_id,
    });
    item.replyList =
      item.page == 1 ? result.rows : item.replyList.concat(result.rows);
    item.isReplyCommentLoading = false;
    item.isShowUnfold = item.replyList.length >= result.count ? true : false;
    item.isFinalllyPage = item.replyList.length >= result.count ? true : false;
    this.setState({
      commentlist: this.state.commentlist,
    });
    console.log("result", result);
  }

  render() {
    let { location, history, locationInfo, match, userInfo } = this.props;
    let { params } = match;
    let {
      commentlist,
      fetchOptions,
      isHasMore,
      statusData,
      isSkeleton,
      // isReplyCommentLoading,
      // isShowUnfold,
      selectReplyItem,
    } = this.state;
    return (
      <div className="comment-list-container">
        {isSkeleton ? <CustomSkeleton section={5} row={5} /> : null}
        <div className="header-wrapper">
          <NavBar
            backArrow={false}
            left={
              <LeftOutline
                onClick={() => {
                  history.goBack();
                }}
              />
            }
            right={
              userInfo &&
              commentlist.some((item) => item.user_id == userInfo.user_id) && (
                <Button
                  color="success"
                  shape="rounded"
                  type="button"
                  size="small"
                  onClick={() => {
                    let commentData = {};
                    for (let item of commentlist) {
                      if (item.user_id == userInfo.user_id) {
                        commentData = item;
                      }
                    }
                    console.log("23456789", params.film_id, commentData);
                    history.push({
                      pathname: "/comment",
                      state: {
                        film_id: location.state && location.state.film_id,
                        comment_id: commentData.comment_id,
                      },
                    });
                  }}
                >
                  编辑我的讨论
                </Button>
              )
            }
          >
            <div className="comment-title">
              {location.state && location.state.film_name}
            </div>
          </NavBar>
        </div>
        <div style={{ height: "0.5rem" }}></div>
        <div className="comment-tip-wrapper">
          <span>讨论</span>
          <InformationCircleOutline
            onClick={() => {
              Dialog.alert({
                content: (
                  <div className="what-comment-wrapper">
                    <h3
                      style={{
                        textAlign: "center",
                        color: "var(--adm-color-primary)",
                        fontWeight: "bold",
                        marginBottom: "0.1rem",
                      }}
                    >
                      " 什么是讨论 "
                    </h3>
                    <div
                      className="content1"
                      style={{
                        fontSize: "0.14rem",
                        marginBottom: "0.1rem",
                      }}
                    >
                      讨论的观点为大家所观影作品的观点，看法的分享通道。
                    </div>
                    <div
                      className="content2"
                      style={{
                        fontSize: "0.14rem",
                        marginBottom: "0.1rem",
                      }}
                    >
                      讨论区仅展示部分评价，与影片无关的，或包含人身攻击等内容的评价将被折叠，且其评分不计入猫眼评分。
                      对于多次违反社区规则的用户，我们也保留封禁账号的权利。
                    </div>
                    <div
                      className="content3"
                      style={{
                        fontSize: "0.14rem",
                        marginBottom: "0.1rem",
                      }}
                    >
                      设置头像和昵称、认真发布短评，可以增大你的创作被推荐为精选的机率～
                    </div>
                  </div>
                ),
                closeOnMaskClick: true,
              });
            }}
          />
        </div>
        <PullToRefresh
          disabled={false}
          onRefresh={async () => {
            await this.onRefreshList();
          }}
        >
          {commentlist.map((item, index) => {
            return (
              <CommentItem
                key={index}
                nickname={item.nickname}
                scoreText={`给这部作品打了${item.score}分`}
                date={item.date}
                separator={commentlist.length != index + 1}
                avatar={item.avatar}
                actionsOption={[{ text: "举报", key: "jubao" }]}
                commentContent={item.comment_content}
                isShowMineCommentTag={
                  userInfo && userInfo.user_id == item.user_id
                }
                isShowMenuBtn={true}
                onClickJubao={() => {
                  console.log("jubao");
                }}
                onAction={(val) => {
                  console.log("val", val);
                }}
                // isShowUnfoldPackUp={true}
                // showUnfold={false}
                // showPackUp={true}
                onReplyTextBtn={() => {
                  selectReplyItem = {
                    commentListIndex: index,
                    reply_person_nickname: item.nickname,
                    reply_parent_id: 0,
                    reply_content: "",
                    parent_user_id: item.user_id,
                    comment_id: item.comment_id,
                  };
                  this.setState({
                    selectReplyItem,
                  });
                }}
                history={history}
                messageNum={item.reply_count}
                dzNum={item.thumb_up_count}
                alreadyThumbUp={item.already_thumb_up}
                onThumbUp={async () => {
                  let result = await thumb_up({
                    thumb_up_id: item.comment_id,
                    thumb_up_type: "comment",
                  });
                  if (result.type == "add") {
                    item.already_thumb_up = true;
                    item.thumb_up_count += 1;
                  }
                  if (result.type == "reduce") {
                    item.already_thumb_up = false;
                    item.thumb_up_count -= 1;
                  }
                  this.setState({
                    commentlist,
                  });
                }}
                bottomNode={
                  item.reply_count ? (
                    <div className="unfold-reply-btn">
                      {item.isReplyCommentLoading ? (
                        <DotLoading color="#00b578" />
                      ) : (
                        <div>
                          <MinusOutline color="#ccc" />
                          {item.isShowUnfold ? (
                            <span
                              className="btn"
                              onClick={() => {
                                item.isShowUnfold = false;
                                item.isNotShowReplyContent = true;
                                this.setState({
                                  commentlist: commentlist,
                                });
                                console.log(
                                  "item.isFinalllyPage",
                                  item.isFinalllyPage
                                );
                              }}
                            >
                              收起
                              <UpOutline className="icon" />
                            </span>
                          ) : (
                            <span
                              className="btn"
                              onClick={() => {
                                if (item.isFinalllyPage) {
                                  item.isShowUnfold = true;
                                  item.isNotShowReplyContent = false;
                                  this.setState({
                                    commentlist: commentlist,
                                  });
                                  return;
                                }
                                this.getCommentReplyList(item, item.comment_id);
                              }}
                            >
                              展开
                              {item.replyList
                                ? "更多"
                                : item.reply_count + "条"}
                              回复
                              <DownOutline className="icon" />
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ) : null
                }
              >
                {item.replyList &&
                  !item.isNotShowReplyContent &&
                  item.replyList.map((it) => {
                    return (
                      <CommentItem
                        itemPaddingTop={0}
                        itemPaddingRight={0}
                        itemPaddingBottom={0.1}
                        itemPaddingLeft={0}
                        separator={false}
                        key={it.reply_id + "r"}
                        nickname={it.nickname}
                        replyName={it.parent_nickname}
                        date={it.date}
                        avatar={item.avatar}
                        score={item.score}
                        actionsOption={[{ text: "举报", key: "jubao" }]}
                        commentContent={it.reply_content}
                        isShowMenuBtn={true}
                        onClickJubao={() => {
                          console.log("jubao");
                        }}
                        onAction={(val) => {
                          console.log("val", val);
                        }}
                        dzNum={it.thumb_up_count}
                        alreadyThumbUp={it.already_thumb_up}
                        onThumbUp={async () => {
                          let result = await thumb_up({
                            thumb_up_id: it.reply_id,
                            thumb_up_type: "reply",
                          });
                          if (result.type == "add") {
                            it.already_thumb_up = true;
                            it.thumb_up_count += 1;
                          }
                          if (result.type == "reduce") {
                            it.already_thumb_up = false;
                            it.thumb_up_count -= 1;
                          }
                          this.setState({
                            commentlist,
                          });
                        }}
                        history={history}
                        onReplyTextBtn={() => {
                          selectReplyItem = {
                            commentListIndex: index,
                            reply_person_nickname: it.nickname,
                            reply_parent_id: it.reply_id,
                            reply_content: "",
                            parent_user_id: it.user_id,
                            comment_id: item.comment_id,
                          };
                          this.setState({
                            selectReplyItem,
                          });
                        }}
                      />
                    );
                  })}
              </CommentItem>
            );
          })}
          <InfiniteScroll
            threshold="50"
            loadMore={async () => {
              fetchOptions.page += 1;
              this.setState({ fetchOptions });
              let result = await get_comment_list({
                ...fetchOptions,
                film_id: params && params.film_id,
                city_id: locationInfo && locationInfo.city_id,
                user_id: userInfo && userInfo.user_id,
              });
              this.setState({
                commentlist:
                  fetchOptions.page === 1
                    ? result.rows
                    : commentlist.concat(result.rows),
              });
              if (this.state.commentlist.length >= result.count) {
                this.setState({
                  isHasMore: false,
                });
              }
            }}
            hasMore={isHasMore}
          >
            <InfiniteScrollContent
              text={`没有查到相关内容哦！`}
              noContent={!isHasMore && !this.state.commentlist.length}
              hasMore={isHasMore}
            />
          </InfiniteScroll>
          <div style={{ height: "1rem" }}></div>
        </PullToRefresh>

        {selectReplyItem && (
          <div className="reply-input-wrapper">
            <Input
              placeholder={`回复 ${selectReplyItem.reply_person_nickname} :`}
              value={selectReplyItem.reply_content}
              onChange={(val) => {
                console.log("val--", val);
                selectReplyItem.reply_content = val;
                this.setState({
                  selectReplyItem,
                });
              }}
              onEnterPress={async () => {
                console.log("123456", this.state.selectReplyItem);
                let result = await add_comment_reply(
                  this.state.selectReplyItem
                );
                commentlist[
                  this.state.selectReplyItem.commentListIndex
                ].replyList.push(result);
                this.setState({
                  commentlist,
                });
                console.log("result---", result);
              }}
            />
          </div>
        )}
      </div>
    );
  }
  componentWillUnmount = () => {
    this.setState = (state, callback) => {
      return;
    };
  };
}

export default GroupCommons(CommentList);
