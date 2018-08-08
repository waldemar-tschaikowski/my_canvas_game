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
        spriteSources : ['assets/img/spriter.png'],
        shapes : [],
        frame : []
    };
    
    var _stateRun = [
        {
            sTop        : 345,//1
            sLeft       : 75,
            top         : _top,
            left        : _left,
            width       : 87,
            height      : 112,
            dHeight     : 112,
            dWidth      : 87,
            useSlice    : false,
            flipedImage : false
        },
        {
            sTop        : 345,//2
            sLeft       : 160,
            top         : _top,
            left        : _left,
            width       : 97,
            height      : 112,
            dHeight     : 112,
            dWidth      : 97,
            useSlice    : false,
            flipedImage : false
        },
        {
            sTop        : 345,//3
            sLeft       : 257,
            top         : _top,
            left        : _left,
            width       : 97,
            height      : 112,
            dHeight     : 112,
            dWidth      : 97,
            useSlice    : false,
            flipedImage : false
        },
        {
            sTop        : 345,//4
            sLeft       : 354,
            top         : _top,
            left        : _left,
            width       : 87,
            height      : 112,
            dHeight     : 112,
            dWidth      : 87,
            useSlice    : false,
            flipedImage : false
        },
        {
            sTop        : 345,//5
            sLeft       : 447,
            top         : _top,
            left        : _left,
            width       : 93,
            height      : 112,
            dHeight     : 112,
            dWidth      : 93,
            useSlice    : false,
            flipedImage : false
        },
        {
            sTop        : 345,//6
            sLeft       : 540,
            top         : _top,
            left        : _left,
            width       : 91,
            height      : 112,
            dHeight     : 112,
            dWidth      : 91,
            useSlice    : false,
            flipedImage : false
        }
    ];
    
     var _stateStand = [
        {
            sTop        : 224,//1
            sLeft       : 75,
            top         : _top,
            left        : _left,
            width       : 86,
            height      : 99,
            dHeight     : 99,
            dWidth      : 86,
            useSlice    : false,
            flipedImage : false
        }
    ];
    
    var _stateDeath = [
        {
            sTop        : 715,//1
            sLeft       : 73,
            top         : _top,
            left        : _left,
            width       : 77,
            height      : 103,
            dHeight     : 103,
            dWidth      : 77,
            useSlice    : false,
            flipedImage : false
        },
        {
            sTop        : 715,//2
            sLeft       : 150,
            top         : _top,
            left        : _left,
            width       : 93,
            height      : 103,
            dHeight     : 103,
            dWidth      : 93,
            useSlice    : false,
            flipedImage : false
        },
        {
            sTop        : 715,//3
            sLeft       : 243,
            top         : _top,
            left        : _left,
            width       : 114,
            height      : 103,
            dHeight     : 103,
            dWidth      : 114,
            useSlice    : false,
            flipedImage : false
        },
        {
            sTop        : 715,//4
            sLeft       : 357,
            top         : _top,
            left        : _left,
            width       : 108,
            height      : 103,
            dHeight     : 103,
            dWidth      : 108,
            useSlice    : false,
            flipedImage : false
        },
        {
            sTop        : 715,//5
            sLeft       : 465,
            top         : _top,
            left        : _left,
            width       : 106,
            height      : 103,
            dHeight     : 103,
            dWidth      : 106,
            useSlice    : false,
            flipedImage : false
        },
        {
            sTop        : 834,//6
            sLeft       : 72,
            top         : _top,
            left        : _left,
            width       : 116,
            height      : 80,
            dHeight     : 80,
            dWidth      : 116,
            useSlice    : false,
            flipedImage : false
        },
        {
            sTop        : 834,//7
            sLeft       : 188,
            top         : _top,
            left        : _left,
            width       : 126,
            height      : 80,
            dHeight     : 80,
            dWidth      : 126,
            useSlice    : false,
            flipedImage : false
        },
        {
            sTop        : 834,//8
            sLeft       : 314,
            top         : _top,
            left        : _left,
            width       : 106,
            height      : 123,
            dHeight     : 80,
            dWidth      : 123,
            useSlice    : false,
            flipedImage : false
        },
        {
            sTop        : 834,//9
            sLeft       : 437,
            top         : _top,
            left        : _left,
            width       : 131,
            height      : 80,
            dHeight     : 80,
            dWidth      : 131,
            useSlice    : false,
            flipedImage : false
        },
    ];

    function _getResources() {
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