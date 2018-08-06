function Score(enemy) {
    'use strict';
    
    var _enemy = enemy;

    var _sprite = {
        name : 'score',
        type : 'image',
        spriteSources  : ['assets/img/score.png'],
        shapes : [],
        frame : []
    };
    
    var _scoreShapes = [
        {
            sTop        : 136,//sTop Sourse Top
            sLeft       : 2,
            top         : 34,
            left        : 420,
            width       : 90,
            height      : 108,
            dHeight     : 24,
            dWidth      : 20,
            useSlice    : true,
            flipedImage : false
        },
        {
            sTop        : 136,//2
            sLeft       : 96,
            top         : 34,
            left        : 420,
            width       : 82,
            height      : 108,
            dHeight     : 24,
            dWidth      : 16,
            useSlice    : true,
            flipedImage : false
        },
        {
            sTop        : 136,//2
            sLeft       : 175,
            top         : 34,
            left        : 420,
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
            left        : 420,
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
            left        : 420,
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
            left        : 420,
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
            left        : 420,
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
            left        : 420,
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
            left        : 420,
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
            left        : 420,
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
    var _oldLeft = [];
    var _left = 0;
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
        
        var score = _enemy.getScore();

       
        for (var i = 0, num = score.toString(); i < num.length; i++) {
            _sprite.frame.push(MY_Game_Resources.get(_sprite.spriteSources[0])); 

            if (_oldLeft[i] === undefined) {
                if (num.length > 1 && _oldLeft[0] !== undefined) {
                    _scoreShapes[num[0]].left = _scoreShapes[num[0]].left - 18;
                    _scoreShapes[num[i]].left += 8;
                }
                else{
                    _scoreShapes[num[i]].left -= 2;
                }
                _oldLeft[i] = _scoreShapes[num[i]].left;
            }
            else {
                _scoreShapes[num[i]].left = _oldLeft[i];
            }
            
            _sprite.shapes.push(_scoreShapes[num[i]]);

        }
        
//        if (score > 9) {            
//            for (var i = 0, num = score.toString(); i < num.length; i++) {
//                _scoreShapes[num[i]].left +
//                _sprite.shapes.push(_scoreShapes[num[i]]);
//            }
//        }
//        else {
//            _sprite.shapes.push(_scoreShapes[score]);
//        }

        return _sprite;
    };
    
    this.getShape = function() {
        
    };
}

Score.prototype = new Actor();
Score.prototype.constructor = Score;