import React, { Component } from "react";
import "./index.scss";
import {
  List,
  Image,
  Mask,
  NavBar,
  ImageViewer,
  Button,
  DotLoading,
  Input,
  Popup,
  Dialog,
  TextArea,
  Rate,
  ProgressBar,
} from "antd-mobile";
class ImageViewerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }
  componentDidMount() {
  }
  componentWillUnmount = () => {
    let { imgage_viewer_instance } = this.state;
    imgage_viewer_instance && imgage_viewer_instance.close();
  };

  render() {
    let { location,history, } = this.props;
    return <div className="still-mask-container">
      <NavBar
        onBack={() => {
          // this.setState({ isVisibleMask: false });
          history.goBack()
        }}
      >
        剧照（{location.state && location.state.imgs.length}）
      </NavBar>
      <div className="img-list">
        {location.state && location.state.imgs
          ? location.state.imgs.map((item, index) => {
            return (
              <div className="img-item" key={index}>
                <div className="img-wrapper">
                  <img
                    className="image"
                    src={item}
                    onClick={() => {
                      let imgage_viewer_instance = ImageViewer.Multi.show({
                        defaultIndex: index,
                        images: location.state.imgs,
                      });
                      this.setState({
                        imgage_viewer_instance,
                      })
                    }}
                  />
                </div>
              </div>
            );
          })
          : null}
      </div>
    </div>;
  }
}

export default ImageViewerComponent;
