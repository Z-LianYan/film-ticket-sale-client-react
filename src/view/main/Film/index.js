import React, { Component } from "react";
import "./index.scss";

import { get_film_hot, get_film_soon_show } from "../../../api/film";
// import { Button, WhiteSpace } from "antd-mobile";
import { Button, Tabs, InfiniteScroll, PullToRefresh } from "antd-mobile";
import { GroupCommons } from "@/modules/group";
import FilmListItem from "@/components/FilmListItem/index";
import dayjs from "dayjs";
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
  handleWeek(day){
    switch(day){
      case 0:
        return "周日"
        break;
      case 1:
        return "周一"
        break;
      case 2:
        return "周二"
        break;
      case 3:
        return "周三"
        break;
      case 4:
        return "周四"
        break;
      case 5:
        return "周五"
        break;
      case 6:
        return "周六"
        break;
    }
  }

  renderHot(){
    let { hotList } = this.state;
    return hotList.map((item, index) => {
      return (
        <FilmListItem
          key={item.id}
          title={item.film_name}
          playType={item.play_type_name}
          score={item.grade}
          actors={item.actors.map((item) => item.name).join(",")}
          bottomText={item.nation +" | "+ item.play_time+'分钟'}
          imgUrl={item.poster_img}
          separator={hotList.length == index + 1 ? false : true}
        />
      );
    })
  }
  renderSoon(){
    let { soonShowList } = this.state;
    return soonShowList.map((item, index) => {
      return (
        <FilmListItem
          key={item.id}
          title={item.film_name}
          playType={item.play_type_name}
          isShowScore={false}
          actors={item.actors.map((item) => item.name).join(",")}
          bottomText={'上映日期：' +this.handleWeek(dayjs(item.show_time).day())+' '+ dayjs(item.show_time).format('MM月DD日')}
          imgUrl={item.poster_img}
          separator={soonShowList.length == index + 1 ? false : true}
          btnColor='warning'
          btnTxt={item.isPresale?'预购':''}
        />
      );
    })
  }

  render() {
    // let { userInfo, locationInfo, history } = this.props;
    let { soonShowList, floatTabs, activeTab, hotList } = this.state;
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
          {activeTab == "hot" ? this.renderHot(): this.renderSoon()}
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
