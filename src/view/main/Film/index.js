import React, { Component } from "react";
import "./index.scss";

import { get_film_hot, get_film_soon_show } from "../../../api/film";
// import { Button, WhiteSpace } from "antd-mobile";
import { Button, Tabs, InfiniteScroll, PullToRefresh } from "antd-mobile";
import { GroupCommons } from "@/modules/group";
import FilmListItem from "@/components/FilmListItem/index";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hotList: [],
      soonShowList: [],
      floatTabs: false,
      activeTab: "hot",
    };
  }

  componentDidMount() {
    get_film_hot({}).then((res) => {
      console.log("正在热映", res);
      this.setState({
        hotList: res.rows,
      });
    });
    get_film_soon_show({}).then((res) => {
      console.log("即将上映", res);
      this.setState({
        soonShowList: res.rows,
      });
    });

    window.addEventListener("scroll", (e) => {
      var scrollTop =
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop;
      // console.log("1234", scrollTop);
      this.setState({
        floatTabs: scrollTop >= 200 ? true : false,
      });
    });
  }

  async loadMore() {
    await console.log("hasMore");
  }

  render() {
    // let { userInfo, locationInfo, history } = this.props;
    let { soonShowList, floatTabs, activeTab } = this.state;
    // console.log("soonShowList", soonShowList);
    // console.log("history", this.props);
    return (
      <div className="app-film-container">
        <Tabs
          defaultActiveKey={"hot"}
          className={[floatTabs ? "float-tabs-component" : ""]}
          onChange={(val) => {
            this.setState({ activeTab: val });
            console.log("history", this.state.activeTab, val);
          }}
        >
          <Tabs.TabPane title="正在热映" key="hot"></Tabs.TabPane>
          <Tabs.TabPane title="即将上映" key="soon"></Tabs.TabPane>
        </Tabs>

        <PullToRefresh
          onRefresh={async () => {
            console.log("下拉加载更多");
          }}
        >
          {activeTab == "soon"
            ? soonShowList.map((item, index) => {
                return (
                  <FilmListItem
                    key={item.id}
                    title={item.film_name}
                    playType={item.play_type + "D"}
                    score={item.grade}
                    actors={item.actors.map((item) => item.name).join(",")}
                    area={item.nation}
                    time={item.play_time + "分钟"}
                    imgUrl={item.poster_img}
                    separator={soonShowList.length == index + 1 ? false : true}
                  />
                );
              })
            : null}
        </PullToRefresh>

        <InfiniteScroll
          threshold="250"
          loadMore={async () => {
            await this.loadMore();
          }}
          hasMore={true}
        />

        <div style={{ height: "1rem" }}></div>
      </div>
    );
  }
}

export default GroupCommons(Home);
