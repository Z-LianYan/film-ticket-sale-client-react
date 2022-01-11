import React, { Component, forwardRef } from "react";
import "./index.scss";

import { get_film_hot, get_film_soon_show } from "@/api/film";
import {
  Tabs,
  InfiniteScroll,
  PullToRefresh,
  NavBar,
  JumboTabs,
  Button,
} from "antd-mobile";
import { GroupCommons } from "@/modules/group";
import FilmListItem from "@/components/FilmListItem/index";
import { DownOutline } from "antd-mobile-icons";
import CustomSwiper from "@/components/CustomSwiper/index";
import dayjs from "dayjs";
// import tools from "@/utils/tools";
import Cookies from "js-cookie";
import InfiniteScrollContent from "@/components/InfiniteScrollContent/index";

class Film extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hotList: [],
      soonShowList: [],
      floatTabs: false,
      activeTab: "hot",
      fetchOptionsHot: {
        page: 0,
        limit: 6,
        city_id: "",
      },
      fetchOptionsSoonShow: {
        page: 0,
        limit: 6,
        city_id: "",
      },
      isHotHasMore: true,
      isSoonHasMore: true,
      scrollTopHot: 0,
      scrollTopSoon: 0,
    };
    // let _cookies = Cookies.get("locationInfo");
    // let _cookiesInfo = null;
    // if (_cookies) {
    //   _cookiesInfo = JSON.parse(_cookies);
    // }
    // this.state.fetchOptionsHot.city_id = _cookiesInfo
    //   ? _cookiesInfo.city_id
    //   : props.city_id;
    // this.state.fetchOptionsSoonShow.city_id = _cookiesInfo
    //   ? _cookiesInfo.city_id
    //   : props.city_id;
  }

  async componentDidMount() {
    window.addEventListener("scroll", (e) => {
      var scrollTop = window.scrollY;
      this.setState({
        floatTabs: scrollTop >= 200 ? true : false,
      });
    });

    this.props.locationInfo.locationReady = () => {
      this.onRefresh();
    };
  }
  onRefresh() {
    this.setState({
      isSoonHasMore: false, //防止快速点击切换tabs 获取 即将上映列表 死循环
    });
    this.onRefreshHotList();
    this.onRefreshSoonShowList();
  }
  async onRefreshHotList() {
    let { fetchOptionsHot, hotList } = this.state;
    fetchOptionsHot.page = 1;
    this.setState(
      {
        fetchOptionsHot,
      },
      async () => {
        let result = await get_film_hot({
          ...fetchOptionsHot,
          city_id: this.props.locationInfo.city_id,
        });
        this.setState(
          {
            hotList: result.rows,
          },
          () => {
            if (this.state.hotList.length >= result.count) {
              this.setState({
                isHotHasMore: false,
              });
            } else {
              this.setState({
                isHotHasMore: true,
              });
            }
          }
        );
      }
    );
  }
  async onRefreshSoonShowList() {
    let { fetchOptionsSoonShow, soonShowList } = this.state;
    fetchOptionsSoonShow.page = 1;
    this.setState(
      {
        fetchOptionsSoonShow,
      },
      async () => {
        let result = await get_film_soon_show({
          ...fetchOptionsSoonShow,
          city_id: this.props.locationInfo.city_id,
        });
        this.setState(
          {
            soonShowList: result.rows,
          },
          () => {
            if (this.state.soonShowList.length >= result.count) {
              this.setState({
                isSoonHasMore: false,
              });
            } else {
              this.setState({
                isSoonHasMore: true,
              });
            }
          }
        );
      }
    );
  }

  handleWeek(day) {
    switch (day) {
      case 0:
        return "周日";
      case 1:
        return "周一";
      case 2:
        return "周二";
      case 3:
        return "周三";
      case 4:
        return "周四";
      case 5:
        return "周五";
      case 6:
        return "周六";
      default:
        return "";
    }
  }

  renderHot() {
    let { hotList, fetchOptionsHot, isHotHasMore } = this.state;
    return (
      <PullToRefresh
        // ref={()=>{
        //   console.log('ref')
        // }}
        onRefresh={async () => {
          await this.onRefreshHotList();
        }}
      >
        {hotList.map((item, index) => {
          return (
            <FilmListItem
              key={item.id}
              title={item.film_name}
              playType={item.play_type_name}
              score={item.grade}
              actors={item.actors.map((item) => item.name).join(",")}
              bottomText={item.area + " | " + item.runtime + "分钟"}
              imgUrl={item.poster_img}
              separator={hotList.length === index + 1 ? false : true}
              onClick={() => {
                this.props.history.push({
                  pathname: "/film/detail/" + item.film_id,
                });
              }}
              onRightClick={() => {
                this.props.history.push({
                  pathname: `/film/cinema/${item.film_id}`,
                });
              }}
            />
          );
        })}

        <InfiniteScroll
          threshold="500"
          loadMore={async () => {
            fetchOptionsHot.page += 1;
            this.setState({ fetchOptionsHot });
            let result = await get_film_hot({
              ...fetchOptionsHot,
              city_id: this.props.locationInfo.city_id,
            });
            this.setState({
              hotList:
                fetchOptionsHot.page === 1
                  ? result.rows
                  : hotList.concat(result.rows),
            });
            if (this.state.hotList.length >= result.count) {
              this.setState({
                isHotHasMore: false,
              });
            }
          }}
          hasMore={isHotHasMore}
        >
          <InfiniteScrollContent
            text="当前区域暂无影片放映哦"
            noContent={!isHotHasMore && !this.state.hotList.length}
            hasMore={isHotHasMore}
          />
        </InfiniteScroll>
      </PullToRefresh>
    );
  }
  hendalDate(show_time) {
    let year = dayjs(show_time).format("YYYY");
    let cur_year = dayjs().format("YYYY");
    if (cur_year !== year) {
      return dayjs(show_time).format("YYYY年MM月DD");
    } else {
      return dayjs(show_time).format("MM月DD");
    }
  }
  renderSoon() {
    let { soonShowList, fetchOptionsSoonShow, isSoonHasMore } = this.state;
    return (
      <PullToRefresh
        onRefresh={async () => {
          await this.onRefreshSoonShowList();
        }}
      >
        {soonShowList.map((item, index) => {
          return (
            <FilmListItem
              key={item.id}
              title={item.film_name}
              playType={item.play_type_name}
              isShowScore={false}
              actors={item.actors.map((item) => item.name).join(",")}
              bottomText={
                "上映日期：" +
                this.handleWeek(dayjs(item.show_time).day()) +
                " " +
                this.hendalDate(item.show_time)
              }
              imgUrl={item.poster_img}
              separator={soonShowList.length === index + 1 ? false : true}
              btnColor="warning"
              btnTxt={item.isPresale ? "预购" : ""}
              onClick={() => {
                this.props.history.push({
                  pathname: "/film/detail/" + item.id,
                });
              }}
              onRightClick={() => {
                this.props.history.push({
                  pathname: `/film/cinema/${item.id}`,
                  // state: {
                  //   film_id: item.id,
                  //   film_name: item.film_name,
                  // },
                });
              }}
            />
          );
        })}
        <InfiniteScroll
          threshold="200"
          loadMore={async () => {
            fetchOptionsSoonShow.page += 1;
            this.setState({ fetchOptionsSoonShow });
            let result = await get_film_soon_show({
              ...fetchOptionsSoonShow,
              city_id: this.props.locationInfo.city_id,
            });
            this.setState(
              {
                soonShowList:
                  fetchOptionsSoonShow.page === 1
                    ? result.rows
                    : soonShowList.concat(result.rows),
              },
              () => {
                if (this.state.soonShowList.length >= result.count) {
                  this.setState({
                    isSoonHasMore: false,
                  });
                }
              }
            );
          }}
          hasMore={isSoonHasMore}
        >
          <InfiniteScrollContent
            text="暂无即将上映的影片哦"
            noContent={!isSoonHasMore && !this.state.soonShowList.length}
            hasMore={isSoonHasMore}
          />
        </InfiniteScroll>
      </PullToRefresh>
    );
  }
  stopBubble(e) {
    // var e = arguments.callee.call er.arguments[0] || event; //若省略此句，下面的e改为event，IE运行可以，但是其他浏览器就不兼容
    if (e && e.stopPropagation) {
      e.stopPropagation();
    } else if (window.event) {
      window.event.cancelBubble = true;
    }
  }
  onSwitchCity() {
    let { locationInfo } = this.props;
    let { realLocation, locationReady } = locationInfo;
    Cookies.set(
      "locationInfo",
      JSON.stringify({
        city_id: realLocation && realLocation.city_id,
        city_name: realLocation && realLocation.city_name,
      }),
      {
        expires: 1,
      }
    );
    this.props.setLocationInfo(
      {
        city_id: realLocation && realLocation.city_id,
        city_name: realLocation && realLocation.city_name,
        lat: realLocation && realLocation.lat,
        lng: realLocation && realLocation.lng,
        isShowSwitchLocationModal: false,
      },
      () => {
        locationReady && locationReady();
      }
    );
  }
  render() {
    let { history, locationInfo } = this.props;
    let { realLocation } = locationInfo;
    let { floatTabs, activeTab } = this.state;
    return (
      <div className="app-film-container">
        <div className="custom-swiper-wrapper">
          <div
            className="tag-film-name"
            onClick={() => {
              history.push({
                pathname: "/citys",
              });
            }}
          >
            <div className="mask"></div>
            {locationInfo.city_name}
            <DownOutline className="icon-down" />

            {realLocation &&
            realLocation.city_id != locationInfo.city_id &&
            locationInfo.isShowSwitchLocationModal ? (
              <div className="location-show-box">
                <div className="location-mask"></div>
                <div className="top-arrow"></div>
                <div className="left-txt">
                  定位显示您在{realLocation && realLocation.city_name}
                </div>
                <Button
                  color="primary"
                  size="mini"
                  onClick={(e) => {
                    this.stopBubble(e);
                    this.onSwitchCity();
                  }}
                >
                  切换到广州
                </Button>
              </div>
            ) : null}
          </div>
          <CustomSwiper
            useSwiperType=""
            onClick={(item) => {
              history.push({
                pathname: "/film/detail/" + item.film_id,
              });
            }}
          />
        </div>

        <div className={[floatTabs ? "float-tabs-component" : ""]}>
          {floatTabs ? (
            <NavBar
              backArrow={false}
              left={
                <div className="navbar-wrapper">
                  <span className="city-name">{locationInfo.city_name}</span>
                  <DownOutline
                    fontSize={12}
                    onClick={() => {
                      history.push({
                        pathname: "/citys",
                      });
                    }}
                  />
                </div>
              }
            >
              电影
            </NavBar>
          ) : null}
          <Tabs
            defaultActiveKey={"hot"}
            onChange={(val) => {
              var scrollTop = window.scrollY;
              if (val === "hot") {
                this.setState({
                  scrollTopSoon: scrollTop,
                });
              }
              if (val === "soon") {
                this.setState({
                  scrollTopHot: scrollTop,
                });
              }
              this.setState(
                {
                  activeTab: val,
                },
                () => {
                  if (val === "soon") {
                    window.scrollTo(0, this.state.scrollTopSoon);
                  }
                  if (val === "hot") {
                    window.scrollTo(0, this.state.scrollTopHot);
                  }
                }
              );
            }}
          >
            <Tabs.Tab title="正在热映" key="hot" />
            <Tabs.Tab title="即将上映" key="soon" />
          </Tabs>
        </div>

        {activeTab === "hot" ? this.renderHot() : this.renderSoon()}

        <div style={{ height: "1rem" }}></div>
      </div>
    );
  }

  componentWillUnmount = () => {
    this.setState = (state, callback) => {
      return;
    };
  };
}

export default GroupCommons(Film);
