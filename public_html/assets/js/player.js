function  Player () {
    'use strict';
    /**
     * 
     * var a = '23';
     * console.log(!!a);
     */
    var _playerStanding = true,
        _framesCounter = 0,
        /**
         * INTERVAL_OF_FRAMESwird benutzt, um festzustellen, wie viel mal die Funktion von dem Objekt Player aufgerufen wurde.
         * Wii oft sollen sich die Frames von Player wechseln.
         */
        INTERVAL_OF_FRAMES = 9,
        _width = 71,
        _height = 102,
        TOP_DEFAULT = 314,
        _top = TOP_DEFAULT,
        LEFT_DEFAULT = 300,
        _left = 0,
        _indexRunPlayer = 0,
        _jumping  = false,
        _collision = false,
        Y_VELOCITY_DEFAULT = -30,
        _y_velocity = Y_VELOCITY_DEFAULT,
        X_VELOCITY_DEFAULT = 6,
        _x_velocity = X_VELOCITY_DEFAULT,
        STEP = 0.3,
        SPEED = 20,
        _flipedImage = false;

//    var GameStateEnum = {
//        Ready: 0,
//        Playing: 1,
//        GameOver: 2
//    };
//    _animation sprite_sheet frames
    var _sprite =  {
        name : 'player',
        type : 'image',
        spriteSources : [],
        shapes : [{
            top         : _top,
            left        : _left,
            width       : _width,
            height      : _height,
            flipedImage :  false,
            useSlice    : false
        }],
        frame : null
    };
    
    var _playerRun = [
        'assets/img/gamer/gamer_run1.png',
        'assets/img/gamer/gamer_run2.png',
        'assets/img/gamer/gamer_run3.png',
        'assets/img/gamer/gamer_run5.png',
        'assets/img/gamer/gamer_run6.png',
        'assets/img/gamer/gamer_run7.png'
    ];
        
    var _playerStand = [
        'assets/img/gamer/gamer_stand.png'
    ];
    
    var _playerFall = [
        'assets/img/gamer/gamer_fall1.png',
        'assets/img/gamer/gamer_fall2.png',
        'assets/img/gamer/gamer_fall3.png',
        'assets/img/gamer/gamer_fall4.png',
        'assets/img/gamer/gamer_fall5.png'
    ];

    /*
     * playerRun, playerStand, playerFall - die werden zu einem Array gefasst,
     * und sich in Cache bufindet. Aber besser in Programmcode diese als getrente
     * Elemente betrachten.
     * @type Number
     */
    function _getResources () {
        _sprite.spriteSources = _playerRun.concat(_playerStand, _playerFall);

        return _sprite;
    }

    function _move () {       
        if (_playerStanding) {
            _playerStanding = false;
        }

        if (MY_ControllerKey.left) {
            _flipedImage = true;// Bild umdrehen
            _left -= SPEED * STEP;

            _indexRunPlayer = flor(_indexRunPlayer) %  _sprite.spriteSources.length;
                        
            _indexRunPlayer += SPEED;
        }
        
        if (MY_ControllerKey.up) {
            //top -= SPEED * STEP;
        }
        
        if (MY_ControllerKey.right) {
            _flipedImage = false;// Bild umdrehen
            _left += SPEED * STEP;
            
             _indexRunPlayer = flor(_indexRunPlayer) %  _sprite.spriteSources.length;
                        
            _indexRunPlayer += SPEED;
            //console.log(left);
        }
        
        if (MY_ControllerKey.down) {
            //top += SPEED * STEP;
        }
        
        if (_left + _width >= MY_MapWidth) {
            _left = MY_MapWidth - _width;
        }
        
        if (_left < 0) {
            _left = 0;
        }
    }
    
    /**
     * _left bedeutet die Position auf dem Background.
     * playerPositionLeftInCanvas - Die Position im Canvas
     * @type Number
     */
    var playerPositionLeftInCanvas;
    var indexCollisionsFrames = 0;
    this.get = function () {
        //playerPositionLeftInCanvas = _left - MY_camera.xView;
        
        _sprite.shapes[0].left = _left;
        _sprite.shapes[0].flipedImage = (_flipedImage) ? true : false;

        //Wie schnell sollen die Bilder ausgetauscht werden.
//        if (_framesCounter >= INTERVAL_OF_FRAMES) {
//            _indexRunPlayer++;
//            if (_indexRunPlayer >= _playerRun.length) {
//                _indexRunPlayer = 0;
//            }
//            _framesCounter = 0;
//        }        
//        _framesCounter++;

        //Get Frame für Kollision
        //
        if (_collision) {
            //den letzten Frame anzeigen, wenn er runter gefallen ist.
            if (indexCollisionsFrames === _playerFall.length) {
                indexCollisionsFrames = _playerFall.length - 1;
            }
            else {
                _top += 6;
            }

            _sprite.frame = MY_Game_Resources.get(_playerFall[indexCollisionsFrames++]);
            
            _sprite.shapes[0].top = _top;
            
            return _sprite;
        }

        if (_playerStanding && !_jumping) {
            _sprite.frame = MY_Game_Resources.get(_playerStand[0]);
            
            _sprite.shapes[0].top = _top;
            
            return _sprite;
        }
        
        if (_jumping) {
            _y_velocity += 1.5;// gravity

            _top += _y_velocity;

            _y_velocity *= 0.9;
            
            if (_top > TOP_DEFAULT) {

              _jumping = false;

              _top = TOP_DEFAULT;
            }

            _sprite.frame = MY_Game_Resources.get(_playerRun[_indexRunPlayer]);

            if (MY_ControllerKey.right || MY_ControllerKey.left) {
                _x_velocity += 0.05;
                if (_flipedImage) {
                    _left -= _x_velocity;
                }
                else {
                    _left += _x_velocity;
                }
                _x_velocity *= 0.9;
            }

            _sprite.shapes[0].top = _top;

            return _sprite;
        }
        
        _sprite.frame = MY_Game_Resources.get(_playerRun[_indexRunPlayer]);       

        _sprite.shapes[0].top = TOP_DEFAULT;

        return _sprite;
    };

    function _jump () {
        if (_jumping === false) {
            _y_velocity = Y_VELOCITY_DEFAULT;
            _x_velocity = X_VELOCITY_DEFAULT;
            
            _jumping  = true;
        }
    }
    
    function _stop () {
        _playerStanding = true;
        _framesCounter = 0;//FPS Zähler
        _indexRunPlayer = 0;
    }
        
    this.move = function () {
        _move();
    };
    
    this.jump = function () {
        _jump();
    };
    
    this.stop = function () {
        _stop();
    };
    
    this.getResources = function () {
        return _getResources();
    };
    
//    this.isLoaded = function () {
//      return imagesLoaded;  
//    };

//    this.handleCollsionBehavior = function () {
//        playerFrames.fall[3].top += 4;
//        playerFrames.fall[4].top += 8;
//        playerFrames.fall[4].top += 12;
//        return playerFrames.fall;
//    };
    
    this.isPlayerStanding = function () {
        return _playerStanding;
    };
    
    this.isPlayerJumping = function () {
        return _jumping ;
    };
//    
//    this.checkCollision = function (enemy) {
//        var _enemy = enemy.get();
////        console.log(object);
////        return object + '--' + playerFrames.run[startPosGamer].left + playerWidth + 20;
//        if ((playerFrames.run[startPosGamer].top + playerHeight - 10) < _enemy.top) {
//            return false;
//        }
//        if (_enemy.left < (playerFrames.run[startPosGamer].left + playerWidth - 10)
//                &&
//           (_enemy.left + _enemy.width - 10) > (playerFrames.run[startPosGamer].left + 16))
//        {
//            collision = true;
//            
//            return true;
//        }
//        
//        return false;
//    };
    
    this.onCollision = function(callback) {
        _collision = true;
        
        callback(true);
    };
    
    this.getLeft = function() {
        return _left;
    };
    
    this.getTop = function() {
        return _top;
    };
    
    this.getWidth = function() {
        return _width;
    };
    
    this.getHeight = function() {
        return _height;
    };
    
    this.isFlippedImage = function() {
        return _flipedImage;
    };
    
    this.reset = function() {
        _top = TOP_DEFAULT;
        _left = LEFT_DEFAULT;
        _indexRunPlayer = 0;
        indexCollisionsFrames = 0;
        _collision = false;
    };
};

Player.prototype = new Actor();
Player.prototype.constructor = Player;