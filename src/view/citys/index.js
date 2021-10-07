import React, { Component } from "react";
import "./index.scss";
import { IndexBar, List, Search, Toast, NavBar } from "antd-mobile";
import { CloseOutline } from "antd-mobile-icons";
import { get_city_list } from "@/api/citys";
import ChinesePY from "@/utils/ChinesePY";

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
      hotList: [],
    };
  }
  componentDidMount() {
    let { letter } = this.state;
    get_city_list({}).then((res) => {
      let citys = res.rows;
      let hotList = res.hotList;
      for (let i = 0; i < citys.length; i++) {
        if (citys[i].id == 110000 || citys[i].id == 120000) {
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
      console.log("城市列表", citys);
      // console.log("66666", letter);
      this.setState({
        cityList: citys,
        hotList: hotList,
      });
    });
  }

  render() {
    let { cityList, letter, hotList } = this.state;
    return (
      <div>
        <NavBar
          back=""
          backArrow={<CloseOutline />}
          onBack={() => {
            console.log("返回");
          }}
        >
          当前城市 -
        </NavBar>
        <div style={{ height: "calc(100vh - 95px)" }}>
          <Search
            placeholder="输入城市名称"
            showCancelButton
            onSearch={(val) => {
              Toast.show(`你搜索了：${val}`);
            }}
            onClear={() => {
              Toast.show("清空内容");
            }}
            onCancel={() => {
              Toast.show("取消搜索");
            }}
            style={{
              "--border-radius": "3px",
              "--background": "#ffffff",
              background: "#f4f4f4",
              padding: "10px 15px",
            }}
          />

          <IndexBar sticky={false}>
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
                        onClick={() => {
                          console.log("热门城市", item.name);
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
                      <List.Item key={idx}>{it.name}</List.Item>
                    ))}
                  </List>
                </IndexBar.Panel>
              );
            })}
          </IndexBar>
        </div>
      </div>
    );
  }
}

export default Citys;
