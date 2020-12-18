/* globals app */

app.controller("TorrentsController", function($scope, $rootScope, api, $sce) {
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
    var fileName = paths[paths.length -  1].trim().replace(/ /g,'');
    console.log('fileName',fileName);
    console.log('hash',hash);
    console.log('index',index);
    if(!$scope.showPreview) {
      $scope.videoSrc = $sce.trustAsResourceUrl('http://158.101.101.162:8080/getData?fileIndex='+ index + '&id=' + hash + '&fileName=' + fileName);
    } else {
      $scope.videoSrc = null;
    }
    $scope.showPreview = !$scope.showPreview;
  };

  $scope.onVideoElementLoaded = function() {
    var options = {};
      var player = videojs('my-player', options, function onPlayerReady() {
        videojs.log('Your player is ready!');

        // In this context, `this` is the player that was created by Video.js.
        this.play();

        // How about an event listener?
        this.on('ended', function() {
          videojs.log('Awww...over so soon?!');
        });
      });
  };
});
