import React, { Component } from "react";
import "./index.scss";
import {
  List,
  Search,
  NavBar,
  Input,
  NumberKeyboard,
  Button,
  Toast,
  Image,
  Rate,
  TextArea,
} from "antd-mobile";
import { GroupCommons } from "@/modules/group/index";
import {
  CloseOutline,
  CloseCircleFill,
  RightOutline,
  EnvironmentOutline,
  PhoneFill,
  DownlandOutline,
} from "antd-mobile-icons";
import {
  get_comment_list,
  add_comment,
  edit_comment,
  del_comment,
  get_comment_detail,
} from "@/api/comment";
import CustomSkeleton from "@/components/CustomSkeleton/index";
import dayjs from "dayjs";

class CommentComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSkeleton: true,
      isDownImage: false,
      orderDetail: {},
      formData: {
        score: 0,
        film_id: "",
        comment_parent_id: "",
        comment_content: "",
      },
      filmInfo: {},
      commentInfo: null,
      productionNum: 0,
    };
  }
  async componentDidMount() {
    let { location } = this.props;
    let { formData } = this.state;
    if (location.state && !location.state.film_id) return;
    let result = await get_comment_detail({
      film_id: location.state && location.state.film_id,
      comment_id: location.state && location.state.comment_id,
    });
    this.setState({
      filmInfo: result.filmInfo,
      commentInfo: result.commentInfo,
      productionNum: result.count,
    });
  }

  render() {
    let { history, location, rateLevelTex } = this.props;
    let { commentInfo, filmInfo, productionNum } = this.state;

    return (
      <div className="comment-complete-container">
        <div className="header-wrapper">
          <NavBar
            style={{
              "--height": "0.44rem",
              fontWeight: "bold",
            }}
            left={
              <i
                className="iconfont icon-shouye"
                onClick={() => {
                  history.push("/");
                }}
                style={{ fontSize: "0.2rem" }}
              ></i>
            }
            onBack={() => {
              history.goBack();
            }}
          >
            评论成功
          </NavBar>
        </div>
        <div style={{ height: "0.5rem" }}></div>

        <div className="content-container">
          <div className="content-wrapper">
            <div className="user-info">
              {commentInfo && commentInfo.avatar ? (
                <Image
                  className="avatar"
                  src={commentInfo.avatar}
                  fit="cover"
                />
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
              <div className="right-wrapper">
                {commentInfo && commentInfo.nickname ? (
                  <p className="nickname">
                    {commentInfo.nickname} <span className="ping">评</span>
                  </p>
                ) : null}
                {productionNum ? (
                  <p className="num">在这里记录了共 {productionNum} 部作品</p>
                ) : null}
              </div>
            </div>
            <div className="score-wrapper">
              {filmInfo.film_name ? (
                <div className="film-name">《{filmInfo.film_name}》</div>
              ) : null}
              {commentInfo && commentInfo.score ? (
                <Rate
                  className="star"
                  style={{
                    "--star-size": "0.21rem",
                    "--active-color": "#e54847",
                  }}
                  allowHalf
                  value={commentInfo.score / 2}
                  readOnly={true}
                />
              ) : null}
              {commentInfo && commentInfo.score ? (
                <div className="score">
                  {commentInfo.score}分 {rateLevelTex[commentInfo.score]}
                </div>
              ) : null}
            </div>
            <div className="comment-content">
              {commentInfo && commentInfo.comment_content}
            </div>

            <Image
              className="poster-img"
              src={filmInfo.poster_img}
              fit="cover"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default GroupCommons(CommentComplete);
