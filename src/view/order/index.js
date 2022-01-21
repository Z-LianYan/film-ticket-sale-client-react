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
import { get_buy_ticket_detail, pay_order, get_order_list } from "@/api/order";
import { get_film_detail } from "@/api/film";
// import { get_city_district_list } from "@/api/citys";
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
        status: "",
      },
      list: [],
      isHasMore: false,
      // city_district_list: [],
      dateList: [
        { text: "全部", value: "" },
        { text: "待支付", value: 0 },
        { text: "已出票", value: 1 },
        { text: "已完成", value: 2 },
      ],
      dateActiveKey: 0,
      isSkeleton: true,
      // checkListDefaultValue: [""],
      // checkListDefaultLabel: "全部",
      // checkList: [
      //   { label: "全部", value: "" },
      //   { label: "最近去过", value: "zjqg" },
      // ],
      film_name: "",
    };
  }
  async componentDidMount() {
    let { location, locationInfo } = this.props;
    this.getData();
  }
  getData() {
    let { location, locationInfo, match } = this.props;
    let { params } = match;

    this.onRefresh();
  }
  // async getFilmInScheduleDates() {
  //   let { location, locationInfo, match, history } = this.props;
  //   let { params } = match;
  //   let { fetchOptions } = this.state;
  //   let _cookies = Cookies.get("locationInfo");
  //   let _cookiesInfo = null;
  //   if (_cookies) {
  //     _cookiesInfo = JSON.parse(_cookies);
  //   }
  //   let result = await get_film_in_schedule_dates({
  //     city_id:
  //       _cookiesInfo && _cookiesInfo.city_id
  //         ? _cookiesInfo.city_id
  //         : locationInfo.city_id,
  //     film_id: params && params.film_id,
  //   });
  //   // if (!result) return;
  //   if (!result || !result.rows.length) return history.goBack(); //无排片日期时返回
  //   fetchOptions.date = result.rows[0];
  //   fetchOptions.film_id = params && params.film_id;
  //   let film_detail_result = await get_film_detail({
  //     film_id: params && params.film_id,
  //   });
  //   this.setState({
  //     fetchOptions,
  //     film_name: film_detail_result.film_name,
  //     dateList: result.rows,
  //   });
  //   this.onRefresh();
  // }
  onRefresh() {
    this.setState({
      isHasMore: false, //防止执行 this.props.locationInfo.locationReady方法时 死循环
    });
    this.onRefreshList();
  }
  async onRefreshList() {
    let { fetchOptions } = this.state;
    fetchOptions.page = 1;
    this.setState(
      {
        fetchOptions,
      },
      async () => {
        let result = await get_order_list({
          ...fetchOptions,
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
  // async getDistrictList() {
  //   let { city_id } = this.props.locationInfo;
  //   let _cookies = Cookies.get("locationInfo");
  //   let _cookiesInfo = null;
  //   if (_cookies) {
  //     _cookiesInfo = JSON.parse(_cookies);
  //   }
  //   let result = await get_city_district_list({
  //     city_id:
  //       _cookiesInfo && _cookiesInfo.city_id ? _cookiesInfo.city_id : city_id,
  //   });
  //   result.rows.unshift({
  //     first_letter: null,
  //     id: "",
  //     is_hot: null,
  //     module_id: "",
  //     name: "全城",
  //     pinyin: "quanbu",
  //   });
  //   this.setState({
  //     city_district_list: result.rows,
  //   });
  // }
  // onDistrictName() {
  //   let { fetchOptions, city_district_list } = this.state;
  //   if (!fetchOptions.district_id) return "全城";
  //   return city_district_list.map((item) => {
  //     if (item.id == fetchOptions.district_id) {
  //       return item.name;
  //     }
  //   });
  // }

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
            left={
              <LeftOutline
                onClick={() => {
                  history.goBack();
                }}
              />
            }
          >
            订单列表
          </NavBar>

          <Tabs
            activeKey={dateActiveKey.toString()}
            onChange={(val) => {
              fetchOptions.status = dateList[val].value;
              this.setState({
                fetchOptions,
                dateActiveKey: val,
              });
              this.onRefresh();
            }}
            stretch={false}
            activeLineMode="auto"
          >
            {dateList.map((item, index) => {
              return <Tabs.Tab title={item.text} key={index} />;
            })}
          </Tabs>
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
