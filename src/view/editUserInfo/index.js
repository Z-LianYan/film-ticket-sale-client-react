import React, { Component } from "react";
import "./index.scss";
import {
  List,
  Search,
  NavBar,
  Input,
  NumberKeyboard,
  Button,
  Toast,
  Image,
  Rate,
  TextArea,
  Avatar,
  Form,
  ImageUploader
} from "antd-mobile";
import { GroupCommons } from "@/modules/group/index";
// import { } from "antd-mobile-icons";
import { edit_user_info, get_user_info } from "@/api/user";
import { get_upload_qiuniu_config } from "@/api/common";
import * as qiniu from "qiniu-js";
import _ from "lodash";
import dayjs from "dayjs";

class EditUserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        nickname: "",
        avatar: [],
        qiniuConfig:{
          static_host:'',
          upload_token:''
        }
      },
    };
  }

  componentDidMount() {
    this.getUploadConfig();
    this.getUserInfo();
  }

  async onEditUserInfo() {
    let { location } = this.props;
    let { formData } = this.state;
    if (!formData.nickname)
      return Toast.show({
        duration: 1000,
        content: "用户名不能为空",
      });
    await edit_user_info({
      ...formData,
      avatar:formData.avatar[0].url
    });
    this.getUserInfo();
  }

  async getUserInfo() {
    let { formData } = this.state;
    let result = await get_user_info();
    if (!result) return;
    formData.nickname = result.nickname;
    formData.avatar = result.avatar?[{
      url: result.avatar
    }]:[];
    this.setState({
      formData,
    });
    this.props.login(result, () => { });
  }
  async getUploadConfig(){
    let result = await get_upload_qiuniu_config();
    // console.log('config',result);
    this.setState({
      qiniuConfig:result
    })
  }
  getExtName(str) {
    var index = str.lastIndexOf(".");
    return str.slice(index);
  }
  async onSumbitUpload(file) {
    return new Promise((resolve)=>{
      let { qiniuConfig } = this.state;
      const key = 'film/userAvatar/' + dayjs().format("YYYY-MM-DD") + "/" + Date.now() + _.random(9999, 9999999)
        + this.getExtName(file.name); // 上传后文件资源名以设置的 key 为主，如果 key 为 null 或者 undefined，则文件资源名会以 hash 值作为资源名。
      let config = {
        useCdnDomain: true, //表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
        region: qiniu.region.z2, // 根据具体提示修改上传地区,当为 null 或 undefined 时，自动分析上传域名区域
      };

      let putExtra = {
        fname: file.name, //文件原文件名
        params: {}, //用来放置自定义变量
        mimeType: null, //用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
      };
      console.log("key", key);
      let observable = qiniu.upload(
        file,
        key,
        qiniuConfig.upload_token,
        putExtra,
        config
      );
      observable.subscribe({
        next: (res) => {
          // 主要用来展示进度
          let total = res.total;
          // console.log("进度：" + parseInt(total.percent) + "% ");
        },
        error: (err) => {
          // 失败报错信息
          alert(err.message);
        },
        complete: (res) => {
          // 接收成功后返回的信息
          resolve(qiniuConfig.static_host + res.key)
        },
      });
    })
    
  }

  render() {
    let { history, location } = this.props;
    let { formData } = this.state;
    // console.log('formData----',formData)
    return (
      <div className="edit-user-info-container">
        <div className="header-wrapper">
          <NavBar
            style={{
              "--height": "0.44rem",
              fontWeight: "bold",
            }}
            left={
              <i
                className="iconfont icon-shouye"
                onClick={() => {
                  history.push("/");
                }}
                style={{ fontSize: "0.2rem" }}
              ></i>
            }
            onBack={() => {
              history.goBack();
            }}
          >
            <div className="comment-title">编辑会员信息</div>
          </NavBar>
        </div>
        <div style={{ height: "0.5rem" }}></div>
        <List mode='card'>
          <List.Item
            extra={
              <Input
                style={{background:'#f4f4f4',padding:'0.05rem',borderRadius:'0.1rem'}}
                placeholder="请输入用户名"
                maxLength={8}
                value={formData.nickname}
                clearable
                onChange={(val) => {
                  formData.nickname = val;
                  this.setState({
                    formData,
                  });
                }}
              />
            }
          >
            用户名
          </List.Item>
          <List.Item
            extra={
              <ImageUploader
                maxCount={1}
                accept='image/*'
                value={formData.avatar}
                onChange={(val) => {
                  console.log('onchange', val)
                  formData.avatar = val;
                  this.setState({
                    formData
                  })
                }}
                upload={async (file) => {
                  console.log('upload', file.name, URL.createObjectURL(file))
                  let url = await this.onSumbitUpload(file);
                  return {
                    url: url
                  }
                }}
                onDelete={(val) => {
                  formData.avatar = [];
                  this.setState({
                    formData
                  })
                }}
                beforeUpload={(files) => {
                  console.log('beforeUpload', files);
                  return files.filter(file => {
                    if (file.size > 1024 * 1024) {
                      Toast.show('请选择小于 1M 的图片')
                      return false
                    }
                    return true
                  })
                }}
              />
            }
          >
            头像
          </List.Item>
        </List>
        {/* <div style={{height:'0.1rem',background:'#fff'}}></div> */}

        <Button
          block
          color="primary"
          style={{ position: "fixed", bottom: "1rem" }}
          onClick={() => {
            this.onEditUserInfo();
          }}
        >
          编辑
        </Button>
      </div>
    );
  }
}

export default GroupCommons(EditUserInfo);
