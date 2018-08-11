function CollisionDetection() {
    'use strict';

    /**
     * --object to check-- //-> geprüftes Objekt 
     * collision Objecte   //-> array von Objekten, die eventuell in konflikt mit geprüftem Objekt stehen können.
     */
    var collisions = {};
    
    /**
     * 
     * @param object object1
     * 
     * Ein Object kann mehrere Shapes erhalten.
     * Die Shape unterscheiden sich nur von Größen und Positionierung,
     * aber die sind von einem Datentype erstammen.
     * pattern flyweight wurde benutzt. 
     * @param object shape. 
     * @returns {Boolean}
     */
    this.checkObjectCollision = function(object1, shape) {
        //Der Name der Klasse(Function) benutze ich als Index.
        var object1_Index = object1.constructor.name;
//        console.log(collisions[className]);
        //console.log(spriteName);
        if (collisions[object1_Index] !== undefined) {
            //Alle Objekte durchlaufen, die eventuell in Kollision stehen können.
            for (var i = 0; i < collisions[object1_Index].length; i++) {
                
                for (var o in collisions[object1_Index][i]) {
                    //
                    var _shortObj = collisions[object1_Index][i][o];
                    var object2 = _shortObj.object.get();//Opponent
                    
                    //Kein Shape vorhanden ist.
                    if (object2 === null) {
                        return false;
                    }
                    for (var y = 0; y < _shortObj.images.length; y++) {
                        for (var z = 0; z < object2.shapes[_shortObj.images[y]].length; z++) {
                            var shape2 = object2.shapes[_shortObj.images[y]][z];
                            
                            if (collides(
                                shape.left,//x1
                                shape.top, //y1
                                shape.left + shape.width,// r1
                                shape.top + shape.height,// b1
                                shape2.left,//x2
                                shape2.top,//y2
                                shape2.left + shape2.width,//r2
                                shape2.top + shape2.height//b2
                            )) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        
        return false;
    };

    /**
     * 
     * @param {type} x1
     * @param {type} y1
     * @param {type} r1
     * @param {type} b1
     * @param {type} x2
     * @param {type} y2
     * @param {type} r2
     * @param {type} b2
     * @returns {Boolean}
     */
    function collides(x1, y1, r1, b1, x2, y2, r2, b2) {
        //console.log(x1, y1, r1, b1, x2, y2, r2, b2);
       
        return !(r1 <= x2 || x1 > r2 ||
                 b1 <= y2 || y1 > b2);
    }
    
    /**
     * für welches Objekt sind die anderen Objekte "Opponenten" betrachten
     * werden müssen.
     * @param object object
     * @param array opponent
     * @returns null
     */
    this.addCollisionsObjects = function (object, opponenten) {
        collisions[object.constructor.name] = opponenten;
    };
}