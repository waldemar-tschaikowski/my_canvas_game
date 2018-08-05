function Audio () {
    var context;
    var bufferLoader;
    var source;

    function finishedLoading(bufferList) {
      // Create two sources and play them both together.
      source = context.createBufferSource();
      source.buffer = bufferList[0];

      source.connect(context.destination);
      //source.start(0);
    }

    function BufferLoader(context, urlList, callback) {
      this.context = context;
      this.urlList = urlList;
      this.onload = callback;
      this.bufferList = new Array();
      this.loadCount = 0;
    }

    BufferLoader.prototype.loadBuffer = function(url, index) {
      // Load buffer asynchronously
      var request = new XMLHttpRequest();
      request.open("GET", url, true);
      request.responseType = "arraybuffer";

      var loader = this;

      request.onload = function() {
        // Asynchronously decode the audio file data in request.response
        loader.context.decodeAudioData(
          request.response,
          function(buffer) {
            if (!buffer) {
              alert('error decoding file data: ' + url);
              return;
            }
            loader.bufferList[index] = buffer;
            if (++loader.loadCount === loader.urlList.length)
              loader.onload(loader.bufferList);
          },
          function(error) {
            console.error('decodeAudioData error', error);
          }
        );
      };

      request.onerror = function() {
        alert('BufferLoader: XHR error');
      };

      request.send();
    };

    BufferLoader.prototype.load = function() {
      for (var i = 0; i < this.urlList.length; ++i)
      this.loadBuffer(this.urlList[i], i);
    };
    
    this.init = function() {
      // Fix up prefixing
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      context = new AudioContext();

      bufferLoader = new BufferLoader(
        context,
        [
          './assets/audio/shoot.ogg'
        ],
        finishedLoading
        );

      bufferLoader.load();
    };
    
    this.start = function () {
        source.start(0);
    };
    
    this.stop = function () {
        source.stop(0);
    };

}


