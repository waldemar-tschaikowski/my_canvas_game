function Resources() {
    var resourceCache = {};
//    var loading = [];
    var readyCallbacks = [];

    // Load an image url or an array of image urls
    function _load(urlOrArr) {
        //den gesamten Hindergrund
        if (urlOrArr.name === 'background') {
            var map = document.createElement("canvas").getContext("2d");

            map.canvas.width = MY_MapWidth;
            map.canvas.height = MY_MapHeight;

            resourceCache[urlOrArr.spriteSources[0]] = false;
            var img = new Image();
            
            img.src = urlOrArr.spriteSources[0];
            img.width = urlOrArr.shapes.background[0].width;
            img.height = urlOrArr.shapes.background[0].height;
            img.top = urlOrArr.shapes.background[0].top;
            img.left = urlOrArr.shapes.background[0].left;
            
            img.onload = function() {
                //readyCallbacks.forEach(function(func) { func(); });

                var left = 0;
                var width = urlOrArr.shapes.background[0].width;
                do {
                    map.drawImage(this, left, 0, urlOrArr.shapes.background[0].width, urlOrArr.shapes.background[0].height);

                    left += width;

                    if (left > MY_MapWidth) {
                        break;
                    }

                } while(true);

                var mapImage = new Image();

                mapImage.src = map.canvas.toDataURL("image/png");

                mapImage.onload = function () {
                    resourceCache[urlOrArr.spriteSources[0]] = mapImage;
                };

                map = null;
            };
  
            return;
        }

        if(urlOrArr.spriteSources instanceof Array) {
            for (var i = 0; i < urlOrArr.spriteSources.length; i++) {
                _loadExecute(urlOrArr.spriteSources[i]);
            }
        }
        else {
            _loadExecute(urlOrArr.spriteSources);
        }
    }

    function _loadExecute(url) {
        if (resourceCache[url]) {
            return resourceCache[url];
        }
        else {
            var img = new Image();
            img.onload = function() {
                resourceCache[url] = img;
            };
            resourceCache[url] = false;
            img.src = url;
        }
    }

    function _get(url) {
        return resourceCache[url];
    }

    function _isReady() {
        var ready = true;
        for(var k in resourceCache) {
            if(resourceCache.hasOwnProperty(k) &&
               !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    function _onReady(func) {
        readyCallbacks.push(func);
    }

    this.load = function(url) {
        _load(url);
    };
    
    this.get = function (url) {
        return _get(url);
    };
    
    this.debug = function () {
        console.log(resourceCache);
    };
    
    this.onReady = function (func) {
        _onReady(func);
    };
    
    this.isReady = function () {
        return _isReady();
    };
    
};