import React, { Component } from "react";
import "./index.scss";
import {
  DownOutline,
  UpOutline,
  RightOutline,
  LeftOutline,
  InformationCircleOutline,
  MoreOutline,
  MinusOutline,
  PlayOutline,
  StarFill,
  HeartFill,
} from "antd-mobile-icons";
import {
  List,
  Image,
  Mask,
  NavBar,
  ImageViewer,
  Button,
  DotLoading,
  Input,
  Popup,
  Dialog,
  TextArea,
  Rate,
  ProgressBar,
} from "antd-mobile";
import { get_film_detail, add_cancel_want_see } from "@/api/film";
import dayjs from "dayjs";
import { GroupCommons } from "@/modules/group";
import CommentItem from "@/components/Comment-item/index";
import {
  get_comment_list,
  thumb_up,
  get_comment_reply_list,
  add_comment_reply,
  del_comment_reply,
  del_comment,
  comment_jubao,
} from "@/api/comment";
import _lodash from "lodash";
import ProgressBarAndRateScore from "@/view/FilmDetail/ProgressBarAndRateScore/index";
class FileDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleMask: false,
      isShowNavBar: "",
      detail: {},
      isSkeleton: true,
      commentlist: [],
      commentTotalCount: 0,
      selectReplyItem: null,
    };
  }
  async getcommentlist() {
    let { locationInfo, match, userInfo } = this.props;
    let { params } = match;
    let result = await get_comment_list({
      page: 1,
      limit: 3,
      film_id: params && params.film_id,
      city_id: locationInfo && locationInfo.city_id,
      user_id: userInfo && userInfo.user_id,
    });
    this.setState({
      commentlist: result.rows,
      commentTotalCount: result.count,
    });
  }
  componentDidMount() {
    window.addEventListener("scroll", (e) => {
      var scrollTop = window.scrollY;
      this.setState({
        isShowNavBar: scrollTop >= 20 ? true : false,
      });
    });
    this.getFilmDetail();
    this.getcommentlist();
  }
  async getFilmDetail() {
    let { history, locationInfo, match } = this.props;
    let { params } = match;
    let result = await get_film_detail({
      film_id: params && params.film_id,
      city_id: locationInfo && locationInfo.city_id,
    });
    this.setState({
      detail: result,
      isSkeleton: false,
    });
  }

  renderStill() {
    let { isVisibleMask, detail } = this.state;
    return (
      <Mask visible={isVisibleMask}>
        <div className="still-mask-container">
          <NavBar
            onBack={() => {
              this.setState({ isVisibleMask: false });
            }}
          >
            剧照（{detail.stage_photo && detail.stage_photo.length}）
          </NavBar>
          <div className="img-list">
            {detail && detail.stage_photo
              ? detail.stage_photo.map((item, index) => {
                  return (
                    <div className="img-item" key={index}>
                      <div className="img-wrapper">
                        <img
                          className="image"
                          src={item}
                          onClick={() => {
                            ImageViewer.Multi.show({
                              defaultIndex: index,
                              images: detail.stage_photo,
                            });
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      </Mask>
    );
  }

  async onDel(item, it, type, index) {
    let { commentlist, commentTotalCount } = this.state;
    let { history } = this.props;
    const result = await Dialog.confirm({
      confirmText: "确定",
      content: "您确定删除吗？",
    });
    if (!result) return;
    try {
      if (type == "comment") {
        let result = await del_comment({
          comment_id: item.comment_id,
        });
        commentlist.splice(index, 1);
        commentTotalCount -= 1;
        // this.getcommentlist();
        this.setState({
          commentlist,
          commentTotalCount,
        });
        this.getFilmDetail();
        console.log("删除评论", result);
      }
      if (type == "reply") {
        console.log("reply", type, item);
        let result = await del_comment_reply({
          reply_id: it.reply_id,
        });
        item.replyList.splice(index, 1);
        item.backup_reply_list.splice(index, 1);
        item.reply_count -= 1;
        this.setState({
          commentlist,
        });
        console.log("删除回复", result);
      }
    } catch (err) {
      if (err.error == 401) {
        this.props.login(null); //如果token认证过期 清空当前缓存的登录信息
        history.push({
          pathname: "/login",
        });
      }
    }
  }
  async onJubao(report_id, type, comment_id) {
    //举报
    let { history } = this.props;
    const result = await Dialog.confirm({
      confirmText: "确定",
      content: "您确定举报吗？",
    });
    if (!result) return;
    try {
      await comment_jubao({
        report_id: report_id,
        report_type: type,
        comment_id: comment_id,
      });
    } catch (err) {
      if (err.error == 401) {
        this.props.login(null); //如果token认证过期 清空当前缓存的登录信息
        history.push({
          pathname: "/login",
        });
      }
    }
  }

  async getCommentReplyList(item) {
    item.isReplyCommentLoading = true;
    item.page = item.page ? item.page + 1 : 1;
    this.setState({
      commentlist: this.state.commentlist,
    });
    let result = await get_comment_reply_list({
      page: item.page,
      limit: 3,
      comment_id: item.comment_id,
    });
    if (item.replyList) {
      for (let it of item.replyList) {
        for (let i = 0; i < result.rows.length; i++) {
          if (it.reply_id == result.rows[i].reply_id) {
            result.rows.splice(i, 1);
          }
        }
      }
    } else {
      item.replyList = [];
    }

    item.replyList = item.replyList.concat(result.rows);
    item.backup_reply_list = _lodash.cloneDeep(item.replyList);
    item.isReplyCommentLoading = false;
    item.isShowUnfold = item.replyList.length >= result.count ? true : false;
    item.isFinalllyPage = item.replyList.length >= result.count ? true : false;
    this.setState({
      commentlist: this.state.commentlist,
    });
  }

  render() {
    let {
      isShowNavBar,
      detail,
      isSkeleton,
      commentlist,
      commentTotalCount,
      selectReplyItem,
    } = this.state;
    let { history, location, userInfo, rateLevelTex } = this.props;
    return (
      <div className="film-detail-container">
        {isSkeleton ? <div className="skeleton-box"></div> : null}
        <NavBar
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            background: isShowNavBar ? "#fff" : "",
            "--height": "0.44rem",
            color: "#000",
          }}
          onBack={() => {
            history.goBack();
          }}
        >
          {isShowNavBar ? detail.film_name : ""}
        </NavBar>
        <div className="header-wrapper">
          <div
            className="blur-bg"
            style={{
              background: `url(${detail.poster_img})`,
            }}
          ></div>
          <div className="header-content">
            <div className="film-detail">
              <img className="image" src={detail.poster_img} alt=""></img>
              <div className="right-content">
                <div className="film-name">{detail.film_name}</div>
                <div className="cate-film">
                  {detail.category_names}
                  <span className="play-type-name">
                    {detail.play_type_name}
                  </span>
                </div>
                <div className="play-area">
                  {detail.area} | {detail.runtime}分钟
                </div>
                <div className="show-date">
                  {dayjs(detail.show_time).format("YYYY年MM月DD日")}
                  {detail.area}上映
                </div>
                <div className="want-see">
                  <span className="num">{detail.want_see_num}</span>人想看
                </div>
              </div>
            </div>
            <ProgressBarAndRateScore 
            style={{marginTop:'0.2rem'}} 
            detail={detail} 
            history={history}/>
            {detail.user_already_comment ? (
              <div className="write-comment">
                <div className="left-box">
                  <i className="iconfont icon-rentitezheng-daiyanjing-L daiyanjing-icon"></i>
                  看过啦,
                  {!detail.user_comment_del ? (
                    <span>
                      {rateLevelTex[detail.rate_score] + "！我评 "}
                      <span
                        style={{
                          color: "var(--adm-color-warning)",
                        }}
                      >
                        {detail.rate_score} 分
                      </span>
                    </span>
                  ) : (
                    "快来打个分吧"
                  )}
                  <Rate
                    className="star"
                    value={
                      detail.user_already_comment && !detail.user_comment_del
                        ? detail.rate_score / 2
                        : 0
                    }
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
                <div className="right-btn">
                  {detail.user_already_comment &&
                  !detail.user_comment_del ? null : (
                    <Button
                      color="primary"
                      size="mini"
                      onClick={() => {
                        if (!userInfo) {
                          history.push({
                            pathname: "/login",
                          });
                          return;
                        }
                        history.push({
                          pathname: "/comment",
                          state: {
                            film_id: detail.id,
                          },
                        });
                      }}
                    >
                      去评分
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="thumb-up-write-comment">
                <div
                  className="thumb-up-write-comment-btn thumb-up-btn"
                  onClick={async () => {
                    if (!userInfo) {
                      history.push({
                        pathname: "/login",
                      });
                      return;
                    }
                    let result = await add_cancel_want_see({
                      film_id: detail.id,
                      user_id: userInfo.user_id,
                    });
                    detail.want_see_num = result.count;
                    detail.user_already_click_want_see =
                      !detail.user_already_click_want_see;
                    this.setState({
                      detail,
                    });
                  }}
                >
                  <HeartFill
                    className="left-icon"
                    color={
                      detail.user_already_click_want_see
                        ? "var(--adm-color-primary)"
                        : ""
                    }
                  />
                  想看
                </div>
                <div
                  className="thumb-up-write-comment-btn write-comment-btn"
                  onClick={() => {
                    if (!userInfo) {
                      history.push({
                        pathname: "/login",
                      });
                      return;
                    }
                    history.push({
                      pathname: "/comment",
                      state: {
                        film_id: detail.id,
                      },
                    });
                  }}
                >
                  <StarFill className="left-icon" />
                  看过
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="abstract-detail">
          <div className="abstract">
            <input id="label-input" className="label-input" type="checkbox" />
            <p className="text">
              <label className="label" htmlFor="label-input">
                <DownOutline className="down-out-line" />
                <UpOutline className="up-out-line" />
              </label>
              {detail.abstract}
            </p>
          </div>
        </div>
        <div className="separator"></div>
        <List.Item
          style={{
            "--adm-border-color": "transparent",
            paddingLeft: "0.12rem",
          }}
        >
          演职人员
        </List.Item>
        <div className="actors-wrapper">
          {detail && detail.actors
            ? detail.actors.map((item, index) => {
                return (
                  <div key={index} className="actor-item">
                    <img className="img" src={item.avatar} />
                    <p className="name">{item.name}</p>
                    <p className="role">{item.role}</p>
                  </div>
                );
              })
            : null}
        </div>
        <div className="separator"></div>
        <List.Item
          style={{
            "--adm-border-color": "transparent",
            paddingLeft: "0.12rem",
            fontSize: "0.16rem",
          }}
          extra={
            <div style={{ marginTop: "0.13rem" }}>{`全部(${
              detail.stage_photo ? detail.stage_photo.length : 0
            })`}</div>
          }
          onClick={() => {
            this.setState({ isVisibleMask: true });
          }}
        >
          剧照
        </List.Item>
        <div className="still-wrapper">
          {detail.stage_photo
            ? detail.stage_photo.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="still-item"
                    onClick={() => {
                      ImageViewer.Multi.show({
                        defaultIndex: index,
                        images: detail.stage_photo,
                      });
                    }}
                  >
                    <div className="photo-wrapper">
                      <img className="photo" src={item} alt="" />
                    </div>
                  </div>
                );
              })
            : null}
        </div>
        {this.renderStill()}
        <div className="separator"></div>
        {commentlist.length ? (
          <div>
            <List style={{ background: "transparent" }}>
              <List.Item
                style={{ background: "transparent" }}
                extra={
                  userInfo &&
                  commentlist.some(
                    (item) => item.user_id == userInfo.user_id
                  ) && (
                    <div
                      className="edit-mine-comment-btn"
                      onClick={() => {
                        let commentData = {};
                        for (let item of commentlist) {
                          if (item.user_id == userInfo.user_id) {
                            commentData = item;
                          }
                        }
                        history.push({
                          pathname: "/comment",
                          state: {
                            film_id: detail.id,
                            comment_id: commentData.comment_id,
                          },
                        });
                      }}
                    >
                      编辑我的讨论
                    </div>
                  )
                }
              >
                讨论
              </List.Item>
            </List>
            {commentlist.map((item, index) => {
              let actionsOptionComment = [{ text: "举报", key: "jubao" }];
              if (userInfo && userInfo.user_id == item.user_id) {
                actionsOptionComment.push({
                  text: "删除",
                  key: "del",
                });
              }
              return (
                <CommentItem
                  key={index}
                  nickname={item.nickname}
                  scoreText={`给这部作品打了${item.score}分`}
                  date={this.handleDate(item.date)}
                  separator={commentlist.length != index + 1}
                  avatar={item.avatar}
                  score={item.score}
                  actionsOption={actionsOptionComment}
                  onAction={(val) => {
                    if (val.key == "del") {
                      this.onDel(item, null, "comment", index);
                    }
                    if (val.key == "jubao") {
                      this.onJubao(item.comment_id, "comment", item.comment_id);
                    }
                  }}
                  commentContent={item.comment_content}
                  isShowMineCommentTag={
                    userInfo && userInfo.user_id == item.user_id
                  }
                  onReplyTextBtn={() => {
                    selectReplyItem = {
                      commentlistIndex: index,
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
                  isShowMenuBtn={true}
                  // messageNum={785}
                  dzNum={item.thumb_up_count}
                  alreadyThumbUp={item.already_thumb_up}
                  onThumbUp={async () => {
                    try {
                      let result = await thumb_up({
                        thumb_up_id: item.comment_id,
                        comment_id: item.comment_id,
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
                    } catch (err) {
                      if (err.error == 401) {
                        this.props.login(null); //如果token认证过期 清空当前缓存的登录信息
                        history.push({
                          pathname: "/login",
                        });
                      }
                    }
                  }}
                  history={history}
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
                                  item.sliceIndex = 0; //收起时sliceIndex 要 设为0；
                                  item.replyList = [];
                                  this.setState({
                                    commentlist: commentlist,
                                  });
                                }}
                              >
                                收起
                                <UpOutline className="icon" />
                              </span>
                            ) : (
                              <span
                                className="btn"
                                onClick={() => {
                                  if (
                                    item.replyList &&
                                    item.replyList.length <
                                      item.backup_reply_list.length
                                  ) {
                                    item.sliceIndex = item.sliceIndex
                                      ? item.sliceIndex
                                      : 0;
                                    let arr = item.backup_reply_list.slice(
                                      item.sliceIndex,
                                      item.sliceIndex + 3
                                    );
                                    item.sliceIndex += 3;
                                    let _arr = [];
                                    for (let i = 0; i < arr.length; i++) {
                                      let flag = false;
                                      for (let it of item.replyList) {
                                        if (arr[i].reply_id == it.reply_id) {
                                          flag = true;
                                        }
                                      }
                                      if (!flag) _arr.push(arr[i]);
                                    }
                                    item.replyList =
                                      item.replyList.concat(_arr);
                                    if (
                                      item.replyList.length ==
                                      item.backup_reply_list.length
                                    ) {
                                      item.isShowUnfold = true;
                                      item.backup_reply_list =
                                        _lodash.cloneDeep(item.replyList);
                                    }
                                    this.setState({
                                      commentlist: commentlist,
                                    });
                                    return;
                                  }
                                  if (item.isFinalllyPage) {
                                    item.isShowUnfold = true;
                                    this.setState({
                                      commentlist: commentlist,
                                    });
                                    return;
                                  }
                                  this.getCommentReplyList(item);
                                }}
                              >
                                展开
                                {!item.replyList ||
                                (item.replyList &&
                                  !item.replyList.length &&
                                  item.backup_reply_list)
                                  ? item.reply_count + "条"
                                  : "更多"}
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
                    item.replyList.map((it, idx) => {
                      let actionsOptionReply = [{ text: "举报", key: "jubao" }];
                      if (userInfo && userInfo.user_id == it.user_id) {
                        actionsOptionReply.push({
                          text: "删除",
                          key: "del",
                        });
                      }
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
                          date={this.handleDate(it.date)}
                          avatar={it.avatar}
                          score={item.score}
                          actionsOption={actionsOptionReply}
                          onAction={(val) => {
                            console.log("val", val);
                            if (val.key == "del") {
                              this.onDel(item, it, "reply", idx);
                            }
                            if (val.key == "jubao") {
                              this.onJubao(
                                it.reply_id,
                                "reply",
                                item.comment_id
                              );
                            }
                          }}
                          commentContent={it.reply_content}
                          isShowMenuBtn={true}
                          onClickJubao={() => {
                            console.log("jubao");
                          }}
                          dzNum={it.thumb_up_count}
                          alreadyThumbUp={it.already_thumb_up}
                          onThumbUp={async () => {
                            try {
                              let result = await thumb_up({
                                thumb_up_id: it.reply_id,
                                comment_id: item.comment_id,
                                thumb_up_type: "reply",
                              });
                              if (result.type == "add") {
                                it.already_thumb_up = true;
                                it.thumb_up_count = it.thumb_up_count
                                  ? it.thumb_up_count
                                  : 0;
                                it.thumb_up_count += 1;
                              }
                              if (result.type == "reduce") {
                                it.already_thumb_up = false;
                                it.thumb_up_count -= 1;
                              }
                              this.setState({
                                commentlist,
                              });
                            } catch (err) {
                              if (err.error == 401) {
                                this.props.login(null); //如果token认证过期 清空当前缓存的登录信息
                                history.push({
                                  pathname: "/login",
                                });
                              }
                            }
                          }}
                          history={history}
                          onReplyTextBtn={() => {
                            selectReplyItem = {
                              commentlistIndex: index,
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
            <div
              className="show-comment-btn"
              onClick={() => {
                history.push({
                  pathname: "/commentList",
                  state: {
                    film_id: detail.id,
                    film_name: detail.film_name,
                  },
                });
              }}
            >
              查看全部 {commentTotalCount} 条讨论
              <RightOutline />
            </div>
            <div className="separator"></div>
          </div>
        ) : null}
        {/* isNotCanSelectSeatBuy 影院详情传过来的 */}
        {location.state &&
        location.state.isNotCanSelectSeatBuy ? null : detail.hasSchedule ? (
          <Button
            style={{
              "--border-radius": 0,
            }}
            className="select-seat-buy-btn"
            block
            color="primary"
            fill="solid"
            size="large"
            onClick={() => {
              history.push({
                pathname: `/film/cinema/${detail.id}`,
                state: {
                  film_id: detail.id,
                  film_name: detail.film_name,
                },
              });
            }}
          >
            选座购票
          </Button>
        ) : null}
        <Popup
          visible={selectReplyItem ? true : false}
          onMaskClick={() => {
            this.setState({
              selectReplyItem: null,
            });
          }}
        >
          {selectReplyItem && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.1rem 0.2rem 0.3rem 0.2rem",
                background: "#f4f4f4",
              }}
            >
              <TextArea
                style={{
                  background: "#fff",
                  borderRadius: "0.1rem",
                  textAlign: "bottom",
                  marginRight: "0.1rem",
                  padding: "0.05rem",
                }}
                placeholder={`回复 ${selectReplyItem.reply_person_nickname} :`}
                value={selectReplyItem.reply_content}
                onChange={(val) => {
                  selectReplyItem.reply_content = val;
                  this.setState({
                    selectReplyItem,
                  });
                }}
              />
              <Button
                color="primary"
                size="mini"
                style={{ width: "0.7rem" }}
                onClick={() => {
                  this.onReply();
                }}
              >
                回复
              </Button>
            </div>
          )}
        </Popup>
      </div>
    );
  }
  async onReply() {
    let { selectReplyItem, commentlist } = this.state;
    let { history } = this.props;
    try {
      let result = await add_comment_reply(selectReplyItem);
      if (!commentlist[selectReplyItem.commentlistIndex].replyList) {
        commentlist[selectReplyItem.commentlistIndex].replyList = [];
      }
      commentlist[selectReplyItem.commentlistIndex].replyList.push(result);

      if (!commentlist[selectReplyItem.commentlistIndex].backup_reply_list) {
        commentlist[selectReplyItem.commentlistIndex].backup_reply_list = [];
      }
      commentlist[selectReplyItem.commentlistIndex].backup_reply_list.push(
        result
      );

      if (!commentlist[selectReplyItem.commentlistIndex].reply_count) {
        commentlist[selectReplyItem.commentlistIndex].reply_count = 0;
      }
      commentlist[selectReplyItem.commentlistIndex].reply_count += 1;

      this.setState({
        commentlist,
        selectReplyItem: null,
      });
    } catch (err) {
      if (err.error == 401) {
        this.props.login(null); //如果token认证过期 清空当前缓存的登录信息
        history.push({
          pathname: "/login",
        });
      }
    }
  }
  handleDate(date) {
    let diff = dayjs().diff(dayjs(date), "day");
    if (diff > 10) {
      return dayjs(date).format("YYYY-MM-DD HH:mm");
    }
    let fromNow = dayjs(date).fromNow();
    if (fromNow == "几秒前") {
      return "刚刚";
    }
    return fromNow;
  }
  componentWillUnmount = () => {
    this.setState = (state, callback) => {
      return;
    };
  };
}

export default GroupCommons(FileDetail);
