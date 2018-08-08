function  Player () {
    'use strict';
    /**
     * 
     * var a = '23';
     * console.log(!!a);
     */
    var _playerStanding = true,
        _width = 71,
        _height = 102,
        TOP_DEFAULT = 314,
        _top = TOP_DEFAULT,
        LEFT_DEFAULT = 300,
        _left = 0,
        _indexRunPlayer = 0,
        _indexCollisionsFrames = 0,
        _jumping  = false,//ob der Player sich in dem Sprungzustand befindet. In der Luft
        _collision = false,
        Y_VELOCITY_DEFAULT = -30,
        _y_velocity = Y_VELOCITY_DEFAULT,
        X_VELOCITY_DEFAULT = 6,
        _x_velocity = X_VELOCITY_DEFAULT,
        STEP = 20,
        SPEED = 0.2,
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
            flipedImage : false,
            useSlice    : false
        }],
        frame : null
    };
    
    var _playerRun = [
        'assets/img/gamer/gamer_run1.png',
        'assets/img/gamer/gamer_run2.png',
        'assets/img/gamer/gamer_run3.png',
        'assets/img/gamer/gamer_run4.png',
        'assets/img/gamer/gamer_run5.png',
        'assets/img/gamer/gamer_run6.png'
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
     * Elemente zu betrachten.
     * @type Number
     */
    function _getResources() {
        _sprite.spriteSources = _playerRun.concat(_playerStand, _playerFall);

        return _sprite;
    }

    function _move() {       
        if (_playerStanding) {
            _playerStanding = false;
        }

        if (MY_ControllerKey.left) {
            _flipedImage = true;// Bild umdrehen
            _left -= SPEED * STEP;
                        
            _indexRunPlayer += SPEED;
        }
        
        if (MY_ControllerKey.up) {
            //top -= SPEED * STEP;
        }
        
        if (MY_ControllerKey.right) {
            _flipedImage = false;// Bild umdrehen
            _left += SPEED * STEP;
            
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
     * 
     * @type Number
     */
    this.get = function() {
        _sprite.shapes[0].flipedImage = (_flipedImage) ? true : false;

        //Get Frame für Kollision
        if (_collision) {
            //den letzten Frame anzeigen, wenn er runter gefallen ist.
            if (_indexCollisionsFrames === _playerFall.length) {
                _indexCollisionsFrames = _playerFall.length - 1;
            }
            
            _top += 3;

            _sprite.frame = MY_Game_Resources.get(_playerFall[_indexCollisionsFrames++]);
            
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

            if (MY_ControllerKey.right || MY_ControllerKey.left) {
                _x_velocity += 0.25;
                
                if (_flipedImage) {
                    _left -= _x_velocity;
                }
                else {
                    _left += _x_velocity;
                }
                
                _x_velocity *= 0.9;
            }

            _sprite.shapes[0].top = _top;
        }
        else {
            _sprite.shapes[0].top = TOP_DEFAULT;
        }
        
        _sprite.shapes[0].left = _left;
        
        var index =  Math.floor(_indexRunPlayer) % _playerRun.length;

        _sprite.frame = MY_Game_Resources.get(_playerRun[index]);        

        return _sprite;
    };

    function _jump() {
        if (_jumping === false) {
            _y_velocity = Y_VELOCITY_DEFAULT;
            _x_velocity = X_VELOCITY_DEFAULT;
            
            _jumping  = true;// er ist gesprungen.
        }
    }
    
    function _stop() {
        _playerStanding = true;
        _indexRunPlayer = 0;
    }
        
    this.move = function() {
        _move();
    };
    
    this.jump = function() {
        _jump();
    };
    
    this.stop = function() {
        _stop();
    };
    
    this.getResources = function() {
        return _getResources();
    };
    
    this.isPlayerStanding = function() {
        return _playerStanding;
    };
    
    this.isPlayerJumping = function() {
        return _jumping ;
    };
    
    this.onCollision = function(callback) {
        _collision = true;
        
        callback(true);//Game Over
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
        _indexCollisionsFrames = 0;
        _collision = false;
        _jumping = false;
        _y_velocity = Y_VELOCITY_DEFAULT;
        _x_velocity = X_VELOCITY_DEFAULT;
        _playerStanding = true;
    };
};

Player.prototype = new Actor();
Player.prototype.constructor = Player;