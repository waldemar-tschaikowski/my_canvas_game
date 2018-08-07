function Score(enemy) {
    'use strict';
    
    var _enemy = enemy,
        _defaultLeft = 430;

    var _sprite = {
        name : 'score',
        type : 'image',
        spriteSources  : ['assets/img/score.png'],
        shapes : [],
        frame : []
    };
    
    var _scoreShapes = [
        {
            sTop        : 136,//0
            sLeft       : 2,
            top         : 34,
            left        : _defaultLeft,
            width       : 90,
            height      : 108,
            dHeight     : 24,
            dWidth      : 20,
            useSlice    : true,
            flipedImage : false
        },
        {
            sTop        : 136,//1
            sLeft       : 96,
            top         : 34,
            left        : _defaultLeft,
            width       : 82,
            height      : 108,
            dHeight     : 24,
            dWidth      : 20,
            useSlice    : true,
            flipedImage : false
        },
        {
            sTop        : 136,//2
            sLeft       : 175,
            top         : 34,
            left        : _defaultLeft,
            width       : 92,
            height      : 108,
            dHeight     : 24,
            dWidth      : 20,
            useSlice    : true,
            flipedImage : false
        },
        {
            sTop        : 136,//3
            sLeft       : 268,
            top         : 34,
            left        : _defaultLeft,
            width       : 95,
            height      : 108,
            dHeight     : 24,
            dWidth      : 20,
            useSlice    : true,
            flipedImage : false
        },
        {
            sTop        : 136,//4
            sLeft       : 364,
            top         : 34,
            left        : _defaultLeft,
            width       : 96,
            height      : 108,
            dHeight     : 24,
            dWidth      : 20,
            useSlice    : true,
            flipedImage : false
        },
        {
            sTop        : 136,//5
            sLeft       : 452,
            top         : 34,
            left        : _defaultLeft,
            width       : 96,
            height      : 108,
            dHeight     : 24,
            dWidth      : 20,
            useSlice    : true,
            flipedImage : false
        },
        {
            sTop        : 136,//6
            sLeft       : 548,
            top         : 34,
            left        : _defaultLeft,
            width       : 94,//640
            height      : 108,
            dHeight     : 24,
            dWidth      : 20,
            useSlice    : true,
            flipedImage : false
        },
        {
            sTop        : 136,//7
            sLeft       : 640,
            top         : 34,
            left        : _defaultLeft,
            width       : 94,
            height      : 108,
            dHeight     : 24,
            dWidth      : 20,
            useSlice    : true,
            flipedImage : false
        },
        {
            sTop        : 136,//8
            sLeft       : 734,
            top         : 34,
            left        : _defaultLeft,
            width       : 98,//828
            height      : 108,
            dHeight     : 24,
            dWidth      : 20,
            useSlice    : true,
            flipedImage : false
        },
        {
            sTop        : 136,//9
            sLeft       : 828,
            top         : 34,
            left        : _defaultLeft,
            width       : 98,
            height      : 108,
            dHeight     : 24,
            dWidth      : 20,
            useSlice    : true,
            flipedImage : false
        }
    ];
    
    function _getResources() {
        return _sprite;
    }
    
    function _getFrameLeft(_num, _left, _c) {
        for (var i = _c; i > 0; i--) {
            var _frame =   {
                sTop        : _scoreShapes[_num[i - 1]].sTop,
                sLeft       : _scoreShapes[_num[i - 1]].sLeft,
                top         : _scoreShapes[_num[i - 1]].top,
                left        : _defaultLeft,
                width       : _scoreShapes[_num[i - 1]].width,
                height      : _scoreShapes[_num[i - 1]].height,
                dHeight     : _scoreShapes[_num[i - 1]].dHeight,
                dWidth      : _scoreShapes[_num[i - 1]].dWidth,
                useSlice    : _scoreShapes[_num[i - 1]].useSlice,
                flipedImage : _scoreShapes[_num[i - 1]].flipedImage
            }
            _sprite.frame.push(MY_Game_Resources.get(_sprite.spriteSources[0]));

            _frame.left = _defaultLeft;
            
            _left -= 20;
            
            _frame.left = _left;
            
            _sprite.shapes.push(_frame);
            
            _left -= 5;
        }       
    }
    
    function _getFrameRight(_num, _left, _c) {                
        for (var i = _c + 1, max = _c * 2; i <= max; i++) {
            _sprite.frame.push(MY_Game_Resources.get(_sprite.spriteSources[0]));
            var _frame =   {
                 sTop        : _scoreShapes[_num[i - 1]].sTop,
                 sLeft       : _scoreShapes[_num[i - 1]].sLeft,
                 top         : _scoreShapes[_num[i - 1]].top,
                 left        : _defaultLeft,
                 width       : _scoreShapes[_num[i - 1]].width,
                 height      : _scoreShapes[_num[i - 1]].height,
                 dHeight     : _scoreShapes[_num[i - 1]].dHeight,
                 dWidth      : _scoreShapes[_num[i - 1]].dWidth,
                 useSlice    : _scoreShapes[_num[i - 1]].useSlice,
                 flipedImage : _scoreShapes[_num[i - 1]].flipedImage
             }

            _frame.left = _defaultLeft;
            
            _frame.left = _left;

            _sprite.shapes.push(_frame);
             
            _left = _left + 20 + 10;
        }
    }
    
    this.getResources = function() {
        return _getResources();
    };
    
    /**
     * Die Funktion move(), braucht man nicht, weil Background(Die Psotion) von Kamera abhängig ist.
     * 
     * @returns {Background._sprite}
     */

    this.get = function() {
        _sprite.frame = [];
        _sprite.shapes = [];
        
        _sprite.frame.push(MY_Game_Resources.get(_sprite.spriteSources[0]));

        _sprite.shapes.push({
            sTop        : 63,//sTop Sourse Top
            sLeft       : 283,
            top         : 10,
            left        : 400,
            width       : 58,
            height      : 25,
            useSlice    : true,
            flipedImage : false
        });
        
        /**
         * 
         * Das Anzeigen des Spielstandes.
         */
        var _score = _enemy.getScore();

        var _num = _score.toString();
        var _len = _num.length;
        
        var m = _len % 2;
        
        /**
         *  wie viel Elementen rechts und links.
         *  Wenn score ist fünfstellig 21356, dann 2 Elementen befinden sich rechts und zwei Elementen links.
         *  Das Element 3 befindet sich in der Mitte
         *  z.B _len = 2; _len  / 1 = 1 ; 1 Element rechts und ein Element links.
         */
        var _c =  Math.floor(_len / 2); 

        //ungerade Zahl
        if (m === 1) {
            //Es gibt kein Element rechts oder links.
            //In der mitte ist nur ein Element platziert.
            if (_c === 0) {
                _sprite.frame.push(MY_Game_Resources.get(_sprite.spriteSources[0]));

                _scoreShapes[_score].left = _defaultLeft;
                
                _scoreShapes[_score].left -= 10;
                
                _sprite.shapes.push(_scoreShapes[_score]);
            }
            else {
                _sprite.frame.push(MY_Game_Resources.get(_sprite.spriteSources[0]));

                //Das Element in der Mitte.
                _scoreShapes[_num[_c]].left = _defaultLeft;
                _scoreShapes[_num[_c]].left -= 10;
                _sprite.shapes.push(_scoreShapes[_num[_c]]);
                
                var _left = _defaultLeft - 10 - 5;
                
                _getFrameLeft(_num, _left, _c);

                _left = _defaultLeft + 10 + 5;
                _getFrameRight(_num, _left, _c);
            }
        }
        else {
            if (_score > 0) {
                var _left = _defaultLeft - 5;
                _getFrameLeft(_num, _left, _c);

                _left = _defaultLeft + 5;
                _getFrameRight(_num, _left, _c);
            }
            else {
                _sprite.frame.push(MY_Game_Resources.get(_sprite.spriteSources[0]));
                _scoreShapes[0].left = _defaultLeft;
                _scoreShapes[0].left -= 10;
                _sprite.shapes.push(_scoreShapes[0]);
            }
        }

        return _sprite;
    };
    
    this.getShape = function() {
        
    };
}

Score.prototype = new Actor();
Score.prototype.constructor = Score;