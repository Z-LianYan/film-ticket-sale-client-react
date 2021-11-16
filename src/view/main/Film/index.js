import React, { Component } from "react";
import "./index.scss";

import { get_film_hot, get_film_soon_show,get_banner } from "@/api/film";
import { Tabs, InfiniteScroll, PullToRefresh, NavBar } from "antd-mobile";
import { GroupCommons } from "@/modules/group";
import FilmListItem from "@/components/FilmListItem/index";
import { DownOutline } from "antd-mobile-icons";
import CustomSwiper from "@/components/CustomSwiper/index";
import dayjs from "dayjs";
import tools from "@/utils/tools";


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
      scrollTopSoon: 0
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
    
    tools.geolocation({
      onComplete:(result)=>{
        console.log('完成定位',result)
      },
      onError:(err)=>{
        console.log('定位失败',err)
      }
    })
    // const AMap = window.AMap;
    // // var map = new AMap.Map('map-container', {
    // //   viewMode: '3D', // 默认使用 2D 模式，如果希望使用带有俯仰角的 3D 模式，请设置 viewMode: '3D',
    // //   zoom: 11,//[23.01185,113.38798]
    // // });
    // AMap.plugin('AMap.Geolocation', function() {
    //     var geolocation = new AMap.Geolocation({
    //         enableHighAccuracy: true,//是否使用高精度定位，默认:true
    //         timeout: 10000,          //超过10秒后停止定位，默认：5s
    //         position:'RB',    //定位按钮的停靠位置
    //         buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
    //         zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点
    //     });
    //     map.addControl(geolocation);
    //     geolocation.getCurrentPosition(function(status,result){
    //       console.log('result--定位status',status)
    //         if(status=='complete'){
    //           console.log('result--定位完成',result)
    //             // onComplete(result)
    //             // alert(JSON.stringify(result))
    //         }else{
    //           console.log('result--定位失败',result)
    //         }
    //     });
    // });
    
    //  释放地图
    // this.rmap && this.rmap.destory();
  }
  async getHotList() {
    let { fetchOptionsHot, hotList } = this.state;
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
    let { fetchOptionsSoonShow, soonShowList } = this.state;
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
        return '';
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
              separator={hotList.length === index + 1 ? false : true}
              onClick={() => {
                this.props.history.push({
                  pathname: "/film/detail",
                  state: { film_id: 123 },
                });
              }}
              onRightClick={() => {
                console.log("onRightClick");
                this.props.history.push({
                  pathname: "/film/cinema",
                  state: { film_id: "6666" },
                });
              }}
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
                this.props.history.push({
                  pathname: "/film/detail",
                  state: { film_id: 123 },
                });
              }}
              onRightClick={() => {
                console.log("onRightClick");
                this.props.history.push({
                  pathname: "/film/cinema",
                  state: { film_id: "6666" },
                });
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
    let { history } = this.props;
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
            广州
            <DownOutline />
          </div>
          <CustomSwiper 
          useSwiperType=""
          onClick={()=>{
            history.push({
              pathname: "/film/detail",
              state: { film_id: 123 },
            })
          }}/>
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

        {/* {activeTab === "hot" ? this.renderHot() : this.renderSoon()} */}



        <div id="map-container" style={{height:'300px','border':'1px solid red'}}></div>



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
