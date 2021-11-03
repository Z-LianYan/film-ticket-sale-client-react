import React, { Component } from "react";
import "./index.scss";
import { Button } from "antd-mobile";
import CustomSearch from "@/components/CustomSearch/index";
import CinemaListItem from "@/components/CinemaListItem/index";

class CinemaSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue:''
    };
  }
  searchChange(val){

  }

  renderCinemaList(){
    let { history } = this.props;
    return <CinemaListItem
    title="广州中影火山湖电影城东山口店"
    value="40"
    label="广州市越秀区农林下路4-6号锦轩现代城四楼飞机失联飞机老师"
    distance="距离未知"
    onClick={()=>{
      history.push({
        pathname:'/cinema/detail',
        state:{
          cinema_id:123
        }
      })
    }}
  />
  }

  render() {
    let { searchValue } = this.state;
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
          searchValue?this.renderCinemaList():<div className="distance-recently-wrapper">
            <h4 className="head-title">离你最近</h4>
            <Button 
            color='default' 
            fill='none' 
            size="small" 
            style={{"--background-color":"#f4f4f4"}}
            onClick={()=>{
              history.push({
                pathname:'/cinema/detail',
                state:{
                  cinema_id:123
                }
              })
            }}>
              广州中影火山湖电影城东山口店
            </Button>
          </div>
        }
    </div>;
  }
}

export default CinemaSearch;
