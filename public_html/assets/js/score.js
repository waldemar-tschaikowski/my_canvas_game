function Score(enemy) {
    'use strict';
    
    var _enemy = enemy,
        _defaultLeft = 454;

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
            left        : 450,
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
        
        var _w = 0;
        for (var i= 0; i < _len; i++) {
            _w += 20;//Die Breite "20" eines Elements
        }
        
        _w += (_len - 1) * 5; // "5" die Abstand von Elementen
        
        var _offSetLeft = _defaultLeft - (_w / 2);
        
        for (var i= 0; i < _len; i++) {
            _sprite.frame.push(MY_Game_Resources.get(_sprite.spriteSources[0]));
            
            _scoreShapes[_num[i]].left = _offSetLeft;
            
            _offSetLeft += 25;// Die Breite plus den Abstand
            
            var _frame =   {
                 sTop        : _scoreShapes[_num[i]].sTop,
                 sLeft       : _scoreShapes[_num[i]].sLeft,
                 top         : _scoreShapes[_num[i]].top,
                 left        : _defaultLeft,
                 width       : _scoreShapes[_num[i]].width,
                 height      : _scoreShapes[_num[i]].height,
                 dHeight     : _scoreShapes[_num[i]].dHeight,
                 dWidth      : _scoreShapes[_num[i]].dWidth,
                 useSlice    : _scoreShapes[_num[i]].useSlice,
                 flipedImage : _scoreShapes[_num[i]].flipedImage
             };

            _frame.left = _defaultLeft;
            
            _frame.left = _offSetLeft;

            _sprite.shapes.push(_frame);
        }

        return _sprite;
    };
    
    this.getShape = function() {
        
    };
}

Score.prototype = new Actor();
Score.prototype.constructor = Score;