import React, { Component, useRef } from "react";
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
  CheckList,
} from "antd-mobile";
import { GroupCommons } from "@/modules/group";
import { get_cinema_list, get_film_in_schedule_dates } from "@/api/cinema";
import { get_film_detail } from "@/api/film";
import { get_city_district_list } from "@/api/citys";
import InfiniteScrollContent from "@/components/InfiniteScrollContent/index";
import Cookies from "js-cookie";
import dayjs from "dayjs";
class Cinema extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchOptions: {
        page: 0,
        limit: 15,
        city_id: "",
        district_id: "",
        date: "",
        film_id: "",
        lat: "",
        lng: "",
        type: "",
      },
      list: [],
      isHasMore: false,
      city_district_list: [],
      dateList: [],
      dateActiveKey: 0,
      isSkeleton: true,
      checkListDefaultValue: [""],
      checkListDefaultLabel: "全部",
      checkList: [
        { label: "全部", value: "" },
        { label: "最近去过", value: "zjqg" },
      ],
      film_name: "",
    };
  }
  async componentDidMount() {
    let { location, locationInfo } = this.props;
    this.getDistrictList();
    locationInfo.locationReady = () => {
      this.getData();
    };

    if (!locationInfo.isInLocation) {
      this.getData();
    } else {
      setTimeout(() => {
        //防止浏览器定位慢的时候页面无内容
        if (this.state.isSkeleton) {
          this.getData();
        }
      }, 800);
    }
  }
  getData() {
    let { location, locationInfo, match } = this.props;
    let { params } = match;
    if (params && params.film_id) {
      this.getFilmInScheduleDates();
    } else {
      this.onRefresh();
    }
  }
  async getFilmInScheduleDates() {
    let { location, locationInfo, match } = this.props;
    let { params } = match;
    let { fetchOptions } = this.state;
    let _cookies = Cookies.get("locationInfo");
    let _cookiesInfo = null;
    if (_cookies) {
      _cookiesInfo = JSON.parse(_cookies);
    }
    let result = await get_film_in_schedule_dates({
      city_id:
        _cookiesInfo && _cookiesInfo.city_id
          ? _cookiesInfo.city_id
          : locationInfo.city_id,
      film_id: params && params.film_id,
    });
    if (!result) return;
    fetchOptions.date = result.rows[0];
    fetchOptions.film_id = params && params.film_id;
    let film_detail_result = await get_film_detail({
      film_id: params && params.film_id,
    });
    this.setState({
      fetchOptions,
      film_name: film_detail_result.film_name,
      dateList: result.rows,
    });
    this.onRefresh();
  }
  onRefresh() {
    this.setState({
      isHasMore: false, //防止执行 this.props.locationInfo.locationReady方法时 死循环
    });
    this.onRefreshList();
  }
  async onRefreshList() {
    let { fetchOptions, hotList } = this.state;
    let { match, locationInfo } = this.props;
    fetchOptions.page = 1;
    this.setState(
      {
        fetchOptions,
      },
      async () => {
        let result = await get_cinema_list({
          ...fetchOptions,
          city_id: locationInfo.city_id,
          lat: locationInfo.lat,
          lng: locationInfo.lng,
        });
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
    let result = await get_city_district_list({
      city_id:
        _cookiesInfo && _cookiesInfo.city_id ? _cookiesInfo.city_id : city_id,
    });
    result.rows.unshift({
      first_letter: null,
      id: "",
      is_hot: null,
      module_id: "",
      name: "全城",
      pinyin: "quanbu",
    });
    this.setState({
      city_district_list: result.rows,
    });
  }
  onDistrictName() {
    let { fetchOptions, city_district_list } = this.state;
    if (!fetchOptions.district_id) return "全城";
    return city_district_list.map((item) => {
      if (item.id == fetchOptions.district_id) {
        return item.name;
      }
    });
  }
  handerDate(date) {
    let today = dayjs().format("YYYY-MM-DD");
    let tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");
    let houtian = dayjs().add(2, "day").format("YYYY-MM-DD");
    let cur_y = dayjs(date).format("YYYY");
    let y = dayjs().format("YYYY");
    switch (dayjs(date).format("YYYY-MM-DD")) {
      case today:
        return "今天" + dayjs(date).format("MM月DD日");
      case tomorrow:
        return "明天" + dayjs(date).format("MM月DD日");
      case houtian:
        return "后天" + dayjs(date).format("MM月DD日");
      default:
        return (
          this.handleWeek(dayjs(date).day()) +
          dayjs(date).format(cur_y == y ? "MM月DD日" : "YY年MM月DD日")
        );
    }
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
  render() {
    let { location, history, locationInfo, match } = this.props;
    let { params } = match;
    let {
      list,
      fetchOptions,
      isHasMore,
      city_district_list,
      dateList,
      dateActiveKey,
      isSkeleton,
      checkListDefaultValue,
      checkListDefaultLabel,
      checkList,
      film_name,
    } = this.state;

    return (
      <div className="app-cinema-page">
        {location.pathname == "/cinemas" ? null : isSkeleton ? (
          <div className="skeleton-box"></div>
        ) : null}
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
              film_name ? (
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
                  <DownOutline fontSize={12} onClick={() => {}} />
                </div>
              )
            }
          >
            {film_name ? film_name : "影院"}
          </NavBar>
          {params && params.film_id ? (
            <Tabs
              activeKey={dateActiveKey.toString()}
              onChange={(val) => {
                fetchOptions.date = dateList[val];
                this.setState({
                  fetchOptions,
                  dateActiveKey: val,
                });
                this.onRefresh();
              }}
              stretch={false}
              activeLineMode="auto"
            >
              {dateList.map((date, index) => {
                return <Tabs.Tab title={this.handerDate(date)} key={index} />;
              })}
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
              title={checkListDefaultLabel}
              closeOnContentClick={true}
              closeOnMaskClick={true}
            >
              {/* <CinemaListItem
                title="广州中影火山湖电影城东山口店"
                value="40"
                label="广州市越秀区农林下路4-6号锦轩现代城四楼飞机失联飞机老师"
                distance="距离未知"
              /> */}
              <CheckList
                defaultValue={checkListDefaultValue}
                onChange={(res) => {
                  let { fetchOptions } = this.state;
                  this.checkListDefaultValue = res;
                  checkList.map((item) => {
                    if (item.value == res[0]) {
                      fetchOptions.type = res[0];
                      this.setState({
                        fetchOptions,
                        checkListDefaultLabel: item.label,
                      });
                      this.onRefresh();
                      return;
                    }
                  });
                }}
              >
                {checkList.map((item, index) => {
                  return (
                    <CheckList.Item key={index} value={item.value}>
                      {item.label}
                    </CheckList.Item>
                  );
                })}
                {/* <CheckList.Item value="zjqg">最近去过</CheckList.Item>
                <CheckList.Item value="lwzj">离我最近</CheckList.Item> */}
              </CheckList>
            </Dropdown.Item>
          </Dropdown>
        </div>
        <div
          style={{
            height: params && params.film_id ? "1.26rem" : "0.87rem",
          }}
        ></div>
        <PullToRefresh
          disabled={false}
          onRefresh={async () => {
            await this.onRefreshList();
          }}
        >
          {list.map((item, index) => {
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
              text={`该区域没有排${
                params && params.film_id ? "此" : ""
              }片的影院哦`}
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

export default GroupCommons(Cinema);
