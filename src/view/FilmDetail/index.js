import React, { Component } from "react";
import "./index.scss";
import { DownOutline, UpOutline } from "antd-mobile-icons";
import { List, Image, Mask, NavBar, ImageViewer, Button } from "antd-mobile";
import { get_film_detail } from "@/api/film";
class FileDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleMask: false,
      isShowNavBar: "",
      detail: {},
      isSkeleton: true,
    };
  }
  componentDidMount() {
    // let { history } = this.props;
    // let { location } = history;
    // console.log("props---", location.state);
    window.addEventListener("scroll", (e) => {
      var scrollTop = window.scrollY;
      // console.log("scrollTop", scrollTop);
      this.setState({
        isShowNavBar: scrollTop >= 20 ? true : false,
      });
    });
    this.getFilmDetail();
  }
  async getFilmDetail() {
    let { history } = this.props;
    let { film_id } = history.location.state;
    console.log("film_id", film_id);
    let result = await get_film_detail({
      film_id: film_id,
    });
    this.setState({
      detail: result,
      isSkeleton: false,
    });
    // this.detail = result;
    console.log("电影详情", result);
  }

  renderStill() {
    let { isVisibleMask, detail } = this.state;
    return (
      <Mask visible={isVisibleMask}>
        <div className="still-mask-container">
          <NavBar
            onBack={() => {
              this.setState({ isVisibleMask: false });
            }}
          >
            剧照（{detail.stage_photo && detail.stage_photo.length}）
          </NavBar>
          <div className="img-list">
            {detail && detail.stage_photo
              ? detail.stage_photo.map((item, index) => {
                  return (
                    <div className="img-item" key={index}>
                      <div className="img-wrapper">
                        <img
                          className="image"
                          src={item}
                          onClick={() => {
                            ImageViewer.Multi.show({
                              defaultIndex: index,
                              images: detail.stage_photo,
                            });
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      </Mask>
    );
  }

  render() {
    let { isShowNavBar, detail, isSkeleton } = this.state;
    let { history } = this.props;
    return (
      <div className="film-detail-container">
        {isSkeleton ? <div className="skeleton-box"></div> : null}
        <NavBar
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            background: isShowNavBar ? "#fff" : "",
            "--height": "0.44rem",
            color: "#000",
          }}
          onBack={() => {
            // this.setState({ isVisibleMask: false });
            history.goBack();
          }}
        >
          {isShowNavBar ? detail.film_name : ""}
        </NavBar>
        <div className="header-wrapper">
          <img className="image" src={detail.poster_img} alt=""></img>
        </div>
        <div className="film-detail">
          <div className="film-name-score">
            <h3 className="film-name">
              {detail.film_name}{" "}
              <span className="show-type">{detail.play_type_name}</span>
            </h3>
            <span className="score-val">
              {detail.grade}
              <span className="score">分</span>
            </span>
          </div>

          <div className="record-film">{detail.category_names}</div>
          <div className="show-date"> {detail.show_time}上映 </div>
          <div className="area-and-play-time">
            {detail.area} | {detail.runtime}分钟
          </div>
          <div className="abstract">
            <input id="label-input" className="label-input" type="checkbox" />
            <p className="text">
              <label className="label" htmlFor="label-input">
                <DownOutline className="down-out-line" />
                <UpOutline className="up-out-line" />
              </label>
              {detail.abstract}
            </p>
          </div>
        </div>
        <div className="separator"></div>
        <List.Item
          style={{
            "--adm-border-color": "transparent",
          }}
        >
          演员
        </List.Item>
        <div className="actors-wrapper">
          {detail && detail.actors
            ? detail.actors.map((item, index) => {
                return (
                  <div key={index} className="actor-item">
                    <img className="img" src={item.avatar} />
                    <p className="name">{item.name}</p>
                    <p className="role">{item.role}</p>
                  </div>
                );
              })
            : null}
        </div>
        <div className="separator"></div>
        <List.Item
          style={{
            "--adm-border-color": "transparent",
          }}
          extra={`全部(${detail.stage_photo ? detail.stage_photo.length : 0})`}
          onClick={() => {
            this.setState({ isVisibleMask: true });
            console.log("剧照");
          }}
        >
          剧照
        </List.Item>
        <div className="still-wrapper">
          {detail.stage_photo
            ? detail.stage_photo.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="still-item"
                    onClick={() => {
                      ImageViewer.Multi.show({
                        defaultIndex: index,
                        images: detail.stage_photo,
                      });
                    }}
                  >
                    <div className="photo-wrapper">
                      <img className="photo" src={item} alt="" />
                    </div>
                  </div>
                );
              })
            : null}
        </div>

        {this.renderStill()}

        {detail.hasSchedule ? (
          <Button
            style={{
              "--border-radius": 0,
            }}
            className="select-seat-buy-btn"
            block
            color="primary"
            fill="solid"
            size="large"
            onClick={() => {
              history.push({
                pathname: "/film/cinema",
                state: {
                  film_id: detail.id,
                },
              });
            }}
          >
            选座购票
          </Button>
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

export default FileDetail;
