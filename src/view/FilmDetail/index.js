import React, { Component } from "react";
import "./index.scss";
import { DownOutline, UpOutline, RightOutline } from "antd-mobile-icons";
import { List, Image, Mask, NavBar, ImageViewer, Button } from "antd-mobile";
import { get_film_detail } from "@/api/film";
import { get_comment_list, thumb_up } from "@/api/comment";
import dayjs from "dayjs";
import { GroupCommons } from "@/modules/group";
import CommentItem from "@/components/Comment-item/index";

class FileDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleMask: false,
      isShowNavBar: "",
      detail: {},
      isSkeleton: true,
      commentList: [],
      commentTotalCount: 0,
    };
  }
  async getCommentList() {
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
      commentList: result.rows,
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
    this.getCommentList();
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

  render() {
    let { isShowNavBar, detail, isSkeleton, commentList, commentTotalCount } =
      this.state;
    let { history, location, userInfo } = this.props;
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
          <img className="image" src={detail.poster_img} alt=""></img>
        </div>
        <div className="film-detail">
          <div className="film-name-score">
            <h3 className="film-name">
              {detail.film_name}
              <span className="show-type">{detail.play_type_name}</span>
            </h3>
            <span className="score-val">
              {detail.grade}
              <span className="score">分</span>
            </span>
          </div>

          <div className="record-film">{detail.category_names}</div>
          <div className="show-date">
            {dayjs(detail.show_time).format("YYYY年MM月DD日")}上映
          </div>
          <div className="area-and-play-time">
            {detail.area} | {detail.runtime}分钟
          </div>
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
        {commentList.length ? (
          <div>
            <List style={{ background: "transparent" }}>
              <List.Item
                style={{ background: "transparent" }}
                extra={
                  userInfo &&
                  commentList.some(
                    (item) => item.user_id == userInfo.user_id
                  ) && (
                    <div
                      className="edit-mine-comment-btn"
                      onClick={() => {
                        let commentData = {};
                        for (let item of commentList) {
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
            {commentList.map((item, index) => {
              return (
                <CommentItem
                  key={index}
                  nickname={item.nickname}
                  scoreText={`给这部作品打了${item.score}分`}
                  date={item.date}
                  separator={commentList.length != index + 1}
                  avatar={item.avatar}
                  score={item.score}
                  actionsOption={[{ text: "举报", key: "jubao" }]}
                  onAction={() => {
                    console.log("jubao");
                  }}
                  commentContent={item.comment_content}
                  isShowMineCommentTag={
                    userInfo && userInfo.user_id == item.user_id
                  }
                  isShowMenuBtn={true}
                  onAction={(val) => {
                    console.log("val", val);
                  }}
                  messageNum={785}
                  dzNum={item.thumb_up_count}
                  onThumbUp={async () => {
                    let result = await thumb_up({
                      comment_id: item.comment_id,
                    });
                    // console.log(result);
                    if (result.type == "add") {
                      item.thumb_up_count += 1;
                    }
                    if (result.type == "reduce") {
                      item.thumb_up_count -= 1;
                    }
                    this.setState({
                      commentList,
                    });
                  }}
                  history={history}
                  onReplyMessage={() => {}}
                />
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
      </div>
    );
  }
  componentWillUnmount = () => {
    this.setState = (state, callback) => {
      return;
    };
  };
}

export default GroupCommons(FileDetail);
