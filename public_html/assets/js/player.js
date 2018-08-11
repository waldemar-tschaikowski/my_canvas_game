function  Player () {
    'use strict';

    //------privaten Bereich-------

    var _playerStanding = true,
        _width = 71,
        _height = 102,
        TOP_DEFAULT = 314,
        _top = TOP_DEFAULT,
        LEFT_DEFAULT = 300,
        _left = 0,
        _indexRunPlayer = 0,
        _indexCollisionsCounter = 0,
        _indexSittingCounter = 0,
        _indexJumpPlayer = 0,
        _jumping  = false,//ob der Player sich in dem Sprungzustand befindet. In der Luft
        _sitting = false,
        _collision = false,
        Y_VELOCITY_DEFAULT = -30,
        _y_velocity = Y_VELOCITY_DEFAULT,
        X_VELOCITY_DEFAULT = 6,
        _x_velocity = X_VELOCITY_DEFAULT,
        STEP = 20,
        SPEED = 0.2,
        _useLeftDirection = false;

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
        shapes : {
            player : []
        },
        images : {
            player : null
        }
    };
    
    var _stateRunRight = [
        {
            sTop        : 345,//1
            sLeft       : 66,
            width       : 94,
            height      : 112
        },
        {
            sTop        : 345,//2
            sLeft       : 162,
            width       : 98,
            height      : 112
        },
        {
            sTop        : 345,//3
            sLeft       : 256,
            width       : 93,
            height      : 112
        },
        {
            sTop        : 345,//4
            sLeft       : 349,
            width       : 92,
            height      : 112
        },
        {
            sTop        : 345,//5
            sLeft       : 444,
            width       : 96,
            height      : 112
        },
        {
            sTop        : 345,//6
            sLeft       : 537,
            width       : 92,
            height      : 112
        }
    ];
    
     var _stateRunLeft = [
        {
            sTop        : 345,//1
            sLeft       : 1110,
            width       : 97,
            height      : 112
        },
        {
            sTop        : 345,//2
            sLeft       : 1012,
            width       : 98,
            height      : 112
        },
        {
            sTop        : 345,//3
            sLeft       : 919,
            width       : 92,
            height      : 112
        },
        {
            sTop        : 345,//4
            sLeft       : 826,
            width       : 92,
            height      : 112
        },
        {
            sTop        : 345,//5
            sLeft       : 731,
            width       : 95,
            height      : 112
        },
        {
            sTop        : 345,//6
            sLeft       : 639,
            width       : 92,
            height      : 112
        }
    ];
    
     var _stateStandRight = [
        {
            sTop        : 224,//1
            sLeft       : 75,
            width       : 86,
            height      : 99
        }
    ];
    
    var _stateStandLeft = [
        {
            sTop        : 224,//1
            sLeft       : 1110,
            width       : 97,
            height      : 119
        }
    ];
    
    var _stateDeathRight = [
        {
            sTop        : 715,//1
            sLeft       : 73,
            width       : 77,
            height      : 103
        },
        {
            sTop        : 715,//2
            sLeft       : 150,
            width       : 93,
            height      : 103
        },
        {
            sTop        : 715,//3
            sLeft       : 243,
            width       : 114,
            height      : 103
        },
        {
            sTop        : 715,//4
            sLeft       : 357,
            width       : 108,
            height      : 103
        },
        {
            sTop        : 715,//5
            sLeft       : 465,
            width       : 106,
            height      : 103
        },
        {
            sTop        : 834,//6
            sLeft       : 72,
            width       : 116,
            height      : 80
        },
        {
            sTop        : 834,//7
            sLeft       : 188,
            width       : 126,
            height      : 80
        },
        {
            sTop        : 834,//8
            sLeft       : 314,
            width       : 123,
            height      : 80
        },
        {
            sTop        : 834,//9
            sLeft       : 437,
            width       : 131,
            height      : 80
        }
    ];
    
    var _stateDeathLeft = [
        {
            sTop        : 715,//1
            sLeft       : 1120,
            width       : 83,
            height      : 103
        },
        {
            sTop        : 715,//2
            sLeft       : 1026,
            width       : 93,
            height      : 103
        },
        {
            sTop        : 715,//3
            sLeft       : 915,
            width       : 110,
            height      : 103
        },
        {
            sTop        : 715,//4
            sLeft       : 806,
            width       : 108,
            height      : 103
        },
        {
            sTop        : 715,//5
            sLeft       : 694,
            width       : 112,
            height      : 103
        },
        {
            sTop        : 834,//6
            sLeft       : 1087,
            width       : 116,
            height      : 80
        },
        {
            sTop        : 834,//7
            sLeft       : 957,
            width       : 126,
            height      : 80
        },
        {
            sTop        : 834,//8
            sLeft       : 835,
            width       : 123,
            height      : 80
        },
        {
            sTop        : 834,//9
            sLeft       : 699,
            width       : 131,
            height      : 80
        }
    ];
    
    
    var _shapesJumpRight = [
        {
            sTop        : 582,//1
            sLeft       : 66,
            width       : 114,
            height      : 120
        },
        {
            sTop        : 582,//2
            sLeft       : 180,
            width       : 100,
            height      : 120
        },
        {
            sTop        : 582,//3
            sLeft       : 281,
            width       : 98,
            height      : 120
        },
        {
            sTop        : 582,//4
            sLeft       : 379,
            width       : 102,
            height      : 120
        },
        {
            sTop        : 582,//5
            sLeft       : 482,
            width       : 98,
            height      : 120
        }
    ];
    
    var _shapesJumpLeft = [
        {
            sTop        : 582,//1
            sLeft       : 1106,
            width       : 98,
            height      : 120
        },
        {
            sTop        : 582,//2
            sLeft       : 991,
            width       : 114,
            height      : 120
        },
        {
            sTop        : 582,//3
            sLeft       : 891,
            width       : 100,
            height      : 120
        },
        {
            sTop        : 582,//4
            sLeft       : 791,
            width       : 99,
            height      : 120
        },
        {
            sTop        : 582,//5
            sLeft       : 690,
            width       : 101,
            height      : 120
        }
    ];

    var _stateSittingRight = [
        {
            sTop        : 463,//1
            sLeft       : 77,
            top         : 340,
            width       : 86,
            height      : 108
        },
        {
            sTop        : 474,//2
            sLeft       : 188,
            top         : 342,
            width       : 85,
            height      : 98
        },
        {
            sTop        : 490,//3
            sLeft       : 288,
            top         : 345,
            width       : 83,
            height      : 74
        },
        {
            sTop        : 495,//1
            sLeft       : 383,
            top         : 350,
            width       : 83,
            height      : 70
        }
    ];

    var _stateSittingLeft = [
        {
            sTop        : 463,//1
            sLeft       : 1111,
            top         : 340,
            width       : 83,
            height      : 99
        },
        {
            sTop        : 474,//2
            sLeft       : 999,
            top         : 343,
            width       : 85,
            height      : 98
        },
        {
            sTop        : 490,//3
            sLeft       : 899,
            top         : 345,
            width       : 83,
            height      : 74
        },
        {
            sTop        : 495,//1
            sLeft       : 804,
            top         : 350,
            width       : 83,
            height      : 70
        }
    ];

    function _getResources() {
        return _sprite;
    }

    function _move() {
        if (_sitting) {
            return;
        }
        
        if (_playerStanding) {
            _playerStanding = false;
        }

        if (MY_ControllerKey.left) {
            _useLeftDirection = true;// Bild umdrehen
            _left -= SPEED * STEP;
                        
            _indexRunPlayer += SPEED;
        }
        
        if (MY_ControllerKey.up) {
            //top -= SPEED * STEP;
        }
        
        if (MY_ControllerKey.right) {
            _useLeftDirection = false;// Bild umdrehen
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

    this.get = function() {
        _sprite.images.player = MY_Game_Resources.get(_sprite.spriteSources[0]);

        if (_collision) {
            var _deathDirection = _stateDeathRight;
            if (_useLeftDirection) {
                _deathDirection = _stateDeathLeft;
            }
            
            //nur den letzten Frame anzeigen, wenn er runter gefallen ist.
            if (_indexCollisionsCounter < _deathDirection.length - 1) {
                _indexCollisionsCounter += 0.2;
                _top += 0.8;
            }
            else if (_top < 346) {
                _top = 346;//  sofort auf den Boden
            }
            
            var index =  Math.floor(_indexCollisionsCounter) % _deathDirection.length;
        
            _deathDirection[index].left = _left;
            _deathDirection[index].top = _top;
            _deathDirection[index].useSlice = true;

            _sprite.shapes.player = [_deathDirection[index]];
            
            return _sprite;
        }

        if (_playerStanding && !_jumping && !_sitting) {
            _indexRunPlayer = 0;

            var _standDirection = _stateStandRight;
            
            //ist das Bild nach links gedreht.
            if (_useLeftDirection) {
                _standDirection = _stateStandLeft;
            }
        
            _standDirection[0].top  = _top;
            _standDirection[0].left = _left;
            _standDirection[0].useSlice = true;
            
            _sprite.shapes.player = _standDirection;
            
            return _sprite;
        }

        if (_sitting) {
            var _sittingDirection = _stateSittingRight;
            if (_useLeftDirection) {
                _sittingDirection = _stateSittingLeft;
            }

            if (_indexSittingCounter < _sittingDirection.length - 1) {
                _indexSittingCounter += 0.2;
            }

            var index =  Math.floor(_indexSittingCounter) % _sittingDirection.length;

            _sittingDirection[index].left = _left;
            _sittingDirection[index].useSlice = true;

            _sprite.shapes.player = [_sittingDirection[index]];

            return _sprite;
        }
        else {
            //reset
            _indexSittingCounter = 0;
        }
        
        if (_jumping) {
            _y_velocity += 1.5;// gravity

            _top += _y_velocity;

            _y_velocity *= 0.9;
            
            if (_top > TOP_DEFAULT) {

              _jumping = false;

              _top = TOP_DEFAULT;
            }
            
            //in X-Achse bewegen, wenn er fliegt.
            if (MY_ControllerKey.right || MY_ControllerKey.left) {
                _x_velocity += 0.25;
                
                if (_useLeftDirection) {
                    _left -= _x_velocity;
                }
                else {
                    _left += _x_velocity;
                }
                
                _x_velocity *= 0.9;
            }
        
            //in welche Richtung fliegt er.
            var _jumpDirection = _shapesJumpRight;
            if (_useLeftDirection) {
                _jumpDirection = _shapesJumpLeft;
            }
            
            if (_indexJumpPlayer < _jumpDirection.length - 1) {
                _indexJumpPlayer += 0.2;
            }
            else {
                _indexJumpPlayer = _jumpDirection.length - 1;
            }
            
            
            var index =  Math.floor(_indexJumpPlayer) % _jumpDirection.length;
            
            _jumpDirection[index].top = _top;
       
        
            _jumpDirection[index].left = _left;
            _jumpDirection[index].useSlice = true;

            _sprite.shapes.player = [_jumpDirection[index]];

            return _sprite;
        }
        else {
            //setze auf 0, damit beim nächsten Sprung die Startposition bestimmt wird.
            _indexJumpPlayer = 0;
        }
        
                
        //in welche Richtung läuft er.
        var _runDirection = _stateRunRight;
        if (_useLeftDirection) {
            _runDirection = _stateRunLeft;
        }
        
        var index =  Math.floor(_indexRunPlayer) % _runDirection.length;
        
        _runDirection[index].top = TOP_DEFAULT;
       
        
        _runDirection[index].left = _left;
        _runDirection[index].useSlice = true;
        
        _sprite.shapes.player = [_runDirection[index]];
        
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
    }

    function _sit(state) {
        _sitting = state;
    }

    //------öffentlichen Bereich-------
    this.move = function() {
        _move();
    };
    
    this.jump = function() {
        _jump();
    };
    
    this.stop = function() {
        _stop();
    };

    this.sit = function(state) {
        _sit(state);
    }
    
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
        
        callback(666);//Game Over
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
        return _useLeftDirection;
    };
    
    this.reset = function() {
        _top = TOP_DEFAULT;
        _left = LEFT_DEFAULT;
        _indexRunPlayer = 0;
        _indexCollisionsCounter = 0;
        _collision = false;
        _jumping = false;
        _y_velocity = Y_VELOCITY_DEFAULT;
        _x_velocity = X_VELOCITY_DEFAULT;
        _playerStanding = true;
    };
};

Player.prototype = new Actor();
Player.prototype.constructor = Player;