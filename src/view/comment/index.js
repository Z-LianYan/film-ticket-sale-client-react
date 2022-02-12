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

class Comment extends Component {
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
      productionNum: 0,
    };
  }
  async componentDidMount() {
    let { location, history } = this.props;
    let { formData } = this.state;

    if (location.state && !location.state.film_id) return;

    try {
      let result = await get_comment_detail({
        film_id: location.state && location.state.film_id,
        comment_id: location.state && location.state.comment_id,
      });
      this.setState({
        filmInfo: result.filmInfo,
        productionNum:
          location.state && location.state.comment_id
            ? result.count
            : result.count + 1,
      });

      if (location.state && location.state.comment_id) {
        let commentInfo = result.commentInfo;
        formData.score = commentInfo.score;
        formData.comment_content = commentInfo.comment_content;
        this.setState({
          formData,
        });
      }
    } catch (err) {
      if (err.error == 401) {
        this.props.login(null); //如果token认证过期 清空当前缓存的登录信息
        history.goBack();
      }
    }
  }
  onGotoCommentCompletePage(comment_id) {
    let { location, history } = this.props;
    setTimeout(() => {
      history.replace({
        pathname: "/commentComplete",
        state: {
          comment_id: comment_id,
          film_id: location.state && location.state.film_id,
        },
      });
    }, 500);
  }
  async addComment() {
    let { location, history } = this.props;
    let { formData } = this.state;
    if (!formData.score)
      return Toast.show({
        duration: 1000,
        content: "您还没给评分呢",
      });
    if (!formData.comment_content)
      return Toast.show({
        duration: 1000,
        content: "您还没评论呢",
      });
    if (location.state && location.state.comment_id) {
      await edit_comment({
        ...formData,
        comment_id: location.state.comment_id,
      });
      this.onGotoCommentCompletePage(location.state.comment_id);
      return;
    }
    let result = await add_comment({
      ...formData,
      film_id: location.state && location.state.film_id,
    });
    if (!result) return;
    this.onGotoCommentCompletePage(result.comment_id);
  }

  render() {
    let { history, rateLevelTex, location } = this.props;
    let { formData, filmInfo, productionNum } = this.state;

    return (
      <div className="comment-container">
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
            right={
              <Button
                color="success"
                shape="rounded"
                type="button"
                size="small"
                disabled={
                  formData.comment_content.length < 6 || !formData.score
                    ? true
                    : false
                }
                onClick={() => {
                  this.addComment();
                }}
              >
                发布
              </Button>
            }
          >
            <div className="comment-title">我的评论</div>
            <div className="comment-film">{filmInfo.film_name}</div>
          </NavBar>
        </div>
        <div style={{ height: "0.5rem" }}></div>

        <div className="content-container">
          <div className="jilu">
            {/* 这是您在这里讨论的第<span className="num"> {productionNum} </span>部作品 */}
            {location.state && location.state.comment_id
              ? `您总共参与讨论了`
              : "这是您参与讨论的第"}
            <span className="num"> {productionNum} </span>部作品
          </div>
          <div className="rate-wrapper">
            <div className="left-content">
              <span className="left-txt">评分</span>
              <Rate
                className="star"
                style={{ "--star-size": "0.21rem" }}
                allowHalf
                value={formData.score / 2}
                onChange={(val) => {
                  formData.score = val * 2;
                  this.setState({
                    formData,
                  });
                }}
              />
            </div>

            <span className="right-txt">
              {formData.score ? (
                <span className="score">{formData.score}分</span>
              ) : null}
              {rateLevelTex[formData.score]}
            </span>
          </div>
          <TextArea
            style={{ marginTop: "0.05rem", "--font-size": "0.14rem" }}
            placeholder="大家都在问：剧情怎么样，画面好吗，演技如何？"
            rows={8}
            showCount
            maxLength={150}
            value={formData.comment_content}
            onChange={(val) => {
              formData.comment_content = val;
              this.setState({
                formData,
              });
            }}
          />
        </div>
      </div>
    );
  }
}

export default GroupCommons(Comment);
