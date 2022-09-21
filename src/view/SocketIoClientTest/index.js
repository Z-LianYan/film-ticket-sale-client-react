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
import io from "socket.io-client";
class socketIoClientTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket:null
    };
  }
  componentDidMount(){
    // const socket = io('ws://localhost:7002/chat', { jsonp: false, transports: ['websocket'] });
    // init
    const socket = io('http://127.0.0.1:7002/test', {
      // 实际使用中可以在这里传递参数
      query: {
        room: 'demo',
        userId: `client_${Math.random()}`,
      },

      transports: ['websocket'],
    });

    socket.on('connect', () => {
      const id = socket.id;

      console.log('#connect,', id, socket);

      this.setState({
        socket
      })

      // 监听自身 id 以实现 p2p 通讯
      socket.on(id, (msg) => {
        console.log('#receive,', msg);
      });
      
    });

    // 接收在线用户信息
    socket.on('online', (msg) => {
      console.log('#online,', msg);
    });

    // 系统事件
    socket.on('disconnect', (msg) => {
      console.log('#disconnect', msg);
    });

    socket.on('disconnecting', () => {
      console.log('#disconnecting');
    });

    socket.on('error', () => {
      console.log('#error');
    });
    socket.on('res', (data) => {
      console.log('#res---',data);
    });

    
    
    
  }

  render() {
    let { history } = this.props;
    let { socket } = this.state;
    return <div className="">
      <NavBar
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            background: "#fff",
            "--height": "0.44rem",
            color: "#000",
          }}
          onBack={() => {
            history.goBack();
          }}
        >
          socket.io-client
        </NavBar>
        <div style={{height:'50px'}}></div>
        <div onClick={()=>{
          socket.emit('server','我是client事件');
          // console.log('123',socket);
        }}>
          123
        </div>
    </div>;
  }
}

export default socketIoClientTest;
