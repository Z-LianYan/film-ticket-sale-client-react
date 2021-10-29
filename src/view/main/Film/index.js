import React, { Component } from "react";
import "./index.scss";

import {
  get_film_hot,
  get_film_soon_show,
  get_banner,
} from "../../../api/film";
// import { Button, WhiteSpace } from "antd-mobile";
import {
  Button,
  Tabs,
  InfiniteScroll,
  PullToRefresh,
  Swiper,
  Toast,
} from "antd-mobile";
import { GroupCommons } from "@/modules/group";
import FilmListItem from "@/components/FilmListItem/index";
import dayjs from "dayjs";
class Home extends Component {
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
      },
      fetchOptionsSoonShow: {
        page: 0,
        limit: 6,
      },
      isHotHasMore: true,
      isSoonHasMore: true,
      scrollTopHot: 0,
      scrollTopSoon: 0,
      bannerList: [],
    };
  }

  componentDidMount() {
    window.addEventListener("scroll", (e) => {
      var scrollTop = window.scrollY;
      // console.log("scrollTop", scrollTop);
      this.setState({
        floatTabs: scrollTop >= 200 ? true : false,
      });
    });
    this.getBanneer();
  }
  async getBanneer() {
    let result = await get_banner();
    this.setState({
      bannerList: result.rows,
    });
    console.log("result--banner", result);
  }
  async getHotList() {
    let { fetchOptionsHot, isHotHasMore, hotList } = this.state;
    let res = await get_film_hot(fetchOptionsHot);
    console.log("正在热映", res);
    this.setState({
      hotList: fetchOptionsHot.page === 1 ? res.rows : hotList.concat(res.rows),
    });
    if (this.state.hotList.length >= res.count) {
      this.setState({
        isHotHasMore: false,
      });
    }
  }
  async getSoonShowList() {
    let { fetchOptionsSoonShow, isSoonHasMore, soonShowList } = this.state;
    return new Promise((resolve, reject) => {
      get_film_soon_show(fetchOptionsSoonShow).then((res) => {
        this.setState({
          soonShowList:
            fetchOptionsSoonShow.page === 1
              ? res.rows
              : soonShowList.concat(res.rows),
        });
        if (this.state.soonShowList.length >= res.count) {
          this.setState({
            isSoonHasMore: false,
          });
        }
        resolve();
      });
    });
    // let res = await get_film_soon_show(fetchOptionsSoonShow);
    // console.log("即将上映", res);
  }

  handleWeek(day) {
    switch (day) {
      case 0:
        return "周日";
        break;
      case 1:
        return "周一";
        break;
      case 2:
        return "周二";
        break;
      case 3:
        return "周三";
        break;
      case 4:
        return "周四";
        break;
      case 5:
        return "周五";
        break;
      case 6:
        return "周六";
        break;
    }
  }

  renderHot() {
    let { hotList, fetchOptionsHot, isHotHasMore } = this.state;
    return (
      <PullToRefresh
        onRefresh={async () => {
          fetchOptionsHot.page = 1;
          this.setState(
            {
              fetchOptionsHot,
            },
            async () => {
              let result = await get_film_hot(fetchOptionsHot);
              this.setState(
                {
                  hotList: result.rows,
                },
                () => {
                  this.setState({
                    isHotHasMore: true,
                  });
                }
              );
              // if (this.state.hotList.length >= result.count) {
              //   this.setState({
              //     isHotHasMore: false,
              //   });
              // }
            }
          );
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
            />
          );
        })}

        <InfiniteScroll
          threshold="100"
          loadMore={async () => {
            fetchOptionsHot.page += 1;
            this.setState({ fetchOptionsHot });
            let result = await get_film_hot(fetchOptionsHot);
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
        />
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
          fetchOptionsSoonShow.page = 1;
          this.setState(
            {
              fetchOptionsSoonShow,
            },
            async () => {
              let result = await get_film_hot(fetchOptionsSoonShow);
              this.setState(
                {
                  soonShowList: result.rows,
                },
                () => {
                  this.setState({
                    isSoonHasMore: true,
                  });
                }
              );
              // if (this.state.soonShowList.length >= result.count) {
              //   this.setState({
              //     isSoonHasMore: false,
              //   });
              // }
            }
          );
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
            />
          );
        })}
        <InfiniteScroll
          threshold="100"
          loadMore={async () => {
            fetchOptionsSoonShow.page += 1;
            this.setState({ fetchOptionsSoonShow });
            let result = await get_film_soon_show(fetchOptionsSoonShow);
            this.setState({
              soonShowList:
                fetchOptionsSoonShow.page === 1
                  ? result.rows
                  : soonShowList.concat(result.rows),
            },()=>{
              if (this.state.soonShowList.length >= result.count) {
                this.setState({
                  isSoonHasMore: false,
                });
              }
            });
            
          }}
          hasMore={isSoonHasMore}
        />
      </PullToRefresh>
    );
  }
  renderSwiper() {
    let { bannerList } = this.state;
    return (
      <Swiper
        indicatorProps={{
          color: "white",
          style: {
            "--dot-color": "#fff",
            "--dot-opcity": "0.4",
            "--active-dot-color": "#ff5f16",
            "--dot-size": "8px",
            "--active-dot-size": "20px",
            "--dot-border-radius": "50%",
            "--active-dot-border-radius": "10px",
            "--dot-spacing": "8px",
          },
        }}
        allowTouchMove={true}
        loop={true}
        autoplay={true}
      >
        {bannerList.map((item, index) => {
          return (
            <Swiper.Item
              key={index}
              onClick={() => {
                console.log("123");
              }}
            >
              <img
                className="left"
                style={{ width: "100%", height: "2.1rem" }}
                src={item.poster_img}
              />
            </Swiper.Item>
          );
        })}
      </Swiper>
    );
  }

  render() {
    // let { userInfo, locationInfo, history } = this.props;
    let {
      soonShowList,
      hotList,
      floatTabs,
      activeTab,
      isHotHasMore,
      isSoonHasMore,
      fetchOptionsSoonShow,
      fetchOptionsHot,
    } = this.state;
    return (
      <div className="app-film-container">
        {this.renderSwiper()}
        <Tabs
          defaultActiveKey={"hot"}
          className={[floatTabs ? "float-tabs-component" : ""]}
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
          <Tabs.TabPane title="正在热映" key="hot" />
          <Tabs.TabPane title="即将上映" key="soon" />
        </Tabs>
        {activeTab === "hot" ? this.renderHot() : this.renderSoon()}
        <div style={{ height: "1rem" }}></div>
      </div>
    );
  }
}

export default GroupCommons(Home);
