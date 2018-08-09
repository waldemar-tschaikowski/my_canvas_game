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
            ctx.drawImage(img, shape.left - MY_camera.xView, shape.top);
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

    function _create() {
        canvas = document.querySelector('canvas');
        ctx = canvas.getContext('2d');	
    };
    
//    function _drawScene(background) {
////        console.log(background.getsWidth() + '--getsWidth--' + background.getsHeight() + '--getsHeight');
//        //console.log(background.getMapLeft() + '--getMapLeft' + background.getMapTop() + '--getMapTop');
//        ctx.drawImage(background.getImage(), background.getLeft(), background.getTop(), background.getsWidth(), background.getsHeight(), 0, 0, background.getsWidth(), background.getsHeight());
//    }
    
    //public--------------
    
    this.drawText = function(text, font, fillstyle, left, top) {
        _clear();
        ctx.font = font;
        ctx.fillstyle = fillstyle;
        ctx.fillText(text, left, top);
    };

    //alle Objekte ohne Scene(Background) zeichnen. 
    this.draw = function(img, shape) {
//        if (Array.isArray(img)) {
//            for (var i = 0; i < img.lenght; i++) {
//                _draw(img[i], img[i].getShape());
//            }
//            console.log(223);
//        }
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
    
    _create();
    
    
//    
//    var DrawImageFF = function (src, camera, parentTransformMatrix)
//{
//    var ctx = this.currentContext;
//
//    //  Alpha
//
//    var alpha = camera.alpha * src.alpha;
//
//    if (alpha === 0)
//    {
//        //  Nothing to see, so abort early
//        return;
//    }
//
//    ctx.globalAlpha = alpha;
//
//    //  Blend Mode
//
//    if (this.currentBlendMode !== src.blendMode)
//    {
//        this.currentBlendMode = src.blendMode;
//        ctx.globalCompositeOperation = this.blendModes[src.blendMode];
//    }
//
//    var camMatrix = _tempCameraMatrix;
//    var spriteMatrix = _tempSpriteMatrix;
//
//    spriteMatrix.applyITRS(src.x - camera.scrollX * src.scrollFactorX, src.y - camera.scrollY * src.scrollFactorY, src.rotation, src.scaleX, src.scaleY);
//
//    var frame = src.frame;
//
//    var cd = frame.canvasData;
//
//    var frameX = cd.x;
//    var frameY = cd.y;
//    var frameWidth = frame.width;
//    var frameHeight = frame.height;
//
//    var x = -src.displayOriginX + frame.x;
//    var y = -src.displayOriginY + frame.y;
//
//    var fx = (src.flipX) ? -1 : 1;
//    var fy = (src.flipY) ? -1 : 1;
//
//    if (src.isCropped)
//    {
//        var crop = src._crop;
//
//        if (crop.flipX !== src.flipX || crop.flipY !== src.flipY)
//        {
//            frame.updateCropUVs(crop, src.flipX, src.flipY);
//        }
//
//        frameWidth = crop.cw;
//        frameHeight = crop.ch;
//
//        frameX = crop.cx;
//        frameY = crop.cy;
//
//        x = -src.displayOriginX + crop.x;
//        y = -src.displayOriginY + crop.y;
//
//        if (fx === -1)
//        {
//            if (x >= 0)
//            {
//                x = -(x + frameWidth);
//            }
//            else if (x < 0)
//            {
//                x = (Math.abs(x) - frameWidth);
//            }
//        }
//    
//        if (fy === -1)
//        {
//            if (y >= 0)
//            {
//                y = -(y + frameHeight);
//            }
//            else if (y < 0)
//            {
//                y = (Math.abs(y) - frameHeight);
//            }
//        }
//    }
//
//    camMatrix.copyFrom(camera.matrix);
//
//    var calcMatrix;
//
//    if (parentTransformMatrix)
//    {
//        //  Multiply the camera by the parent matrix
//        camMatrix.multiplyWithOffset(parentTransformMatrix, -camera.scrollX * src.scrollFactorX, -camera.scrollY * src.scrollFactorY);
//
//        //  Undo the camera scroll
//        spriteMatrix.e = src.x;
//        spriteMatrix.f = src.y;
//
//        //  Multiply by the Sprite matrix
//        calcMatrix = camMatrix.multiply(spriteMatrix);
//    }
//    else
//    {
//        calcMatrix = spriteMatrix.multiply(camMatrix);
//    }
//
//    ctx.save();
//
//    ctx.transform(calcMatrix.a, calcMatrix.b, calcMatrix.c, calcMatrix.d, calcMatrix.e, calcMatrix.f);
//
//    ctx.scale(fx, fy);
//
//    ctx.drawImage(frame.source.image, frameX, frameY, frameWidth, frameHeight, x, y, frameWidth, frameHeight);
//
//    ctx.restore();
//};


    
    
    
    
}

