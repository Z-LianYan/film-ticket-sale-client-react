import React, { Component } from "react";
import "./index.scss";
import { Button } from "antd-mobile";
import CustomSearch from "@/components/CustomSearch/index";
import CinemaListItem from "@/components/CinemaListItem/index";
import { get_cinema_list } from "@/api/cinema";
import { InfiniteScroll, PullToRefresh, SearchBar } from "antd-mobile";
import InfiniteScrollContent from "@/components/InfiniteScrollContent/index";
import { GroupCommons } from "@/modules/group";

class CinemaSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
      isHasMore: false,
      list: [],
      fetchOptions: {
        page: 0,
        limit: 8,
        city_id: "",
        district_id: "",
        lat: "",
        lng: "",
        keywords: "",
      },
      distanceRecentlyList: [],
    };
  }
  componentDidMount() {
    let { locationInfo } = this.props;
    if (locationInfo.lat && locationInfo.lng) {
      this.onRefreshList(null, 1);
    }
    // this.props.locationInfo.locationReady = () => {
    //   this.onRefreshList(null, 1);
    // };
  }
  searchChange(val) {
    this.onRefreshList(val);
  }

  async onRefreshList(val, type) {
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
          keywords: val,
        });
        // if (type) {
        this.setState({
          distanceRecentlyList: result.rows.length
            ? result.rows.slice(
                0,
                result.rows.length >= 5 ? 5 : result.rows.length
              )
            : [],
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

  renderCinemaList() {
    let { isHasMore, list, fetchOptions } = this.state;
    return (
      <PullToRefresh
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
                  pathname: "/cinema/detail",
                  state: { cinema_id: item.cinema_id },
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
            text="没有搜索到相关影城哦"
            noContent={!isHasMore && !this.state.list.length}
            hasMore={isHasMore}
          />
        </InfiniteScroll>
        <div style={{ height: "1rem" }}></div>
      </PullToRefresh>
    );
  }

  render() {
    let { searchValue, distanceRecentlyList } = this.state;
    let { history, locationInfo } = this.props;
    let { realLocation } = locationInfo;
    return (
      <div className="cinema-search-container">
        <CustomSearch
          value={searchValue}
          placeholder="输入影城名称"
          showCancelButton={true}
          onChange={(val) => {
            this.setState({
              searchValue: val,
            });
            this.searchChange(val);
          }}
          onClear={() => {
            this.setState({
              searchValue: "",
            });
          }}
          showCancelButton={true}
          onCancel={() => {
            history.goBack();
          }}
        />
        {searchValue ? (
          this.renderCinemaList()
        ) : distanceRecentlyList.length && realLocation ? (
          <div className="distance-recently-wrapper">
            <h4 className="head-title">离你最近</h4>
            {distanceRecentlyList.map((item, index) => {
              return (
                <Button
                  color="default"
                  key={item.cinema_id}
                  fill="none"
                  size="small"
                  style={{ "--background-color": "#f4f4f4" }}
                  onClick={() => {
                    history.push({
                      pathname: "/cinema/detail",
                      state: {
                        cinema_id: item.cinema_id,
                      },
                    });
                  }}
                >
                  {item.cinema_name}
                </Button>
              );
            })}
          </div>
        ) : null}
      </div>
    );
  }
  componentWillUnmount = () => {
    this.setState = (state, callback) => {
      return;
    };
  };
}

export default GroupCommons(CinemaSearch);
