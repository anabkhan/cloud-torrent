/* globals app */

app.controller("TorrentsController", function($scope, $rootScope, api, $sce, $window) {
  $rootScope.torrents = $scope;

  $scope.submitTorrent = function(action, t) {
    api.torrent([action, t.InfoHash].join(":"));
  };

  $scope.submitFile = function(action, t, f) {
    api.file([action, t.InfoHash, f.Path].join(":"));
  };

  $scope.downloading = function(f) {
    return f.Completed > 0 && f.Completed < f.Chunks;
  };

  $scope.isVideo = function(path) {
    return /\.(mp4|mkv|mov)$/.test(path);
  };

  $scope.streamVideo = function(t,f,hash,index) {
    console.log('t',t);
    console.log('f',f);
    const paths = f.Path.split('/');
    $scope.fileName = paths[paths.length -  1].trim().replace(/ /g,'');
    $scope.type = 'video/' + $scope.fileName.split('.').pop();
    console.log('fileName',$scope.fileName);
    console.log('hash',hash);
    console.log('index',index);
    if(!$scope.showPreview) {
      $scope.videoSrc = $sce.trustAsResourceUrl('http://158.101.101.162:8080/getData?fileIndex='+ index + '&id=' + hash + '&fileName=' + $scope.fileName);
    } else {
      $scope.videoSrc = '';
      var video = document.querySelector("video");
      if(video) { video.pause() }
      $scope.player = null;
    }
    $scope.showPreview = !$scope.showPreview; 
  };

  $scope.getVideoSrcForMX = function(t,f,hash,index) {
    const paths = f.Path.split('/');
    var fileName = paths[paths.length -  1].trim().replace(/ /g,'');
    var url = '158.101.101.162:8080/getData?fileIndex='+ index + '&id=' + hash + '&fileName=' + fileName;
    var intentUrl =  "intent:" + "http://devimages.apple.com/iphone/samples/bipbop/bipbopall.m3u8" +"#Intent;package=com.mxtech.videoplayer.ad;S.title=" + fileName + ";end";
    return intentUrl;
  };

  $scope.getFileName = function(t,f,hash,index) {
    const paths = f.Path.split('/');
    var fileName = paths[paths.length -  1].trim().replace(/ /g,'');
    return fileName;
  };

  $scope.shareVideo = function(t,f,hash,index) {
    const paths = f.Path.split('/');
    var fileName = paths[paths.length -  1].trim().replace(/ /g,'');
    var url = 'http://158.101.101.162:8080/getData?fileIndex='+ index + '&id=' + hash + '&fileName=' + fileName;
    console.log('navigator', $window.navigator);
    const navigator = $window.navigator;
    if (navigator.share) { 
    navigator.share({
        title: 'Share Video',
        url: url
      }).then(() => {
        console.log('Thanks for sharing!');
      })
      .catch(console.error);
      } else {
          // shareDialog.classList.add('is-open');
          // copying to clipboard
          var input = document.createElement('textarea');
          input.innerHTML = url;
          document.body.appendChild(input);
          input.select();
          var result = document.execCommand('copy');
          document.body.removeChild(input);
          window.prompt("Copy to clipboard: Ctrl+C, Enter", url);
      }
  };

  $scope.onVideoElementLoaded = function() {
    if(!$scope.player) {
      document.querySelector("video > source").type = getVideoMimeType($scope.fileName);
      console.log('video type ', $scope.fileName.split('.').pop());
      $scope.player = videojs('my-player', {}, function onPlayerReady() {
        videojs.log('Your player is ready!');

        // In this context, `this` is the player that was created by Video.js.
        this.play();

        // How about an event listener?
        this.on('ended', function() {
          videojs.log('Awww...over so soon?!');
        });
      });

      $scope.player.on('progress', () => {
        var buffPerc = $scope.player.bufferedPercent();
        console.log('Buffered Percentage',buffPerc);
      });
    }
  };

  function getVideoMimeType(fileName) {
    var extension = fileName.split('.').pop();
    if(extension === 'mkv') {
      return 'video/webm';
    } else {
      return 'video/' + extension;
    }
  }

  $scope.onKeyPress = function(event) {
    console.log('key pressed', event)
    if($scope.player) {
      switch(event.which) {
        case 39:
        console.log($scope.player.currentTime())
          $scope.player.currentTime($scope.player.currentTime() + 10);
          event.stopImmediatePropagation();
          break;
        case 37:
          $scope.player.currentTime($scope.player.currentTime() - 10);
          event.stopImmediatePropagation();
          break;
        case 38:
        console.log($scope.player.volume())
          $scope.player.volume($scope.player.volume() + 0.1);
          event.stopImmediatePropagation();
          break;
        case 40:
          $scope.player.volume($scope.player.volume() - 0.1);
          event.stopImmediatePropagation();
          break;
      }
    }
  };
});

angular.module('app').config(['$compileProvider', function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|local|data|chrome-extension|intent):/);
}]);