(function() {

  ////////*setting for api audio*/////////////
  var AudioContext;
  var audio;
  var audioContext;
  var source;
  var analyser;
  // var butter=[];

  var canvas = document.getElementById("theCanvas");
  var canvasContext = canvas.getContext("2d");    
  var dataArray;
  var analyserMethod = "getByteTimeDomainData";
  var slider = document.getElementById("slider");
  var streamUrl;
  var isIdle = true;

  var canvasWidth = canvas.width;
  var canvasHeight = canvas.height;

  function initAudio(streamUrl) {
    AudioContext = window.AudioContext || window.webkitAudioContext;
    audio = new Audio();
    audio.crossOrigin = "anonymous";
    audioContext = new AudioContext();
    source = audioContext.createMediaElementSource(audio);
    source.connect(audioContext.destination);
    analyser = audioContext.createAnalyser();            
    source.connect(analyser);
  };

  function get(url, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() { 
      if (request.readyState === 4 && request.status === 200) {
        callback(request.responseText);
      }
    }

    request.open("GET", url, true);            
    request.send(null);
  }

  var clientParameter = "client_id=3b2585ef4a5eff04935abe84aad5f3f3"
  var trackPermalinkUrl = "https://soundcloud.com/the-outsider/the-outsider-death-by-melody";

  function findTrack() {
    get("http://api.soundcloud.com/resolve.json?url=" +  trackPermalinkUrl + "&" + clientParameter,
        function (response) {
      var trackInfo = JSON.parse(response);
      slider.max = trackInfo.duration / 1000;
      document.getElementById("totalTime").innerHTML = millisecondsToHuman(trackInfo.duration);
      document.getElementById("artistUrl").href = trackInfo.user.permalink_url;
      document.getElementById("artistAvatar").src = trackInfo.user.avatar_url;
      document.getElementById("artistName").innerHTML = trackInfo.user.username;
      document.getElementById("trackUrl").href = trackInfo.permalink_url;
      if(trackInfo.artwork_url) {
        document.getElementById("trackArt").src = trackInfo.artwork_url;
      } else {
        document.getElementById("trackArt").src = "";
      }
      document.getElementById("trackName").innerHTML = trackInfo.title;
      streamUrl = trackInfo.stream_url + "?" + clientParameter;
    }
       );
  };

  function startDrawing() {
  ////////fft setting///////////
    analyser.fftSize = 2048;
    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);
    dataArray = new Uint8Array(bufferLength);
    function drawAgain() {
      requestAnimationFrame(drawAgain);
      analyser[analyserMethod](dataArray);
      FFTArray(dataArray);
      DrawLines();
    }
    drawAgain();
  }

  function startButton_Clicked() {
    audio.src = streamUrl;
    audio.play();
    slider.value = 0;
    setInterval(function () {
      slider.value = audio.currentTime; 
    }, 4000); 

    var currentTime = document.getElementById("currentTime");

    setInterval(function () {
      currentTime.innerHTML = millisecondsToHuman(audio.currentTime * 1000); 
    }, 1000);
  }

  function jumpTo(here) {
    if (!audio.readyState) return false;
    audio.currentTime = here;
  };

  slider.addEventListener("change", function () {
    jumpTo(this.value);
  });

  function millisecondsToHuman(milliseconds) {
    var date = new Date(null);
    date.setMilliseconds(milliseconds);
    return date.toISOString().substr(11, 8);
  };
  document.getElementById("playButton").addEventListener("click", startButton_Clicked);

  document.getElementById("oscilloscopeButton").addEventListener("click", function(){
    analyserMethod = "getByteTimeDomainData";
    startDrawing();
  });

  document.getElementById("frequencyBarsButton").addEventListener("click", function(){
    analyserMethod = "getByteFrequencyData";
    startDrawing();
  });

  document.getElementById("findButton").addEventListener("click", function(){
    trackPermalinkUrl = document.getElementById("trackUrlSearch").value;
    findTrack();
  });

  findTrack();
  initAudio();
  startDrawing();

  // init();
  // animate();

})();