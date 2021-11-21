import React, { Component } from "react";
import "./index.scss";
import { IndexBar, List, Search, NavBar } from "antd-mobile";
import { CloseOutline } from "antd-mobile-icons";
import { get_city_list } from "@/api/citys";
import logo from "@/static/svg/city.svg";
import { GroupCommons } from "@/modules/group";
import axios from "axios";

class Citys extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cityList: [],
      letter: {
        A: [],
        B: [],
        C: [],
        D: [],
        E: [],
        F: [],
        G: [],
        H: [],
        I: [],
        J: [],
        K: [],
        L: [],
        M: [],
        N: [],
        O: [],
        P: [],
        Q: [],
        R: [],
        S: [],
        T: [],
        U: [],
        V: [],
        W: [],
        X: [],
        Y: [],
        Z: [],
      },
      filterList: [],
      hotList: [],
      searchValue: "",
      currentCity: {},
    };
  }
  componentDidMount() {
    let { letter } = this.state;
    get_city_list({}).then((res) => {
      let citys = res.rows;
      let hotList = res.hotList;
      for (let i = 0; i < citys.length; i++) {
        if (citys[i].id === 110100 || citys[i].id === 120100) {
          //110100北京 120100天津
          delete citys[i].children;
          letter[citys[i].first_letter].push(citys[i]);
        } else {
          let children = citys[i].children;
          for (let j = 0; j < children.length; j++) {
            delete children[j].children;
            letter[children[j].first_letter].push(children[j]);
          }
        }
      }
      this.setState({
        cityList: citys,
        hotList: hotList,
      });
    });
  }
  searchChange(val) {
    let { letter } = this.state;
    this.setState({
      searchValue: val,
    });
    let filterList = [];
    for (let key in letter) {
      for (let item of letter[key]) {
        if (item.name.includes(val) || item.pinyin.includes(val)) {
          filterList.push(item);
        }
      }
    }
    this.setState({
      filterList,
    });
  }

  setLocationInfo(item) {
    let { history } = this.props;
    this.props.locationInfo.city_name = item.name;
    history.goBack();
  }

  render() {
    let { letter, hotList, searchValue, filterList } = this.state;
    let { history, locationInfo } = this.props;
    return (
      <div>
        <NavBar
          back=""
          backArrow={<CloseOutline />}
          onBack={() => {
            console.log("返回");
            history.goBack();
          }}
        >
          当前城市 - {locationInfo.city_name}
        </NavBar>
        <Search
          value={searchValue}
          placeholder="输入城市名称或拼音"
          showCancelButton
          onChange={(val) => {
            this.searchChange(val);
          }}
          onClear={() => {
            this.setState({
              searchValue: "",
            });
          }}
          onCancel={() => {
            this.setState({
              searchValue: "",
            });
          }}
          style={{
            "--border-radius": "3px",
            "--background": "#ffffff",
            background: "#f4f4f4",
            padding: "10px 15px",
            borderBottom: "1px solid #eee",
          }}
        />
        <div style={{ height: "calc(100vh - 98px)", overflowX: "hidden" }}>
          {searchValue ? (
            filterList.length ? (
              <List>
                {filterList.map((it, index) => {
                  return (
                    <List.Item
                      key={index}
                      arrow={false}
                      onClick={() => {
                        console.log("onclick");
                        this.setLocationInfo(it);
                      }}
                    >
                      {it.name}
                    </List.Item>
                  );
                })}
              </List>
            ) : (
              <div className="not-search-relative-info">
                <img src={logo} alt="svg" />
                <p>没有找到匹配的城市</p>
              </div>
            )
          ) : (
            <IndexBar sticky={true}>
              <div className="header-location-wrapper">
                <div className="row">
                  <p className="title">GPS定位你所在城市</p>
                  <div className="item-tag-wrapper">
                    <div className="item-tag">定位失败</div>
                  </div>
                </div>
                <div className="row">
                  <p className="title">热门城市</p>
                  <div className="item-tag-wrapper">
                    {hotList.map((item, index) => {
                      return (
                        <div
                          className="item-tag"
                          key={index}
                          onClick={async () => {
                            console.log("热门城市", item.name);
                            this.setLocationInfo(item);
                          }}
                        >
                          {item.name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              {Object.keys(letter).map((key, index) => {
                if (!letter[key].length) return;
                return (
                  <IndexBar.Panel index={`${key}`} title={key} key={key}>
                    <List>
                      {letter[key].map((it, idx) => (
                        <List.Item
                          key={idx}
                          clickable={false}
                          onClick={() => {
                            this.setLocationInfo(it);
                          }}
                        >
                          {it.name}
                        </List.Item>
                      ))}
                    </List>
                  </IndexBar.Panel>
                );
              })}
            </IndexBar>
          )}
        </div>
      </div>
    );
  }
  componentWillUnmount = () => {
    // axios.abort && axios.abort();
    this.setState = (state, callback) => {
      return;
    };
  };
}

export default GroupCommons(Citys);
