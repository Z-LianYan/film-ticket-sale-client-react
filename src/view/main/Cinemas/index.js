import React, { Component } from "react";
import "./index.scss";
import CinemaListItem from "@/components/CinemaListItem/index";
import { SearchOutline, DownOutline, LeftOutline } from "antd-mobile-icons";
import {
  InfiniteScroll,
  PullToRefresh,
  NavBar,
  Dropdown,
  Grid,
  Tabs,
} from "antd-mobile";
import { GroupCommons } from "@/modules/group";
import { get_cinema_list } from "@/api/cinema";
import { get_city_district_list } from "@/api/citys";
import InfiniteScrollContent from "@/components/InfiniteScrollContent/index";
import Cookies from "js-cookie";

class Cinema extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchOptions: {
        page: 0,
        limit: 15,
        city_id: "",
        district_id: "",
        lat: "",
        lng: "",
      },
      list: [],
      isHasMore: true,
      city_district_list: [],
    };
  }
  async componentDidMount() {
    this.getDistrictList();
    this.props.locationInfo.locationReady = () => {
      console.log("locationReady---cinema");
      this.onRefresh();
    };
  }
  onRefresh() {
    this.setState({
      isHasMore: false, //防止执行 this.props.locationInfo.locationReady方法时 死循环
    });
    this.onRefreshList();
    
  }
  async onRefreshList() {
    let { fetchOptions, hotList } = this.state;
    fetchOptions.page = 1;
    this.setState(
      {
        fetchOptions,
      },
      async () => {
        let result = await get_cinema_list({
          ...fetchOptions,
          city_id: this.props.locationInfo.city_id,
          lat: this.props.locationInfo.lat,
          lng: this.props.locationInfo.lng,
        });
        this.setState(
          {
            list: result.rows,
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
      }
    );
  }
  async getDistrictList() {
    let { city_id } = this.props.locationInfo;
    let _cookies = Cookies.get("locationInfo");
    let _cookiesInfo = null;
    if (_cookies) {
      _cookiesInfo = JSON.parse(_cookies);
    }
    let result = await get_city_district_list({ city_id: (_cookiesInfo && _cookiesInfo.city_id)?_cookiesInfo.city_id:city_id });
    console.log("result---", result);
    result.rows.unshift({
      first_letter: null,
      id: "",
      is_hot: null,
      module_id: "",
      name: "全部",
      pinyin: "quanbu",
    });
    this.setState({
      city_district_list: result.rows,
    });
  }
  onDistrictName(){
    let { fetchOptions,city_district_list } = this.state;
    if(!fetchOptions.district_id) return '全城'
    return city_district_list.map(item=>{
      if(item.id == fetchOptions.district_id){
        return item.name
      }
    })
  }
  render() {
    let { location, history, locationInfo } = this.props;
    let { list, fetchOptions, isHasMore, city_district_list } = this.state;
    // console.log("location---", location);
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
              <Tabs.Tab title="今天11月2日" key="fruits" />
              <Tabs.Tab title="明天11月3日" key="vegetables" />
              <Tabs.Tab title="后天11月4日" key="animals" />
            </Tabs>
          ) : null}

          <Dropdown>
            <Dropdown.Item
              key="all-city"
              title={this.onDistrictName()}
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
                {city_district_list.map((item, index) => {
                  return (
                    <Grid.Item
                      key={index}
                      onClick={() => {
                        console.log("1234");
                        let { fetchOptions } = this.state;
                        fetchOptions.district_id = item.id;
                        this.setState({
                          fetchOptions: fetchOptions,
                          isHasMore: false,
                        });
                        this.onRefreshList();
                      }}
                    >
                      <div
                        className={[
                          `area-wrapper ${
                            this.state.fetchOptions.district_id == item.id
                              ? "active"
                              : ""
                          }`,
                        ]}
                      >
                        {item.name}
                      </div>
                    </Grid.Item>
                  );
                })}
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
            await this.onRefreshList();
          }}
        >
          {list.map((item, index) => {
            return (
              <CinemaListItem
                key={index}
                title={item.name}
                value={item.low_price}
                label={item.address}
                distance={item.distance}
                onClick={() => {
                  console.log("12345");
                  this.props.history.push({
                    pathname: "/cinema/detail",
                    state: { cinema_id: item.id },
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
              let result = await get_cinema_list({
                ...fetchOptions,
                city_id: this.props.locationInfo.city_id,
                lat: this.props.locationInfo.lat,
                lng: this.props.locationInfo.lng,
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
              text="此区域没有影院哦"
              noContent={!isHasMore && !this.state.list.length}
              hasMore={isHasMore}
            />
          </InfiniteScroll>
          <div style={{ height: "1rem" }}></div>
        </PullToRefresh>
      </div>
    );
  }
}

export default GroupCommons(Cinema);
