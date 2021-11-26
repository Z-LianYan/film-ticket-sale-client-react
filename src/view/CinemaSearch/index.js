import React, { Component } from "react";
import "./index.scss";
import { Button } from "antd-mobile";
import CustomSearch from "@/components/CustomSearch/index";
import CinemaListItem from "@/components/CinemaListItem/index";
import { get_cinema_list } from "@/api/cinema";
import {
  InfiniteScroll,
  PullToRefresh,
} from "antd-mobile";
import InfiniteScrollContent from "@/components/InfiniteScrollContent/index";
import { GroupCommons } from "@/modules/group";

class CinemaSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue:'',
      isHasMore:false,
      list:[],
      fetchOptions: {
        page: 0,
        limit: 8,
        city_id: "",
        district_id: "",
        lat: "",
        lng: "",
        keywords:''
      },
      distanceRecentlyList:[]
    };
  }
  componentDidMount(){
    let { locationInfo } = this.props;
    if(locationInfo.lat && locationInfo.lng){
      this.onRefreshList(null,1)
    }
    this.props.locationInfo.locationReady = () => {
      this.onRefreshList(null,1)
    };
  }
  searchChange(val){
    console.log('val',val);
    this.onRefreshList(val)
  }

  async onRefreshList(val,type) {
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
          keywords:val
        });
        if(type){
          this.setState({
            distanceRecentlyList:result.rows.length?result.rows.slice(0,5):[]
          })
          console.log(this.state.distanceRecentlyList)
          return;
        }
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

  renderCinemaList(){
    let { isHasMore,list,fetchOptions } = this.state;
    return <PullToRefresh
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
              text="没有搜索到相关影城哦"
              noContent={!isHasMore && !this.state.list.length}
              hasMore={isHasMore}
            />
          </InfiniteScroll>
          <div style={{ height: "1rem" }}></div>
        </PullToRefresh>




  //   return <CinemaListItem
  //   title="广州中影火山湖电影城东山口店"
  //   value="40"
  //   label="广州市越秀区农林下路4-6号锦轩现代城四楼飞机失联飞机老师"
  //   distance="距离未知"
  //   onClick={()=>{
  //     history.push({
  //       pathname:'/cinema/detail',
  //       state:{
  //         cinema_id:123
  //       }
  //     })
  //   }}
  // />
  }

  render() {
    let { searchValue,distanceRecentlyList } = this.state;
    let { history } = this.props;
    return <div className="cinema-search-container">
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
        }}/>
        {
          searchValue?this.renderCinemaList():distanceRecentlyList.length?<div 
          className="distance-recently-wrapper">
            <h4 className="head-title">离你最近</h4>
            {
              distanceRecentlyList.map((item,index)=>{
                return <Button 
                color='default'
                key={item.id} 
                fill='none' 
                size="small" 
                style={{"--background-color":"#f4f4f4"}}
                onClick={()=>{
                  history.push({
                    pathname:'/cinema/detail',
                    state:{
                      cinema_id:item.id
                    }
                  })
                }}>
                  {item.name}
                </Button>
              })
            }
            
          </div>:null
          
          
        }
    </div>;
  }
}

export default GroupCommons(CinemaSearch);
