function Camera() {
   /*   
    *    _______yView______________
    *   |  xView|       |         |
    *   |       |camera |         | Background
    *   |       |       |         |
    *   |_______|_______|_________|
    */
    // possibles axis to move the camera
    var AXIS = {
        NONE: "none", 
        HORIZONTAL: "horizontal", 
        VERTICAL: "vertical", 
        BOTH: "both"
    };

     // position of camera (left-top coordinate)
    this.xView = 0;
    this.yView = 0;

    // distance from followed object to border before camera starts move
    this.xDeadZone = 0; // min distance to horizontal borders
    this.yDeadZone = 0; // min distance to vertical borders

    // Die Größen von Kamera
    this.wView = MY_Canvas.width;
    this.hView = MY_Canvas.height;	


    // allow camera to move in vertical and horizontal axis
    this.axis = AXIS.BOTH;	

    // object that should be followed
    this.followed = null;

    // rectangle that represents the viewport
    this.viewportRect = new Rectangle(this.xView, this.yView, this.wView, this.hView);				

    // rectangle that represents the world's boundary (room's boundary)
    this.worldRect = new Rectangle(0, 0, MY_MapWidth, MY_MapHeight);

    function Rectangle(left, top, width, height) {
            this.left = left || 0;
            this.top = top || 0;
            this.width = width || 0;
            this.height = height || 0;
            this.right = this.left + this.width;
            this.bottom = this.top + this.height;
    }

    Rectangle.prototype.set = function(left, top, /*optional*/width, /*optional*/height) {
            this.left = left;
            this.top = top;
            this.width = width || this.width;
            this.height = height || this.height
            this.right = (this.left + this.width);
            this.bottom = (this.top + this.height);
    };

    Rectangle.prototype.within = function(r) {
            return (r.left <= this.left && 
                        r.right >= this.right &&
                        r.top <= this.top && 
                        r.bottom >= this.bottom);
    };	

    Rectangle.prototype.overlaps = function(r) {
            return (this.left < r.right && 
                        r.left < this.right && 
                        this.top < r.bottom &&
                        r.top < this.bottom);
    };   

    // gameObject needs to have "x" and "y" properties (as world(or room) position)
    this.follow = function(gameObject, xDeadZone, yDeadZone) {
        this.followed = gameObject;	
        this.xDeadZone = xDeadZone;
        this.yDeadZone = yDeadZone;
    };
    
    //console.log(this);

    this.move = function() {
        var sx, sy, dx, dy;
        var sWidth, sHeight;
        var backgroundHeight = MY_MapHeight;
        var backgroundWidth = MY_MapWidth;

        // offset point to crop the image
        sx = this.xView;
        sy = this.yView;
       // console.log('-----------'+this.yView +'-----');
        dx = 0;
        dy = 0;

        
        if(this.followed !== null) {
            if (this.axis === AXIS.HORIZONTAL || this.axis === AXIS.BOTH) {
                // moves camera on horizontal axis based on followed object position
                if (this.followed.getLeft() - this.xView + this.xDeadZone > this.wView) {
                    this.xView = this.followed.getLeft() - (this.wView - this.xDeadZone);
                }
                else if (this.followed.getLeft() - this.xDeadZone < this.xView) {
                    this.xView = this.followed.getLeft()  - this.xDeadZone;
                }
            }
            
            if (this.axis === AXIS.VERTICAL || this.axis === AXIS.BOTH) {
                // moves camera on vertical axis based on followed object position
                if (this.followed.getTop() - this.yView + this.yDeadZone > this.hView) {
                    this.yView = this.followed.getTop();// - (this.hView - this.yDeadZone);
                }
                else if (this.followed.getTop() - this.yDeadZone < this.yView) {
                    this.yView = this.followed.getTop();// - this.yDeadZone;
                }
            }
        }		

        // update viewportRect
        this.viewportRect.set(this.xView, this.yView);


        // don't let camera leaves the world's boundary
        if(!this.viewportRect.within(this.worldRect))
        {
            if(this.viewportRect.left < this.worldRect.left)
                this.xView = this.worldRect.left;
            if(this.viewportRect.top < this.worldRect.top)					
                this.yView = this.worldRect.top;
            if(this.viewportRect.right > this.worldRect.right)
                this.xView = this.worldRect.right - this.wView;
            if(this.viewportRect.bottom > this.worldRect.bottom)					
                this.yView = this.worldRect.bottom - this.hView;
        }

        // if cropped image is smaller than canvas we need to change the source dimensions
        if (backgroundWidth - sx < sWidth) {
            sWidth = backgroundWidth - sx;
        }
        
        if (backgroundHeight - sy < sHeight) {
            sHeight = backgroundHeight - sy; 
        }
//        console.log(this.yView + '--yView--' + this.xView + '--xView');
//        console.log(sy + '--sy--' + sx + '--sx--');
//        console.log(this.wView + '--this.wView--' + this.hView + '--this.hView--');
        //Hier setzt man den Bereich, nur der söllte angezeigt werden.
        //background.setMapSize(this.yView, sx, sWidth, sHeight);
    };
    
    this.reset = function() {
       
        //this.xView = -(MY_Canvas.width/2);

        // distance from followed object to border before camera starts move
//        this.xDeadZone = 0; // min distance to horizontal borders
//        this.yDeadZone = 0; // min distance to vertical borders

        // viewport dimensions

//        this.left = 0;
//        this.top = 0;
        
//        this.wView = MY_Canvas.width;
//        this.hView = MY_Canvas.height;	
        
//        this.viewportRect.left = this.xView;
//        this.viewportRect.top = 0;
//        this.viewportRect.width = this.wView;
//        this.viewportRect.height = this.hView;
//        this.viewportRect.right = this.left + this.wView;
//        this.viewportRect.bottom = this.top + this.hView;


//        this.worldRect.left = 0;
//        this.worldRect.top = 0;
//        this.worldRect.width = _background.getMapWidth();
//        this.worldRect.height = _background.getMapHeight();
//        this.worldRect.right = this.left + _background.getMapWidth();
//        this.worldRect.bottom = this.top + _background.getMapHeight();

    };
}
