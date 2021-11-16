
let obj = {};
obj.geolocation =  function({onComplete,onError}){
    const AMap = window.AMap;
    // var map = new AMap.Map('map-container', {
    //   viewMode: '3D', // 默认使用 2D 模式，如果希望使用带有俯仰角的 3D 模式，请设置 viewMode: '3D',
    //   zoom: 11,//[23.01185,113.38798]
    // });
    AMap.plugin('AMap.Geolocation', function() {
        var geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：5s
            position:'RB',    //定位按钮的停靠位置
            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点
        });
        // map.addControl(geolocation);
        geolocation.getCurrentPosition(function(status,result){
          console.log('result--定位status',status)
            if(status=='complete'){
            //   console.log('result--定位完成',result)
                // onComplete(result)
                // alert(JSON.stringify(result))
                onComplete && onComplete(result)
            }else{
              console.log('result--定位失败',result)
              onError && onError(result)
            }
        });
    });
}

export default obj;