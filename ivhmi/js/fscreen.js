 window.isflsgrn = false;//ie11以下是否进入全屏标志，true为全屏状态，false为非全屏状态
window.ieIsfSceen = false;//ie11是否进入全屏标志，true为全屏状态，false为非全屏状态
  //跨浏览器返回当前 document 是否进入了可以请求全屏模式的状态
  function fullscreenEnable(){
    var isFullscreen = document.fullscreenEnabled ||
    window.fullScreen ||
    document.mozFullscreenEnabled ||
    document.webkitIsFullScreen;
    return isFullscreen;
  }
  //全屏
  var fScreen = function(){
    var docElm = document.documentElement;
    if (docElm.requestFullscreen) {
      docElm.requestFullscreen();
    }
    else if (docElm.msRequestFullscreen) {
      docElm.msRequestFullscreen();
      ieIsfSceen = true;
    }
    else if (docElm.mozRequestFullScreen) {
      docElm.mozRequestFullScreen();
    }
    else if (docElm.webkitRequestFullScreen) {
      docElm.webkitRequestFullScreen();
    }else {//对不支持全屏API浏览器的处理，隐藏不需要显示的元素
      window.parent.hideTopBottom();
      isflsgrn = true;
      $("fsbutton").text("FS");
    }
  }
  //退出全屏
  var cfScreen = function(){
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    }
    else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }else {
      window.parent.showTopBottom();
      isflsgrn = false;
      $("fsbutton").text("ESC");
    }
  }
  //全屏按钮点击事件
  $("fsbutton").click(function(){
    var isfScreen = fullscreenEnable();
    if(!isfScreen && isflsgrn == false){
      if (ieIsfSceen == true) {
        document.msExitFullscreen();
        ieIsfSceen = false;
        return;
      }
      fScreen();
    }else{
      cfScreen();
    }
  });
    
  //键盘操作
  $(document).keydown(function (event) {
    if(event.keyCode == 27 && ieIsfSceen == true){
      ieIsfSceen = false;
    }
  });
  //监听状态变化
  if (window.addEventListener) {
    document.addEventListener('fullscreenchange', function(){ 
      if($("fsbutton").text() == "ESC"){
        $("fsbutton").text("FS"); 
      }else{
        $("fsbutton").text("ESC");
      }
    });
    document.addEventListener('webkitfullscreenchange', function(){ 
      if($("fsbutton").text() == "ESC"){
        $("fsbutton").text("FS"); 
      }else{
        $("fsbutton").text("ESC");
      }
    });
    document.addEventListener('mozfullscreenchange', function(){ 
      if($("fsbutton").text() == "ESC"){
        $("fsbutton").text("FS"); 
      }else{
        $("fsbutton").text("ESC");
      }
    });
    document.addEventListener('MSFullscreenChange', function(){ 
      if($("fsbutton").text() == "ESC"){
        $("fsbutton").text("FS"); 
      }else{
        $("fsbutton").text("ESC");
      }
    });
  }
 