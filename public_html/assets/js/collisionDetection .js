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
     * @param object shape
     *  
     * Ein Object kann mehrere Shapes erhalten.
     * Die Shape unterscheiden sich nur von Größen und Positionierung,
     * aber die sind von einem Datentype erstammen. Jeder Shape wird gegen seinem Gegner geprüft. 
     * pattern flyweight wurde benutzt. 
     * @param object shape. 
     * @returns {Boolean}
     */
    this.checkObjectCollision = function(object1, shape) {
        //Der Name der Klasse benutze ich als Index.
        var object1_Index = object1.constructor.name;

        if (collisions[object1_Index] !== undefined) {
            //Alle Objekte durchlaufen, die eventuell in Kollision stehen können.
            //Aus run.js Datei
            for (var i = 0; i < collisions[object1_Index].length; i++) {
                //Feinde durchgehen.  
                for (var o in collisions[object1_Index][i]) {
                    //Feind aus der Run-Datei
                    var _checkingOpponent = collisions[object1_Index][i][o];
                    //Opponent
                    var object2 = _checkingOpponent.object.get();
                    
                    //Kein Shape vorhanden ist.
                    if (object2 === null) {
                        return false;
                    }

                    for (var y = 0; y < _checkingOpponent.images.length; y++) {
                        //z.B der Kugel ist gefärlich für Objekt1 aus Konfig-darei, aber in diesem Moment
                        //Objekt2 hat nicht geschossen.Nur nach dem Schießen oder einer Action.
                        //Die Images und Shapes werden initialisiert.
                        //Objekt2 kann für mehrere Objekte in Kollision stehen.
                        if (object2.images[_checkingOpponent.images[y]] === undefined) {
                            continue;
                        }

                        for (var z = 0; z < object2.shapes[_checkingOpponent.images[y]].length; z++) {
                            var shape2 = object2.shapes[_checkingOpponent.images[y]][z];
                            
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