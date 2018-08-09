(function () {
    'use strict';
  
    var player,
        background,
        gun,
        hurdle,
        gameCanvasRender,
        drawRenderObjects = [],
        enemy,
        collisionDetection,
        gameStatus = {
            play : false,
            gameOver : false
        },
        score;
    
    var init = function () {
        window.MY_ControllerKey = {
            left : false,
            right : false,
            up : false,
            space : false,
            keyListener : function(event) {
              var key_state = (event.type === 'keydown') ? true : false;
 
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
              }
            }
        };
        
        //die gesamte Breite des Spielgames.
        window.MY_MapWidth = 4000;
        window.MY_MapHeight = 640;
        
        window.MY_Game_Resources = new Resources();
        
        gameCanvasRender = new GameCanvasRender();
        
        window.MY_Canvas = gameCanvasRender.getCanvas();
        
        window.MY_CTX_Canvas = gameCanvasRender.getCanvasCTX();
        
        background = new Background();        
                
        window.MY_camera = new Camera();
        
        player = new Player();

        /**
         * Der Player bleibt in der Mitte.
         */
        MY_camera.follow(player, MY_Canvas.width/2, MY_Canvas.height);
        
        gun = new Gun(player);
        
        hurdle = new Hurdle();
        
        enemy = new Enemy();
        
        score = new Score(enemy);

        MY_Game_Resources.load(player.getResources());
        MY_Game_Resources.load(background.getResources());
        MY_Game_Resources.load(gun.getResources());
        MY_Game_Resources.load(hurdle.getResources());
        MY_Game_Resources.load(enemy.getResources());
        MY_Game_Resources.load(score.getResources());

        drawRenderObjects.push(background);
        drawRenderObjects.push(player);
        drawRenderObjects.push(gun);
        drawRenderObjects.push(hurdle);
        drawRenderObjects.push(enemy);
        drawRenderObjects.push(score);
                
        preload();// Alle Resources in Cache ablegen
        
        collisionDetection = new CollisionDetection();
        
        collisionDetection.addCollisionsObjects(player,[
            hurdle,
            enemy
        ]);
    
        collisionDetection.addCollisionsObjects(enemy,[
            gun
        ]);
        
        //-- Start--//
        run();
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
        
        gameCanvasRender.clear();  
        gameCanvasRender.drawText('Loading' + point, '20px arial',  'black', 440, 300);

        if (MY_Game_Resources.isReady()) {
            clearTimeout(loopId);

            //scene.draw(background.get());
            //player.move(background);
            //hurdle.move();
            MY_camera.move();
            
            var bg = background.get();
            var pl = player.get();

            gameCanvasRender.draw(bg.frames, bg.shapes[0]);            
            gameCanvasRender.draw(pl.frames, pl.shapes[0]);
            
            return;
        } 
        console.log('preload');
        loopId = setTimeout(preload, 300);
    };

    var run = function () {
        window.addEventListener('keydown',function(e) {
            MY_ControllerKey.keyListener(e);
        },true);

        window.addEventListener('keyup',function(e) {
            MY_ControllerKey.keyListener(e);

        },true);
        
        var canvas = document.querySelector('canvas');
        canvas.addEventListener('mousedown', shootAction);
        //canvas.addEventListener('mouseup', stopShootAction);
        
        /*
         * 
          ----------Start des Spiels-----------
        */
        //var start = document.querySelector('#start-game');
        var start = document.querySelector('[data-role="start"]');
        
        start.addEventListener('click',function() {
            this.blur();//Damit die Leertaste, dieses Event nicht auslöst.
            
            gameStatus.play = true;

            if (loopIdGameStage !== undefined) {
                reset();// Das Spiel kann man nach dem Game Over wieder starten
            }
            
            drawGameStage();
        });
        
        var pause = document.querySelector('[data-role="pause"]');
        
        pause.addEventListener('click', setPauseGame);
    };
    
    var reset = function() {
        //Beim ersten Aufruf startet auch diese Funktion.
        for (var i = 0; i < drawRenderObjects.length; i++) {
            drawRenderObjects[i].reset();
        }

        //MY_camera.reset();
        window.cancelAnimationFrame(loopIdGameStage);

        gameStatus.gameOver = false;
    };

    var loopIdGameStage;
    var _sprite;
    //Alle Objekte durchlaufen und anzeigen.
    var drawGameStage = function() {
        //Wenn die Pause gedrückt wurde.
        if (!gameStatus.play) {
            return false;
        }

        //Alle Objekte aktualisieren.
        handleEventsKeyAction();
        
        gameCanvasRender.clear();

        try {
            for (var i = 0; i < drawRenderObjects.length; i++) {
                _sprite = drawRenderObjects[i].get();
                
                // wenn ein Objekt nicht angezeigt werden soll.
                if (_sprite === null) {
                    continue;
                }
                //Ein Objekt kann mehrere copy von sich selbt beinhalten.
                //z.b Kugeln
                for(var z = 0; z < _sprite.shapes.length; z++) {
                    if (Array.isArray(_sprite.frames)) {
                        if (_sprite.shapes[z]) {
                           gameCanvasRender.draw(_sprite.frames[z], _sprite.shapes[z]);
                        }
                    }
                    else {
                        gameCanvasRender.draw(_sprite.frames, _sprite.shapes[z]);
                    }
                    
                    if (collisionDetection.checkObjectCollision(drawRenderObjects[i], _sprite.shapes[z])) {
                        drawRenderObjects[i].onCollision(function(gameOver) {
                            if (gameOver) {
                                gameStatus.gameOver = true;
                            }
                        }, gameStatus);
                    }
                };                
            }
        }
        catch (e) {
            console.log(e);
            return;
        }

        // run play again ~60 times per sec    
        loopIdGameStage = window.requestAnimationFrame(function() {
//            if (gameOver === false) {
                drawGameStage();
//            }            
        });
    };
    
    var setPauseGame = function () {
        gameStatus.play = false;
    };
    
    var shootAction = function () {
        if (gameStatus.gameOver) {
            return;
        }
        
        if (gameStatus.play) {
            gun.shoot();
        }
    };

    var handleEventsKeyAction = function() {
        hurdle.move();
        enemy.move();
        
        if (!gameStatus.gameOver) {
            if (MY_ControllerKey.left || MY_ControllerKey.right) {
                player.move();
            }

            if (!MY_ControllerKey.right && !MY_ControllerKey.left && !MY_ControllerKey.space) {
                player.stop();
            }

            if (MY_ControllerKey.space) {
                player.jump();
            }
        }
        
        if (!player.isPlayerStanding()) {
            MY_camera.move();
        }
        
    };
    
    window.addEventListener('load', init);
})();

