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
// import { get_city_district_list } from "@/api/citys";
import InfiniteScrollContent from "@/components/InfiniteScrollContent/index";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import DropdownFilter from "@/view/main/Cinemas/DropdownFilter/index";

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
    console.log('1234',this.props)
    let { location, locationInfo, socket } = this.props;
    // this.getDistrictList();
    if(socket){
      socket.on('refresh_cinema_list', (msg) => {
        console.log('#refresh_cinema_list,', msg);
      });
    }
    

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
    let { location, locationInfo, match, history } = this.props;
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
    // if (!result) return;
    if (!result || !result.rows.length) return history.goBack(); //无排片日期时返回
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
    let { match, locationInfo, userInfo } = this.props;
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
          user_id: userInfo && userInfo.user_id,
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
    let { location, history, locationInfo, match, userInfo } = this.props;
    let { params } = match;
    let {
      list,
      fetchOptions,
      isHasMore,
      dateList,
      dateActiveKey,
      isSkeleton,
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
          <DropdownFilter
            userInfo={userInfo}
            props={this.props}
            fetchOptions={fetchOptions}
            districtChange={(district_id) => {
              fetchOptions.district_id = district_id;
              this.setState({
                fetchOptions: fetchOptions,
                isHasMore: false,
              });
              this.onRefreshList();
            }}
            onCheckListChange={(type) => {
              fetchOptions.type = type;
              this.setState({
                fetchOptions,
              });
              this.onRefresh();
            }}
          />
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
