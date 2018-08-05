function CollisionDetection () {
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
        //Der Name von der Klasse(Function) benutze ich als Index.
        var object1_Name = object1.constructor.name;
//        console.log(collisions[className]);
        //console.log(spriteName);
        if (collisions[object1_Name] !== undefined) {
            //Alle Objekte durchlaufen, die eventuell in Kollision stehen können.
            for (var i = 0; i < collisions[object1_Name].length; i++) {
                //Opponent
                var object2 = collisions[object1_Name][i].get();
                //Kein Shape vorhanden ist.
                if (object2 === null) {
                    return false;
                }
//                console.log(object2);
                for (var z = 0; z < object2.shapes.length; z++) {
                            
                    if (collides(
                        shape.left,//x1
                        shape.top, //y1
                        shape.left + shape.width,// r1
                        shape.top + shape.height,// b1
                        object2.shapes[z].left,//x2
                        object2.shapes[z].top,//y2
                        object2.shapes[z].left + object2.shapes[z].width,//r2
                        object2.shapes[z].top + object2.shapes[z].height//b2
                    )) {
                        //244--y1--725--r1--416--b1--497.9--x2--350--y2--527.9--r2--370--b2--
//                        console.log(object1);
//                        console.log(object2);
//                        console.log(shape.left,//x1
//                        shape.top + '--y1--' +
//                        (shape.left + shape.width) + '--r1--' +// r1
//                        (shape.top + shape.height) + '--b1--' +// b1
//                        object2.shapes[z].left + '--x2--' +//x2
//                        object2.shapes[z].top + '--y2--' +//y2
//                        (object2.shapes[z].left + object2.shapes[z].width) + '--r2--' +//r2
//                        (object2.shapes[z].top + object2.shapes[z].height) + '--b2--'
//                    );
            
                        return true;
                    }
                }
            }            
            //return false;
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