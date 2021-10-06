import React, { Component } from "react";
import "./index.scss";
import { IndexBar, List } from "antd-mobile";
import { get_city_list } from "@/api/citys";
class Citys extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cityList: [],
    };
  }
  componentDidMount() {
    get_city_list({}).then((res) => {
      console.log("城市列表", res);
      this.setState({
        cityList: res,
      });
    });
  }

  render() {
    let { cityList } = this.state;
    return (
      <div style={{ height: "100vh" }}>
        <IndexBar>
          {cityList.map((item, index) => {
            const { children, name } = item;
            return (
              <IndexBar.Panel index={`${index}`} title={name} key={index}>
                <List>
                  {children.map((it, idx) => (
                    <List.Item key={idx}>{it.name}</List.Item>
                  ))}
                </List>
              </IndexBar.Panel>
            );
          })}
        </IndexBar>
      </div>
    );
  }
}

export default Citys;
