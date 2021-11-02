import React, { Component } from "react";
import "./index.scss";

import {
  get_film_hot,
  get_film_soon_show,
} from "@/api/film";
import {
  Tabs,
  InfiniteScroll,
  PullToRefresh,
  NavBar,
} from "antd-mobile";
import { GroupCommons } from "@/modules/group";
import FilmListItem from "@/components/FilmListItem/index";
import { DownOutline } from "antd-mobile-icons";
import CustomSwiper from "@/components/CustomSwiper/index";
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
    };
  }

  async componentDidMount() {
    window.addEventListener("scroll", (e) => {
      var scrollTop = window.scrollY;
      // console.log("scrollTop", scrollTop);
      this.setState({
        floatTabs: scrollTop >= 200 ? true : false,
      });
    });    
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
              onClick={() => {
                this.props.history.push({
                  pathname: "/film/detail",
                  state: { film_id: 123 },
                });
              }}
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
              let result = await get_film_soon_show(fetchOptionsSoonShow);
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
                // this.props.history.push({
                //   pathname: "/cinema/detail",
                //   state: { film_id: 123 },
                // });
              }}
            />
          );
        })}
        <InfiniteScroll
          threshold="100"
          loadMore={async () => {
            fetchOptionsSoonShow.page += 1;
            this.setState({ fetchOptionsSoonShow });
            let result = await get_film_soon_show(fetchOptionsSoonShow);
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
        />
      </PullToRefresh>
    );
  }
  
  render() {
    let { userInfo, locationInfo, history } = this.props;
    let {
      floatTabs,
      activeTab
    } = this.state;
    return (
      <div className="app-film-container">
        <div className='custom-swiper-wrapper'>
          <div className="tag-film-name" onClick={()=>{
            history.push({
              pathname:'/citys'
            })
          }}>
            <div className="mask"></div>
              广州
            <DownOutline />
          </div>
          <CustomSwiper/>
        </div>
        
        
        
        <div className={[floatTabs ? "float-tabs-component" : ""]}>
          {floatTabs ? (
            <NavBar
              backArrow={false}
              left={
                <div className="navbar-wrapper">
                  <span className="city-name">广州</span>
                  <DownOutline
                    fontSize={12}
                    onClick={() => {
                      console.log("13124--DownOutline");
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
            // className={[floatTabs ? "float-tabs-component" : ""]}
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

export default GroupCommons(Home);
