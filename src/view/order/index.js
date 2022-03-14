import React, { Component, useEffect, useRef, useState } from "react";
import "./index.scss";
import CinemaListItem from "@/components/CinemaListItem/index";
import { LeftOutline } from "antd-mobile-icons";
import {
  InfiniteScroll,
  PullToRefresh,
  NavBar,
  Tabs,
  Input,
  Button,
  List,
  Image,
  Toast,
} from "antd-mobile";
import { GroupCommons } from "@/modules/group";
import { get_order_list } from "@/api/order";
import InfiniteScrollContent from "@/components/InfiniteScrollContent/index";
import Cookies from "js-cookie";
import dayjs from "dayjs";
class OrderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchOptions: {
        page: 0,
        limit: 10,
        status: "",
        keywords: "",
      },
      list: [],
      isHasMore: false,
      statusData: [],
      dateActiveKey: 0,
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
    let { history } = this.props;
    fetchOptions.page = 1;
    this.setState(
      {
        fetchOptions,
      },
      async () => {
        try {
          let result = await get_order_list({
            ...fetchOptions,
          });
          let status_arr = [{ text: "全部", value: "" }];
          for (let key in result.order_status) {
            status_arr.push({ text: result.order_status[key], value: key });
          }
          this.setState(
            {
              list: result.rows,
              isSkeleton: false,
              statusData: status_arr,
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
    let {
      list,
      fetchOptions,
      isHasMore,
      statusData,
      dateActiveKey,
      isSkeleton,
    } = this.state;
    return (
      <div className="order-list-container">
        {location.pathname == "/cinemas" ? null : isSkeleton ? (
          <div className="skeleton-box"></div>
        ) : null}
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
              <Button
                color="default"
                shape="rounded"
                type="button"
                size="small"
                onClick={() => {
                  this.onRefresh();
                }}
              >
                搜索
              </Button>
            }
          >
            <Input
              placeholder="搜索电影名称，影院名称"
              clearable={true}
              value={fetchOptions.keywords}
              style={{
                background: "#fff",
                borderRadius: "0.1rem",
                padding: "0.05rem",
              }}
              onEnterPress={() => {
                this.onRefresh();
              }}
              onClear={() => {
                fetchOptions.keywords = "";
                this.setState(
                  {
                    fetchOptions,
                  },
                  () => {
                    this.onRefresh();
                  }
                );
              }}
              onChange={(val) => {
                fetchOptions.keywords = val;
                this.setState(
                  {
                    fetchOptions,
                  },
                  () => {
                    // this.onRefresh()
                  }
                );
              }}
            />
          </NavBar>

          <Tabs
            style={{ background: "#fff" }}
            activeKey={dateActiveKey.toString()}
            onChange={(val) => {
              fetchOptions.status = statusData[val].value;
              this.setState({
                fetchOptions,
                dateActiveKey: val,
              });
              this.onRefresh();
            }}
            stretch={false}
            activeLineMode="auto"
          >
            {statusData.map((item, index) => {
              return <Tabs.Tab title={item.text} key={index} />;
            })}
          </Tabs>
        </div>
        <div style={{ height: "0.9rem" }}></div>
        <PullToRefresh
          disabled={false}
          onRefresh={async () => {
            await this.onRefreshList();
          }}
        >
          {/* {list.map((item, index) => {
            return (
              <CinemaListItem
                key={index}
                title={item.cinema_name}
                value={item.min_low_sale_price}
                label={item.address}
                distance={item.distance}
                onClick={() => {
                  this.props.history.push({
                    pathname: `/cinema/detail`,
                    state: {
                      cinema_id: item.cinema_id,
                      film_id: params && params.film_id,
                      date: fetchOptions.date,
                    },
                  });
                }}
              />
            );
          })} */}
          {list.map((item, index) => {
            return (
              <ItemList
                item={item}
                history={history}
                key={index}
                onClick={() => {
                  history.push({
                    pathname: "/order/detail/" + item.order_id,
                  });
                }}
              />
            );
          })}
          <InfiniteScroll
            threshold="50"
            loadMore={async () => {
              fetchOptions.page += 1;
              this.setState({ fetchOptions });
              let result = await get_order_list({
                ...fetchOptions,
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
              text={"暂无内容哦"}
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

export default GroupCommons(OrderComponent);

function ItemList({ item, history, onClick }) {
  let [expire_time, set_expire_time] = useState([item.expireTime]);

  useEffect(() => {
    if (expire_time <= 0) return;
    setTimeout(() => {
      expire_time -= 1;
      set_expire_time(expire_time);
    }, 1000);
    return () => {};
  });
  function handleMinute() {
    let m = Math.floor(expire_time / 60);
    let s = expire_time % 60;
    return m + ":" + (s > 9 ? s : "0" + s);
  }
  return (
    <div
      className="item-list"
      onClick={() => {
        if (expire_time) {
          onClick && onClick();
        }
      }}
    >
      <List mode="card" header="">
        <List.Item
          extra={
            item.status == 2 && item.comment_content
              ? "已评价"
              : item.status == 0 && expire_time > 0
              ? item.status_text + ", " + handleMinute()
              : item.status == 0
              ? "支付超时"
              : item.status_text
          }
        >
          {item.film_name}
          {/* item.expireTime */}
        </List.Item>
        <div className="item-list-content">
          <Image
            style={{ borderRadius: 8 }}
            src={item.poster_img}
            width={60}
            height={60}
            fit="cover"
          />
          <div className="right-content">
            <div>影院：{item.cinema_name}</div>
            <div>场次：{item.start_runtime}</div>
            <div>场次：{item.buy_seat_ids.length} 张</div>
            <div>总价：¥{item.price}</div>
          </div>
        </div>
        <div className="comment-btn">
          {item.status == 2 && !item.comment_content ? (
            <Button
              color="primary"
              size="small"
              onClick={(e) => {
                stopBubble(e);
                history.push({
                  pathname: "/comment",
                  state: {
                    // schedule_id: item.schedule_id,
                    film_id: item.film_id,
                    // film_name: item.film_name,
                  },
                });
              }}
            >
              写影评
            </Button>
          ) : null}
          {item.status == 0 && expire_time ? (
            <Button
              color="primary"
              size="small"
              onClick={(e) => {
                stopBubble(e);
                history.push({
                  pathname: "/buy/ticket/" + item.order_id,
                });
              }}
            >
              付款
            </Button>
          ) : null}
        </div>
      </List>
    </div>
  );
}
function stopBubble(e) {
  if (e && e.stopPropagation) {
    //非IE
    e.stopPropagation();
  } else {
    //IE
    window.event.cancelBubble = true;
  }
}
