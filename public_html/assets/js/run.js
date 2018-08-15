(function() {
    'use strict';
  
    var _canvas,
        _start,
        _player,
        _background,
        _gun,
        _hurdle,
        _gameCanvasRender,
        _drawRenderSprites = [],
        _enemy,
        _bullet,
        _collisionDetection,
        _gameStatus = {
            play : false,
            gameOver : false
        },
        _score,
        _time;
    
    var init = function() {
        window.MY_ControllerKey = {
            left : false,
            right : false,
            up : false,
            space : false,
            keyListener : function(event) {
                var key_state = (event.type === 'keydown');

                switch(event.keyCode) {
                    case 37:// left key
                    case 65:
                       MY_ControllerKey.left = key_state;
                       break;
                    case 38:// up key
                       MY_ControllerKey.up = key_state;
                       break;
                    case 68://Die Taste D
                    case 39:// right key
                       MY_ControllerKey.right = key_state;
                       break;
                    case 32://Leertaste
                       MY_ControllerKey.space = key_state;
                       break;
                    case 83:
                    case 40:
                       MY_ControllerKey.sitting = key_state;
                       break;
                }
            }
        };
        
        //die gesamte Breite und Höhe des Spielgames.
        window.MY_MapWidth = 4000;
        window.MY_MapHeight = 500;
        
        window.MY_Game_Resources = new Resources();
        
        _gameCanvasRender = new GameCanvasRender();
        
        window.MY_Canvas = _gameCanvasRender.getCanvas();
        
        window.MY_CTX_Canvas = _gameCanvasRender.getCanvasCTX();
        
        _background = new Background();
                
        window.MY_camera = new Camera();
        
        _bullet = new Bullet();
        
        _gun = new Gun(_bullet);        
                
        _player = new Player(_gun);

        /**
         * Der Player bleibt in der Mitte. MY_Canvas.width/2
         */
        MY_camera.follow(_player, MY_Canvas.width/2, MY_Canvas.height);
        
        _hurdle = new Hurdle();
        
        _enemy = new Enemy(_bullet);
        
        _score = new Score(_enemy);
        
        _time = new Time();
        
        MY_Game_Resources.load(_player.getResources());
        MY_Game_Resources.load(_background.getResources());
        MY_Game_Resources.load(_gun.getResources());
        MY_Game_Resources.load(_bullet.getResources());
        MY_Game_Resources.load(_hurdle.getResources());
        MY_Game_Resources.load(_enemy.getResources());
        MY_Game_Resources.load(_score.getResources());
        MY_Game_Resources.load(_time.getResources());

        //Alle Objekte auf dem Bildschirm aufzeichen.
        _drawRenderSprites.push(_background);
        _drawRenderSprites.push(_player);
        _drawRenderSprites.push(_bullet);
        _drawRenderSprites.push(_gun);
        _drawRenderSprites.push(_hurdle);
        _drawRenderSprites.push(_enemy);
        _drawRenderSprites.push(_score);
        _drawRenderSprites.push(_time);

        _collisionDetection = new CollisionDetection();

        /**
         * Das Objekt Player hat zwei Feinde: hurdle und enemy.
         * Ein Objekt(z.b hurdle) kann aus mehrere Images(Teilen) bestehen. z.B In diesem Fall- "hurdle" besteht nur aus einem Teil -> images:[hurdle]
         * Aber es kann sein, dass Images mehrere copy von sich selbst haben. Die unterscheiden sich nur in Positionnierung ung Größen.
         * Ich nenne diese Kopie-Images als "Shapes" - Formen; Objekt -> Images -> Shape
         *
         * Hier kann man festlegen, weilche Images und seine Kopie(Shapes) sind für das Objekt gefährlich.
         */
        _collisionDetection.addCollisionsObjects(_player,[
            {
                hurdle : {
                    object : _hurdle,
                    images : [
                        'hurdle'
                    ]
                }
            },
            {
                enemy : {
                    object : _enemy,
                    images : [
                        'enemy'
                    ]
                }
            },
            {
                bullet : {
                    object : _bullet,
                    images : [
                        'enemy'
                    ]
                }
            }
        ]);
    
        _collisionDetection.addCollisionsObjects(_enemy,[
            {
                bullet : {
                    object : _bullet,
                    images : [
                        'bullet'
                    ]
                }
            }
        ]);
        
        window.addEventListener('keydown',function(e) {
            MY_ControllerKey.keyListener(e);
        },true);

        window.addEventListener('keyup',function(e) {
            MY_ControllerKey.keyListener(e);

        },true);
        
        _canvas = document.querySelector('canvas');
        _canvas.addEventListener('mousedown', shootAction);
        
        _start = document.querySelector('[data-role="start"]');
        
        _start.addEventListener('click',function() {
            /**
             * Beim Klick auf die Leertaste wird diese Funktion aufgerufen.
             * die blur() vermeidet dieser Aufruf.
             */
            this.blur();
            
            _gameStatus.play = true;

            if (loopIdGameStage !== undefined) {
                reset();// Wenn das Spiel schon gestartet wurde.
            }
            
            drawGameStage();
        });
        
        var pause = document.querySelector('[data-role="pause"]');
        
        pause.addEventListener('click', setPauseGame);
        
                        
        preload();// Alle Resources in Cache ablegen
    };

    var loopId;
    var counterPoint = 1;
    var preload = function () {
        var point = '.';
        switch (counterPoint) {
            case 1 :
                counterPoint++;
                point = '.';
                break;
            case 2 :
                counterPoint++;
                point = '..';
                break;
            case 3 :
                counterPoint = 1;
                point = '...';
                break;
        }
        
        _gameCanvasRender.clear();  
        _gameCanvasRender.drawText('Loading' + point, '20px arial',  'black', 440, 300);

        if (MY_Game_Resources.isReady()) {
            clearTimeout(loopId);

            MY_camera.move();
            
            var bg = _background.get();
            var pl = _player.get();

            _gameCanvasRender.draw(bg.images.background, bg.shapes.background[0]);            
            _gameCanvasRender.draw(pl.images.player, pl.shapes.player[0]);
            
            _start.disabled = false;
            
            return;
        } 

        loopId = setTimeout(preload, 300);
    };

    
    var reset = function() {
        //Beim ersten Aufruf startet auch diese Funktion.
        for (var i = 0; i < _drawRenderSprites.length; i++) {
            _drawRenderSprites[i].reset();
        }

        MY_camera.reset();
        window.cancelAnimationFrame(loopIdGameStage);

        _gameStatus.gameOver = false;
    };

    var loopIdGameStage;
    var _sprite;
    //Alle Objekte durchlaufen und anzeigen.
    var drawGameStage = function() {
        //Wenn die Pause gedrückt wurde.
        if (!_gameStatus.play) {
            return false;
        }

        //Alle Objekte aktualisieren.
        handleEventsKeyAction();
        
        _gameCanvasRender.clear();

        try {
            for (var i = 0; i < _drawRenderSprites.length; i++) {
                _sprite = _drawRenderSprites[i].get();
                
                // wenn ein Objekt nicht angezeigt werden soll.
                if (_sprite === null) {
                    continue;
                }

                for (var img in _sprite.images) {
                    if (_sprite.shapes.hasOwnProperty(img)) {
                        for(var z = 0; z < _sprite.shapes[img].length; z++) {
                            if (_collisionDetection.checkObjectCollision(_drawRenderSprites[i], _sprite.shapes[img][z])) {
                            
                                _drawRenderSprites[i].onCollision(function(state) {
                                    if (state === 666) {
                                        _gameStatus.gameOver = true;
                                    }
                                }, _gameStatus);
                            }
                            _gameCanvasRender.draw(_sprite.images[img], _sprite.shapes[img][z]);
                        }
                    }
                    else {
                        console.log(_sprite);
                        throw new Error('Objekt ist falsch konfiguriert' + _sprite);
                    }
                }              
            }
        }
        catch (e) {
            console.log(e);
            return;
        }

        // run play again ~60 times per sec    
        loopIdGameStage = window.requestAnimationFrame(function() {
                drawGameStage();          
        });
    };
    
    var setPauseGame = function () {
        _gameStatus.play = false;
    };
    
    var shootAction = function () {
        if (_gameStatus.gameOver) {
            return;
        }
        
        if (_gameStatus.play) {
            _player.shoot();
        }
    };

    var handleEventsKeyAction = function() {
        _hurdle.move();
        _enemy.move();
        
        if (!_gameStatus.gameOver) {
            if (MY_ControllerKey.left || MY_ControllerKey.right) {
                _player.move();
            }

            if (!MY_ControllerKey.right && !MY_ControllerKey.left && !MY_ControllerKey.space && !MY_ControllerKey.sitting) {
                _player.stop();
            }

            if (MY_ControllerKey.space) {
                _player.jump();
            }

            if (MY_ControllerKey.sitting) {
                _player.sit(true);
            }
            else {
                _player.sit(false);
            }
        }
        
        if (!_player.isPlayerStanding()) {
            MY_camera.move();
        }
        
    };
    
    window.addEventListener('load', init);
})();

