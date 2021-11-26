import React, { Component } from "react";
import "./index.scss";
import { DownOutline, UpOutline } from "antd-mobile-icons";
import { List, Image, Mask, NavBar, ImageViewer,Button } from "antd-mobile";
import { get_film_detail } from "@/api/film";
class FileDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleMask: false,
      isShowNavBar: "",
      detail:{}
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
  async getFilmDetail(){
    let { history } = this.props;
    let { film_id } = history.location.state;
    console.log('film_id',film_id)
    let result = await get_film_detail({
      film_id:film_id
    });
    this.setState({
      detail:result
    })
    // this.detail = result;
    console.log('电影详情',result);
  }

  renderStill() {
    let { isVisibleMask,detail } = this.state;
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
          <div className="img-box">
            {
              detail && detail.stage_photo?detail.stage_photo.map((item,index)=>{
                return <Image
                  key={index}
                  className="image"
                  src={item}
                  width="33.33333%"
                  height="1.24rem"
                  fit="fill"
                  onClick={() => {
                    ImageViewer.Multi.show({
                      defaultIndex: 0,
                      images: detail.stage_photo,
                    });
                  }}
                />
              }):null
            }
          </div>
        </div>
      </Mask>
    );
  }

  render() {
    let { isShowNavBar,detail } = this.state;
    let { history } = this.props;
    return (
      <div className="film-detail-container">
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
          <img
            className="image"
            src={detail.poster_img}
            alt=""
          ></img>
        </div>
        <div className="film-detail">
          <div className="film-name-score">
            <h3 className="film-name">
              {detail.film_name} <span className="show-type">{detail.play_type}D</span>
            </h3>
            <span className="score-val">
              7.6<span className="score">分</span>
            </span>
          </div>

          <div className="record-film">纪录片</div>
          <div className="show-date"> {detail.show_time}上映 </div>
          <div className="area-and-play-time">中国大陆 | 93分钟</div>
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
          {
            detail&&detail.actors?detail.actors.map((item,index)=>{
              return <div key={index} className="actor-item">
                <Image
                  src={item.avatar}
                  width="100%"
                  height="1rem"
                  fit="fill"
                />
                <p className="name">{item.name}</p>
                <p className="role">{item.role}</p>
              </div>
            }):null
          }
        </div>
        <div className="separator"></div>
        <List.Item
          style={{
            "--adm-border-color": "transparent",
          }}
          extra={`全部(${detail.stage_photo?detail.stage_photo.length:0})`}
          onClick={() => {
            this.setState({ isVisibleMask: true });
            console.log("剧照");
          }}
        >
          剧照
        </List.Item>
        <div className="actors-wrapper">
          {/* <div className="actor-item still">
            <img
              className="image"
              src="https://pic.maizuo.com/usr/movie/34f3660dc618fc7d420b9997a8f6c377.jpg?x-oss-process=image/quality,Q_70"
              alt=""
            />
          </div>
          <div className="actor-item still">
            <img
              className="image"
              src="https://pic.maizuo.com/usr/2021/043db08398739865623b677ef36405d9.jpg?x-oss-process=image/quality,Q_70"
              alt=""
            />
          </div> */}
          {
            detail.stage_photo?detail.stage_photo.map((item,index)=>{
              return <div key={index} className="actor-item still">
                <img
                  className="image"
                  src={item}
                  alt=""
                />
              </div>
            }):null
          }
        </div>
        {this.renderStill()}
        <Button 
        style={{
          '--border-radius':0
        }}
        className="select-seat-buy-btn"  
        block 
        color='primary' 
        fill="solid" 
        size="large"
        onClick={()=>{
          history.push({
            pathname:'/film/cinema',
            state:{
              film_id:234
            }
          })
        }}>
          选座购票
        </Button>
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
