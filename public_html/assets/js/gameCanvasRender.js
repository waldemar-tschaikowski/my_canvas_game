function GameCanvasRender() {
    'use strict';
    
    //private--------------
     
    var ctx, canvas;

    function _clear() {
        ctx.clearRect(0, 0, MY_Canvas.width, MY_Canvas.height);
    };
    
    function _draw(img, shape) {
        if (shape.flipedImage !== undefined && shape.flipedImage) {
            _flipImage(img, shape.left - MY_camera.xView, shape.top, shape.width, shape.height);
        }
        else {
            //Soll das Objekt abgeschnitten werden.
            //@TODO das funktionniert nur für Background. das muss "shape.left - MY_camera.xView" gemacht werden.
            if (shape.useSlice) {
                //den Wert 0 ist für Beckground
                if (shape.left !== 0) {
                   shape.left -= MY_camera.xView;
                }
                
                ctx.drawImage(img, shape.sLeft, shape.sTop, shape.width, shape.height, shape.left, shape.top, (shape.dWidth) ? shape.dWidth : shape.width, (shape.dHeight) ? shape.dHeight : shape.height);
                return;
            }
            ctx.drawImage(img, shape.left - MY_camera.xView, shape.top, shape.width, shape.height);
        }
    }

    //Das Bild umdrehen
    function _flipImage(img, x, y, width, height) {
        ctx.save();

        ctx.translate(x + width, y);

        ctx.scale(-1, 1);

        // Draw the image    
        ctx.drawImage(img, 0, 0, width, height);

        ctx.restore();
    }

    function _constructor() {
        canvas = document.querySelector('canvas');
        ctx = canvas.getContext('2d');	
    };
    
    //public--------------
    
    this.drawText = function(text, font, fillstyle, left, top) {
        _clear();
        ctx.font = font;
        ctx.fillstyle = fillstyle;
        ctx.fillText(text, left, top);
    };

    //alle Objekte ohne Scene(Background) zeichnen. 
    this.draw = function(img, shape) {
        _draw(img, shape);      
    };
    
    this.drawScene = function(background) {
        _drawScene(background);
    };
    
    this.clear = function() {
        _clear();
    };
    
    this.getCanvas = function() {
        return canvas;
    };
    
    this.getCanvasCTX = function() {
        return ctx;
    };
    
    _constructor();
}

