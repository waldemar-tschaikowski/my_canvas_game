function Time() {
    'use strict';

    //------privatbereich-------

    var _left = 464,
        _top = 400;

    var _sprite = {
        name : 'score',
        type : 'image',
        spriteSources  : ['assets/img/score.png'],
        shapes : {},
        images : {}
    };
    
    var _timeShapes = [
        {
            sTop        : 136,//0
            sLeft       : 2,
            width       : 90,
            height      : 108,
            dHeight     : 24,
            dWidth      : 20
        },
        {
            sTop        : 136,//1
            sLeft       : 96,
            width       : 82,
            height      : 108,
            dHeight     : 24,
            dWidth      : 20
        },
        {
            sTop        : 136,//2
            sLeft       : 175,
            width       : 92,
            height      : 108,
            dHeight     : 24,
            dWidth      : 20
        },
        {
            sTop        : 136,//3
            sLeft       : 268,
            width       : 95,
            height      : 108,
            dHeight     : 24,
            dWidth      : 20
        },
        {
            sTop        : 136,//4
            sLeft       : 364,
            width       : 96,
            height      : 108,
            dHeight     : 24,
            dWidth      : 20
        },
        {
            sTop        : 136,//5
            sLeft       : 452,
            top         : 34,
            width       : 96,
            height      : 108,
            dHeight     : 24,
            dWidth      : 20
        },
        {
            sTop        : 136,//6
            sLeft       : 548,
            top         : 34,
            width       : 94,//640
            height      : 108,
            dHeight     : 24,
            dWidth      : 20
        },
        {
            sTop        : 136,//7
            sLeft       : 640,
            top         : 34,
            width       : 94,
            height      : 108,
            dHeight     : 24,
            dWidth      : 20
        },
        {
            sTop        : 136,//8
            sLeft       : 734,
            top         : 34,
            width       : 98,//828
            height      : 108,
            dHeight     : 24,
            dWidth      : 20
        },
        {
            sTop        : 136,//9
            sLeft       : 828,
            top         : 34,
            width       : 98,
            height      : 108,
            dHeight     : 24,
            dWidth      : 20
        }
    ];
    
    var _dotsShapes = [
        {
            sTop        : 29,//9
            sLeft       : 581,
            top         : 34,
            width       : 60,
            height      : 88,
            dHeight     : 24,
            dWidth      : 20
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
        function getTimeShape(shape, index) {
            var _frame =   {
                 sTop        : shape[index].sTop,
                 sLeft       : shape[index].sLeft,
                 top         : 460,
                 width       : shape[index].width,
                 height      : shape[index].height,
                 dHeight     : shape[index].dHeight,
                 dWidth      : shape[index].dWidth,
                 useSlice    : true,
                 flipedImage : false
             };

             return _frame;
        }
    
        _sprite.images.scoreBar = null;
        _sprite.shapes.scoreBar = [];
        
        _sprite.images.scoreBar = MY_Game_Resources.get(_sprite.spriteSources[0]);

        _sprite.shapes.scoreBar.push({
            sTop        : 63,//sTop Sourse Top
            sLeft       : 283,
            top         : 10,
            left        : MY_camera.xView + 450,
            width       : 58,
            height      : 25,
            useSlice    : true,
            flipedImage : false
        });
        
        /**
         * 
         * Das Anzeigen des Spielstandes.
         */
        var _time    = new Date();
        var _hour    = _time.getHours();
        var _minut   = _time.getMinutes();
        var _second  = _time.getSeconds();

        var _offSetLeft = _left - 40;
        
        var _fullTime = _hour.toString() + ':' + _minut.toString() + ':' + _second.toString();

        for (var i= 0; i < _fullTime.length; i++) {
            if (_fullTime[i] === ':') {
                var _frame = getTimeShape(_dotsShapes, 0);
            }
            else {
                var _frame = getTimeShape(_timeShapes, _fullTime[i]);
            }
            
            _sprite.images['timme' + i] = MY_Game_Resources.get(_sprite.spriteSources[0]);

            _frame.left = MY_camera.xView + _offSetLeft;

            _sprite.shapes['timme' + i] = [_frame];
                        
            _offSetLeft += 20;
        }

        return _sprite;
    };
}

Time.prototype = new Actor();
Time.prototype.constructor = Time;