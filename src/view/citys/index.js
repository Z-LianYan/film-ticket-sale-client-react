import React, { Component } from "react";
import "./index.scss";
import { IndexBar, List, Search, Toast, NavBar } from "antd-mobile";
import { CloseOutline } from "antd-mobile-icons";
import { get_city_list } from "@/api/citys";
import ChinesePY from "@/utils/ChinesePY";
import logo from "@/static/svg/city.svg";
import { GroupCommons } from "@/modules/group";

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
    };
  }
  componentDidMount() {
    let { letter } = this.state;
    get_city_list({}).then((res) => {
      let citys = res.rows;
      let hotList = res.hotList;
      for (let i = 0; i < citys.length; i++) {
        if (citys[i].id === 110000 || citys[i].id === 120000) {
          //110000北京 120000天津
          let str = ChinesePY.getWordsCode(citys[i].name.substr(0, 1));
          // console.log("省", str);
          delete citys[i].children;
          letter[str].push(citys[i]);
        } else {
          let children = citys[i].children;
          // console.log("市", children);
          for (let j = 0; j < children.length; j++) {
            delete children[j].children;
            let str = ChinesePY.getWordsCode(children[j].name.substr(0, 1));
            letter[str].push(children[j]);
          }
        }
      }
      // console.log("城市列表", citys);
      // console.log("66666", letter);
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
        if (item.name.includes(val)) {
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
    this.props.setLocationInfo(item, () => {
      console.log("12340", this.props.locationInfo);
      history.goBack();
    });
  }

  render() {
    let { letter, hotList, searchValue, filterList } = this.state;
    let { history } = this.props;
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
          当前城市 -
        </NavBar>
        <Search
          value={searchValue}
          placeholder="输入城市名称"
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
                {filterList.map((item, index) => {
                  return (
                    <List.Item
                      key={index}
                      arrow={false}
                      onClick={() => {
                        console.log("onclick");
                      }}
                    >
                      {item.name}
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
}

export default GroupCommons(Citys);
