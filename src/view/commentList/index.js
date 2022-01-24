import React, { Component, useRef } from "react";
import "./index.scss";
import CinemaListItem from "@/components/CinemaListItem/index";
import { LeftOutline, InformationCircleOutline } from "antd-mobile-icons";
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
} from "antd-mobile";
import { GroupCommons } from "@/modules/group";
import { get_order_list } from "@/api/order";
import InfiniteScrollContent from "@/components/InfiniteScrollContent/index";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import CommentItem from "@/components/comment-item/index";
import { get_comment_list } from "@/api/comment";
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
      list: [],
      isHasMore: false,
      isSkeleton: true,
      film_name: "",
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
    let { history, match, locationInfo, userInfo,location } = this.props;
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
            // city_id: locationInfo && locationInfo.city_id,
            user_id: userInfo && userInfo.user_id
          });
          let status_arr = [{ text: "全部", value: "" }];
          for (let key in result.order_status) {
            status_arr.push({ text: result.order_status[key], value: key });
          }
          this.setState(
            {
              list: result.rows,
              isSkeleton: false,
            },
            () => {
              if (this.state.list.length >= result.count) {
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

  render() {
    let { location, history, locationInfo, match, userInfo } = this.props;
    let { params } = match;
    let { list, fetchOptions, isHasMore, statusData, isSkeleton } = this.state;
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
              userInfo && list.some(item=>item.user_id==userInfo.user_id) &&  <Button
                color="success"
                shape="rounded"
                type="button"
                size="small"
                onClick={() => {
                  let commentData = {};
                  for(let item of list){
                    if(item.user_id == userInfo.user_id){
                      commentData = item;
                    }
                  }
                  console.log('23456789',params.film_id,commentData)
                  history.push({
                    pathname: "/comment",
                    state: {
                      film_id: location.state && location.state.film_id,
                      comment_id:commentData.comment_id
                    },
                  });
                }}
              >
                编辑我的讨论
              </Button>
              
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
          {list.map((item, index) => {
            return (
              <CommentItem
                key={index}
                nickname={item.nickname}
                scoreText={`给这部作品打了${item.score}分`}
                dzNum={143}
                messageNum={785}
                date={item.date}
                separator={list.length != index + 1}
                avatar={item.avatar}
                score={item.score}
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
              />
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
                list:
                  fetchOptions.page === 1
                    ? result.rows
                    : list.concat(result.rows),
              });
              if (this.state.list.length >= result.count) {
                this.setState({
                  isHasMore: false,
                });
              }
            }}
            hasMore={isHasMore}
          >
            <InfiniteScrollContent
              text={`没有查到相关内容哦！`}
              noContent={!isHasMore && !this.state.list.length}
              hasMore={isHasMore}
            />
          </InfiniteScroll>
          <div style={{ height: "1rem" }}></div>
        </PullToRefresh>
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
