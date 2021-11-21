import React, { Component } from "react";
import "./index.scss";
import CinemaListItem from "@/components/CinemaListItem/index";
import { SearchOutline, DownOutline, LeftOutline } from "antd-mobile-icons";
import {
  Button,
  InfiniteScroll,
  PullToRefresh,
  NavBar,
  Dropdown,
  Toast,
  Grid,
  Tabs,
} from "antd-mobile";
import { GroupCommons } from "@/modules/group";

class Cinema extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {
    this.props.locationInfo.locationReady = () => {
      console.log("locationReady---cinema");
    };
  }
  render() {
    let { location, history, locationInfo } = this.props;
    console.log("location---", location);
    return (
      <div className="app-cinema-page">
        <div className="header-wrapper">
          <NavBar
            backArrow={false}
            right={
              <SearchOutline
                fontSize={20}
                onClick={() => {
                  history.push({
                    pathname: "/cinema/search",
                  });
                }}
              />
            }
            left={
              location.state && location.state.film_id ? (
                <LeftOutline
                  onClick={() => {
                    history.goBack();
                  }}
                />
              ) : (
                <div
                  className="navbar-wrapper"
                  onClick={() => {
                    history.push({
                      pathname: "/citys",
                    });
                  }}
                >
                  <span className="city-name">{locationInfo.city_name}</span>
                  <DownOutline
                    fontSize={12}
                    onClick={() => {
                      console.log("13124--DownOutline");
                    }}
                  />
                </div>
              )
            }
          >
            {location.state && location.state.film_id ? "长津湖" : "影院"}
          </NavBar>
          {location.state && location.state.film_id ? (
            <Tabs
              defaultActiveKey="vegetables"
              onChange={(val) => {
                console.log("onChange", val);
              }}
            >
              <Tabs.TabPane title="今天11月2日" key="fruits" />
              <Tabs.TabPane title="明天11月3日" key="vegetables" />
              <Tabs.TabPane title="后天11月4日" key="animals" />
            </Tabs>
          ) : null}

          <Dropdown>
            <Dropdown.Item
              key="all-city"
              title="全城"
              closeOnContentClick={true}
              closeOnMaskClick={true}
            >
              <Grid
                columns={4}
                gap={10}
                style={{
                  padding: "0.1rem",
                  "--gap-vertical": "0.15rem",
                }}
              >
                <Grid.Item>
                  <div className="area-wrapper active">番禺区</div>
                </Grid.Item>
                <Grid.Item>
                  <div className="area-wrapper">番禺区</div>
                </Grid.Item>
                <Grid.Item>
                  <div className="area-wrapper">番禺区</div>
                </Grid.Item>
                <Grid.Item>
                  <div className="area-wrapper">番禺区</div>
                </Grid.Item>
                <Grid.Item>
                  <div className="area-wrapper">番禺区</div>
                </Grid.Item>
              </Grid>
            </Dropdown.Item>
            <Dropdown.Item
              key="recently"
              title="最近去过"
              closeOnContentClick={true}
              closeOnMaskClick={true}
            >
              <CinemaListItem
                title="广州中影火山湖电影城东山口店"
                value="40"
                label="广州市越秀区农林下路4-6号锦轩现代城四楼飞机失联飞机老师"
                distance="距离未知"
              />
            </Dropdown.Item>
          </Dropdown>
        </div>
        <div
          style={{
            height:
              location.state && location.state.film_id ? "1.26rem" : "0.87rem",
          }}
        ></div>
        <PullToRefresh
          onRefresh={async () => {
            // fetchOptionsHot.page = 1;
            // this.setState(
            //   {
            //     fetchOptionsHot,
            //   },
            //   async () => {
            //     let result = await get_film_hot(fetchOptionsHot);
            //     this.setState(
            //       {
            //         hotList: result.rows,
            //       },
            //       () => {
            //         this.setState({
            //           isHotHasMore: true,
            //         });
            //       }
            //     );
            //     if (this.state.hotList.length >= result.count) {
            //       this.setState({
            //         isHotHasMore: false,
            //       });
            //     }
            //   }
            // );
          }}
        >
          <CinemaListItem
            title="广州中影火山湖电影城东山口店"
            value="40"
            label="广州市越秀区农林下路4-6号锦轩现代城四楼飞机失联飞机老师"
            distance="距离未知"
            onClick={() => {
              console.log("12345");
              this.props.history.push({
                pathname: "/cinema/detail",
                state: { cinema_id: 123 },
              });
            }}
          />

          <div style={{ height: "1rem" }}></div>

          <InfiniteScroll
            threshold="100"
            loadMore={async () => {
              // fetchOptionsHot.page += 1;
              // this.setState({ fetchOptionsHot });
              // let result = await get_film_hot(fetchOptionsHot);
              // this.setState({
              //   hotList:
              //     fetchOptionsHot.page === 1
              //       ? result.rows
              //       : hotList.concat(result.rows),
              // });
              // if (this.state.hotList.length >= result.count) {
              //   this.setState({
              //     isHotHasMore: false,
              //   });
              // }
            }}
            hasMore={false}
          />
        </PullToRefresh>
      </div>
    );
  }
}

export default GroupCommons(Cinema);
