import React, { Component } from "react";
import "./index.scss";
import CinemaListItem from "@/components/CinemaListItem/index";
import { SearchOutline, DownOutline } from "antd-mobile-icons";
import {
  Button,
  InfiniteScroll,
  PullToRefresh,
  NavBar,
  Dropdown,
  Toast,
  Grid,
} from "antd-mobile";
class List extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="cinema-page">
        <div className="header-wrapper">
          <NavBar
            backArrow={false}
            right={<SearchOutline fontSize={20} />}
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
            影院
          </NavBar>
          <Dropdown>
            <Dropdown.Item
              key="all-city"
              title="全城"
              closeOnContentClick={true}
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
        <div style={{ height: "0.87rem" }}></div>
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

export default List;
