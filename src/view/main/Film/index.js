import React, { Component } from "react";
import "./index.scss";

import { get_film_hot } from "../../../api/film";
// import { Button, WhiteSpace } from "antd-mobile";
import { Button,Tabs } from "antd-mobile";
import { GroupCommons } from "@/modules/group";
import FilmListItem from "@/components/FilmListItem/index";



class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    get_film_hot({}).then((res) => {
      console.log("666", res);
    });
  }

  render() {
    let { userInfo, locationInfo, history } = this.props;

    console.log("history", this.props);
    return (
      <div className="app-film-container">
        <Tabs defaultActiveKey={'soon'}>
          <Tabs.TabPane title='正在热映' key='hot'>
            正在热映
            <FilmListItem/>
          </Tabs.TabPane>
          <Tabs.TabPane title='即将上映' key='soon'>
            即将上映
          </Tabs.TabPane>
        </Tabs>



        app-home
        <Button
          color="primary"
          onClick={() => {
            history.push("/citys");
          }}
        >
          Primary {locationInfo && locationInfo.name}
        </Button>
        <a href="/list">
          <i className="iconfont icon-yingyuan"></i>
          <span>影院 {!userInfo || userInfo.username}</span>
        </a>
      </div>
    );
  }
}

export default GroupCommons(Home);
