/*!
 JS WARS 1.0.2
 Copyright (C) 2009  Jonas Wagner

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.

 NOTE:  The GPL does only apply to the source code (this file).
        Other parts like the graphics are NOT licensed under the GPL!
*/

/*
 A WORD OF WARNING

 This is nasty hacky quicky code that was never cleaned up
 or properly documented.

VIEWER DISCRETION IS ADVISED ;)
*/

if(typeof(console) == 'undefined') console = {log: function() {}}

var proto = window.CanvasRenderingContext2D.prototype;
// detecting the font property results in a security error so we'll just use
// measureText instead
if(proto.mozMeasureText && !proto.measureText) {
    proto.__defineSetter__('font', function(x) { this.mozTextStyle = x;});
    proto.__defineGetter__('font', function() { return this.mozTextStyle;});
}
if(proto.mozMeasureText && !proto.measureText) {
    console.log('wrapping measureText');
    proto.measureText = function(text) { return {'width': this.mozMeasureText(text)}; };
}
if(proto.mozPathText && !proto.strokeText) {
    console.log('wrapping strokeText');
    proto.strokeText = function(text, x, y) {
        this.translate(x, y);
        this.mozPathText(text);
        this.stroke();
        this.translate(-x, -y);
    };
}
if(proto.mozDrawText && !proto.fillText) {
    console.log('wrapping fillText');
    proto.fillText = function(text, x, y) {
        this.translate(x, y);
        this.mozDrawText(text);
        this.translate(-x, -y);
    };
}

function Canvas(w, h){
    var buffer = document.createElement('canvas');
    buffer.setAttribute('width', w);
    buffer.setAttribute('height', h);
    return buffer;
}

function fillTextMultiline(ctx, text, x, y, h) {
    if(!$.isArray(text)) {
        text = text.split('\n');
    }
    for(var i = 0; i < text.length; i ++){
        ctx.fillText(text[i], x, y);
        y += h;
    }
}

// two dimensional vector
function V2(a, b) {
    this.a = a;
    this.b = b;
}
v2 = function(a, b) { return new V2(a, b); }
// only with scalar values for now
V2.prototype.mul = function(x) { return v2(this.a*x, this.b*x); }
V2.prototype.magnitude = function() { return Math.sqrt(this.a*this.a + this.b*this.b)}
V2.prototype.normalize = function() { return this.mul(1/this.magnitude()); }


function max(a, b) {
    return (a>b) ? a : b;
}

function min(a, b) {
    return (a<b) ? a : b;
}

function rect_collision(a, b){
    return !(
        a.y + a.h < b.y || 
        a.y > b.y + b.h ||
        a.x + a.w < b.x ||
        a.x > b.x + b.w
    )
}

function do_collosion(a, b) {
    if(!$.isArray(a)) a = [a];
    if(!$.isArray(b)) b = [b];
    for(var i = 0; i < a .length; i ++){
        for(var j = 0; j < b.length; j ++){
            if(rect_collision(a[i], b[j])) {
                var c = a[i];
                var d = b[j];
                var e = min(c.hp/d.dmg, d.hp/c.dmg);
                c.hp -= d.dmg*e;
                d.hp -= c.dmg*e;
            }
        }
    }
}

// poor attempt at perlin noise
function noise(x) { return ((((x+21541352)^1546733486)*(x^28308090)*(x^82014727))%1000000)/1000000; }
function noise2(x,y) { return noise((x*23)^(y*13)); }
function smoothnoise(x, detail) {
    var x0 = Math.floor(x);
    var result = (noise(x0)*2+noise(x0-1)+noise(x0+1))/4;
    return result;
}

function smoothnoise2d(x, y) {
    var x0 = Math.floor(x);
    var y0 = Math.floor(y);
    var result = noise2(x0-1, y0-1);
    result += noise2(x0, y0-1);
    result += noise2(x0+1, y0-1);
    result += noise2(x0-1, y0);
    result += noise2(x0, y0)*2;
    result += noise2(x0+1, y0);
    result += noise2(x0-1, y0+1);
    result += noise2(x0, y0+1);
    result += noise2(x0+1, y0+1);
    return result / 10.0;
}

var keyname = {
    32: 'SPACE',
    13: 'ENTER',
    9: 'TAB',
    8: 'BACKSPACE',
    16: 'SHIFT',
    17: 'CTRL',
    18: 'ALT',
    20: 'CAPS_LOCK',
    144: 'NUM_LOCK',
    145: 'SCROLL_LOCK',
    37: 'LEFT',
    38: 'UP',
    39: 'RIGHT',
    40: 'DOWN',
    33: 'PAGE_UP',
    34: 'PAGE_DOWN',
    36: 'HOME',
    35: 'END',
    45: 'INSERT',
    46: 'DELETE',
    27: 'ESCAPE',
    19: 'PAUSE',
    222: "'"
};

jswars = {};
with(jswars) {

jswars.levels = [];

jswars.Timer = function() {
    var self = this;
    self.ontick = function(){}
    self.last = new Date().getTime()/1000
    self.tick = function () {
        var current = new Date().getTime()/1000;
        self.ontick(current-self.last);
        self.last = current;
        // todo: correct this to subtract the used time from the wait time if
        // possible
    }
    self.set_rate = function(rate) {
        self.rate = rate;
        if(self.interval)
            clearInterval(self.interval)
        self.interval = setInterval(self.tick, 1000/rate)
    }
}

jswars.KeyTracker = function() {
    var self = this;
    self.focus = true;
    self.reset = function() {
        var code;
        for(code in keyname) {
            self[keyname[code]] = false;
        }
    }
    var keydown = $(document).keydown(function(evt){
        self[keyname[evt.keyCode]] = true;
        return !self.focus;
    });
    var keyup = $(document).keyup(function(evt){
        self[keyname[evt.keyCode]] = false;
        return !self.focus;
    });
}

// layers = [[offset, velocity, img]]
jswars.ParallaxScroller = function(layers, width) {
    this.layers = layers;
    this.width = width;
}
jswars.ParallaxScroller.prototype.draw = function(ctx, t) {
    var x, img, layer;
    for(var i = 0; i < this.layers.length ; i ++){
        layer = this.layers[i];
        img = layer[2];
        x = Math.round(layer[0] + layer[1]*t%this.width);
        ctx.drawImage(img, x, 0);
        ctx.drawImage(img, (x+img.width), 0);
    }
}

jswars.ResourceLoader = function() {
    this.total = 0;
    this.loaded = 0;
}

jswars.ResourceLoader.prototype.load = function(type, name, url) {
    var self = this;
    var data = document.createElement(type);
    self[name] = data;
    self.total ++;

    // TODO: proper error handling
    $(data).one('error', function(){ 
        console.log('error', url);
        self.loaded ++;
    });
    if(type == 'video' || type == 'audio') {
        $(data).one('canplaythrough', function(){ console.log('loaded', url); self.loaded ++;});
        data.setAttribute('autobuffer', 'autobuffer');
        data.setAttribute('src', url);
        data.load();
    }
    else {
        data.setAttribute('src', url);
        $(data).one('load', function(){ console.log('loaded', url); self.loaded ++;});
    }
}

jswars.main = function(){
    jswars.html5av = document.createElement('video').load != undefined;
    // hack to exclude FireFox 3.5 Beta 4
    jswars.no_video = navigator.productSub == "20090423";
    jswars.data = new ResourceLoader();
    data.load('img', 'player_ship', 'gfx/player_ship.png');
    data.player_ship.frames = 10;
    data.load('img', 'rocket', 'gfx/rocket%20animated.png');
    data.rocket.frames = 1;
    data.load('img', 'nuke', 'gfx/nuke.png');
    data.nuke.frames = 10;
    data.load('img', 'asteroid', 'gfx/asteroid.png');
    data.load('img', 'mine', 'gfx/mine.png');
    data.load('img', 'background_menu', 'gfx/background_menu.jpg');
    data.load('img', 'background0', 'gfx/background0.jpg');
    data.load('img', 'background1', 'gfx/background1.png');
    data.load('img', 'background2', 'gfx/background2.png');
    data.load('img', 'shot', 'gfx/shot.png');
    data.load('img', 'eye', 'gfx/eye.png');
    data.load('img', 'eye_explosion', 'gfx/eye_explosion.png');
    data.eye_explosion.frames = 4;
    data.load('img', 'mine_blink', 'gfx/mine_blink.png');
    data.mine_blink.frames = 2;
    data.load('img', 'explosion0', 'gfx/explosion.png');
    data.explosion0.frames = 17;
    data.load('img', 'explosion1', 'gfx/explosion2.png');
    data.explosion1.frames = 17;
    data.load('img', 'explosion2', 'gfx/explosion3.png');
    data.explosion2.frames = 17;
    data.explosion = [data.explosion1, data.explosion2, data.explosion0];
    data.load('img', 'missile_powerup', 'gfx/missile_powerup.png');
    data.missile_powerup.frames = 19;
    data.load('img', 'radioactive_powerup', 'gfx/radioactive_powerup.png');
    data.radioactive_powerup.frames = 19;
    data.load('img', 'skull', 'gfx/skull.png');
    data.skull.frames = 30;
    data.load('img', 'fireball', 'gfx/fireball.png');
    if(html5av)
    {
        data.load('audio', 'explosion_sound', 'data/explosion.ogg');
        data.load('audio', 'music', 'data/countdown-behind.ogg');
        // hack: force music to be loaded
        data.music.volume = 0;
        data.music.play();
    }
    jswars.screen = $('#screen');
    jswars.width = screen.width();
    jswars.height = screen.height();
    jswars.ctx = screen[0].getContext('2d');
    jswars.keys = new KeyTracker();
    // this is a hack to keep track of focus
    screen.click(function() {
        keys.focus = true;
    });
    $('input').add('textarea').click(function() {
        keys.focus = false;
    });


    jswars.timer = new Timer();
    jswars.intro = new Intro();

    jswars.highscores = JSON.parse($.cookie('jswars.highscores') || '[]');
}


jswars.Timeline = function(data) {
    // [[time, function]]
    this.data = data || [];
    this.dirty = true;
}


jswars.Timeline.prototype.tick = function(t) {
    if(this.dirty){
        this.data.sort(function(a,b){return a[0]-b[0]});
        this.data.reverse();
        this.dirty = false;
    }
    while(this.data.length && this.data[this.data.length-1][0] <= t) {
        this.data.pop()[1]();
    }
}

jswars.Timeline.prototype.add = function(t, f){
    this.push([t, f]);
    this.dirty = true;
}


jswars.Credits = function() {
    var FONT_HEIGHT = 20;
    timer.set_rate(30);
    var text = [
        "Software Development: Jonas Wagner",
        "3D Artwork: Jonas Wagner",
        "2D Artwork: Jonas Wagner",
        "Sound Effects: Jonas Wagner",
        "Music: Countdown - Behind <http://www.countdown.fr.fm>"];
    var t = 0;
    timer.ontick = function(td) {
        t += td;
        ctx.drawImage(data.background0, 0, 0);
        ctx.fillStyle = 'gold';
        var y = height-min(t, 10)*20;
        var h = 0;
        var w;
        ctx.font = FONT_HEIGHT + 'px sans-serif';
        fillTextMultiline(ctx, text, 50, y, FONT_HEIGHT*1.5);
//        ctx.drawImage(data.background0, 0, 0, data.background0.width, 100, 0, 0, data.background0.width, 100);
        ctx.fillStyle = 'gold';
        ctx.font = '20px Impact';
        ctx.fillText('Credits', (width-ctx.measureText('Credits').width)/2, 40);
    }
    
    // this is a bit hacky but ok for now
    var keyevent = $(document).one('keydown.credits', function(evt){
        jswars.menu.enter();
    });

}

jswars.Intro = function() {
    var self = this;
    var DEPTH = 100;
    var STAR_SIZE = 3;
    var STARS = 1000;
    var FONT_HEIGHT = 32;

    var stars = [];
    var cam_z = 0;

    function spawn_star() {
        return [(Math.random()-0.5)*width*Math.sqrt(DEPTH)/2,
                (Math.random()-0.5)*height*Math.sqrt(DEPTH)/2,
                DEPTH+cam_z]
    }

    for(var i = 0; i < STARS; i ++){
        stars.push([(Math.random()-0.5)*width*Math.sqrt(DEPTH)/2,
                (Math.random()-0.5)*height*Math.sqrt(DEPTH)/2,
                Math.random()*DEPTH+cam_z])
    }

    function draw() {
        if(data.total == data.loaded && cam_z > 3){
            ctx.restore();
            jswars.menu = new jswars.Menu();

        }

        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = 'white';
        for(var i = 0; i < stars.length; i++){
            if(stars[i][2] <= cam_z){
                stars[i] = spawn_star();
            }
            var z = Math.sqrt(stars[i][2] - cam_z);
            var x = (stars[i][0]/z)+width/2;
            var y = (stars[i][1]/z)+height/2;
            if(x < 0 || x > width || y < 0 || y > height){
                stars[i] = spawn_star();
                continue;
            }
            ctx.beginPath();
            ctx.arc(x, y, STAR_SIZE/z, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fill();
        }

        ctx.fillStyle = 'gold';
        ctx.font = FONT_HEIGHT + 'px Impact';
        var tw = ctx.measureText('JS-TYPE').width;
        ctx.fillText("JS WARS", (width-tw)/2, (height-FONT_HEIGHT)/2);
        ctx.font = FONT_HEIGHT/2 + 'px Impact';
        if(data.total > data.loaded){
            var text = 'Loading... please be patient';
            var tw = ctx.measureText(text).width;
            ctx.fillText(text, (width-tw)/2, (height-FONT_HEIGHT/2)/2+FONT_HEIGHT);
        }
        var progress_width = 128;
        ctx.strokeStyle = 'red';
        ctx.strokeRect((width-progress_width)/2, height/2+FONT_HEIGHT, progress_width, 25);
        ctx.fillRect((width-progress_width)/2, height/2+FONT_HEIGHT, progress_width/data.total*data.loaded, 25);
    }

    timer.ontick = function(td) {
        cam_z += td;
       draw();
    }
    ctx.save();
    timer.set_rate(15);
}


jswars.Menu = function() {
    var self = this;
    var FONT_HEIGHT = 18;
    var items = [
        ['Start Game', function() { self.exit(); jswars.game = new Game(levels[0]);}],
        ['Highscores', function() { self.exit(); new Highscores(); }],
        ['Credits', function() {self.exit(); new Credits(); }]
    ];
    var selected = 0;
    ctx.save();
    function draw(){
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, width, height);
        ctx.font = FONT_HEIGHT + 'px Impact';
        ctx.drawImage(data.background_menu, 0, 0, width, height);
        for(var i = 0; i < items.length; i ++)
        {
            ctx.fillStyle = (i == selected) ? 'red' : 'gold';
            var text = items[i][0];
            var tw = ctx.measureText(text).width;
            ctx.fillText(text, (width-tw)/2, 200+i*FONT_HEIGHT*1.5);
        }
    }

    this.enter = function(){
        timer.ontick = draw;
        timer.set_rate(10);

        // this is a bit hacky but ok for now
        $(document).bind('keydown.menu', function(evt){
            // hack related to focus of keytracker
            if(!keys.focus) return;
            //$(document).unbind('keydown.menu');
            if(evt.keyCode == 40){
                selected ++;
                selected %= items.length;
            }
            if(evt.keyCode == 38){
                selected --;
                if(selected < 0) selected = items.length-1;
            }
            if(evt.keyCode == 32 || evt.keyCode == 13){
                items[selected][1]();
        // TODO           $(video).unbind();
        //
            }
        });
    }
    this.enter();

    this.exit = function(){
        $(document).unbind('keydown.menu');
    }
}

jswars.Highscores = function(score) {
    var self = this;

    if(score && highscores.length < 10 || score > highscores[highscores.length]){
        // todo: enter name
        jswars.highscores.push([score, prompt('Gameover - enter your name')]);
        jswars.highscores.sort(function(a,b){return b[0]-a[0];});
        if(jswars.highscores.length > 10) {
            jswars.highscores.pop();
        }
        $.cookie('jswars.highscores', JSON.stringify(jswars.highscores), {expires: 365*10})
    }

    var FONT_HEIGHT = 18;
    var bw = 640;
    var bh = 480;
    var buffer = Canvas(bw, bh);
    var bctx = buffer.getContext('2d');
    bctx.fillRect(0, 0, bw, bh);
    ctx.save();
    var t = 0.0;
    function draw(dt){
        t += dt;
//        bctx.fillStyle = 'rgba(' + Math.floor(smoothnoise(t*2)*122+123) + ', ' + Math.floor(smoothnoise(t)*122+123) + ', 250, 0.8);';
        bctx.fillStyle = 'rgba(100, 150, 250, 0.8);';
        for(var i = 0; i < bw/4; i ++) {
            var noise = (smoothnoise(i/6, t*2)*2 + smoothnoise2d(i/4, t*6)*2 + smoothnoise2d(i, t*8))/5;
            bctx.fillRect(i*4, bh/4+noise*bh/4, 2, 2);
        }
//        bctx.drawImage(buffer, -bw/100+(Math.random()), -2, bw+bw/50, bh+5);
        bctx.drawImage(buffer, Math.round(-bw/100+(Math.random())), 2, bw+bw/50, bh+5);
        ctx.drawImage(buffer, 0, 0, width, height);
        ctx.fillStyle = 'gold';
        ctx.font = FONT_HEIGHT + 'px Impact';
        var text = (score) ? ('Game over - Score: ' + score) : 'Highscores';
        var tw = ctx.measureText(text).width;
        ctx.fillText(text, (width-tw)/2, 100);
        ctx.font = '12px sans-serif';
        var score_text = [];
        for(var i = 0; i < highscores.length; i ++){
            score_text.push(highscores[i][0] + ' - ' + highscores[i][1]);
        }
        fillTextMultiline(ctx, score_text, 100, 120+FONT_HEIGHT, 12*1.5);
    }

    timer.ontick = draw;
    timer.set_rate(20);

    // this is a bit hacky but ok for now
    $(document).one('keydown.gameover', function(evt){
        jswars.menu.enter();
    });
}


jswars.Game = function(Level){
    var self = this;

    jswars.keys.reset();

    self.enemies = new SpriteGroup();
    self.friends = new SpriteGroup();
    self.neutral = new SpriteGroup();
    self.graphics = new SpriteGroup();
    self.player = new Player(self, data.player_ship)
    self.player.x = 20;
    self.player.y = (height-self.player.h)/2;
    self.friends.push(self.player);

    self.background = new ParallaxScroller([], width)

    self.level = new Level(self);
    self.t = 0;
    self.score = 0;
    self.paused = false;

    ctx.save();

    if(html5av && data.music){
        data.music.volume = 1.0;
        data.music.play();
        try{
            data.music.currentTime = 0.0;
        }
        catch(e) {console.log('could not set current time on music');}
    }

    function check_collision(a, b){
        return !(
            a.y + a.h < b.y || 
            a.y > b.y + b.h ||
            a.x + a.w < b.x ||
            a.x > b.x + b.w
        )
    }

    function draw() {
        self.background.draw(ctx, self.t);
        self.player.draw(ctx);
        self.enemies.draw(ctx);
        self.graphics.draw(ctx);
        self.friends.draw(ctx);
        self.neutral.draw(ctx);
        ctx.fillStyle = 'gold';
        ctx.font = '12px Impact';
        ctx.fillText('Score ' + self.score + ' Health ' + Math.round(self.player.hp), 10, 15);
        ctx.fillText(self.player.secondary_weapon.name + ': ' + self.player.secondary_weapon.ammo, 10, 30);
    }

    timer.ontick = function (td) {
        if(self.paused) return;
        self.t += td;
        self.level.tick(td);
        var player = self.player;
        if(keys.LEFT) player.x -= player.speed*td;
        if(keys.RIGHT) player.x += player.speed*td;
        if(player.x < 0) player.x = 0;
        if(player.x + player.w > width) player.x = width - player.w;
        if(keys.UP) player.y -= player.speed*td;
        if(keys.DOWN) player.y += player.speed*td;
        if(player.y < 0) player.y = 0;
        if(player.y + player.h > height) player.y = height - player.h;

        if(keys.SPACE) player.primary_weapon.fire();
        if(keys.CTRL) player.secondary_weapon.fire();

        var i, j;
        var enemies = self.enemies;
        self.player.tick(td);
        self.enemies.tick(td);
        self.friends.tick(td);
        self.graphics.tick(td);
        self.neutral.tick(td);
        self.enemies.cleanup();
        self.friends.cleanup();
        self.graphics.cleanup();
        self.neutral.cleanup();
        do_collosion(self.enemies.sprites, self.friends.sprites);
        do_collosion(self.player, self.enemies.sprites);

        do_collosion(self.player, self.neutral.sprites);
        do_collosion(self.neutral.sprites, self.friends.sprites);
        do_collosion(self.neutral.sprites, self.enemies.sprites);

        draw();
        if(player.hp <= 0 || player.dead){
            if(html5av) {
                data.music.pause();
            }
            new Highscores(self.score);
            $(document).unbind('keydown.game');
        }
    }

    var keyevent = $(document).bind('keydown.game', function(evt){
        if(evt.keyCode == 27 || evt.keyCode == 19){
            self.paused = !self.paused;
            if(self.paused){
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.fillRect(0, 0, width, height);
                ctx.fillStyle = 'gold';
                ctx.strokeStyle = 'black';
                ctx.font = '32px Impact';
                var tw = ctx.measureText('Paused').width;
                ctx.fillText('Paused', (width-tw)/2, (height-32)/2);
                ctx.strokeText('Paused', (width-tw)/2, (height-32)/2);
            }
        }
    });
 
    timer.set_rate(30);
}

jswars.Sprite = function(img) {
    this.img = img;
    this.x = 0;
    this.y = 0;
    this.w = img.width;
    this.h = img.height;
    this.dead = false;
    this.hp = 10;
    this.dmg = 10;
};
Sprite.prototype.draw = function(ctx) {
    ctx.drawImage(this.img, Math.floor(this.x), Math.floor(this.y), this.img.width, this.img.height);
}
Sprite.prototype.tick = function(td){};
Sprite.prototype.die = function(){ this.dead = true; };


SpriteGroup = function() {
    this.sprites = [];
}
SpriteGroup.prototype = {};
SpriteGroup.prototype.push = function(sprite) {
    this.sprites.push(sprite);
}
SpriteGroup.prototype.tick = function(td) {
    for(var i = 0; i < this.sprites.length; i ++){
        this.sprites[i].tick(td);
    }
    for(var i = 0; i < this.sprites.length; i ++){
        var sprite = this.sprites[i];
        if(sprite.hp <= 0 || sprite.x+sprite.w < 0 || sprite.x > width){
            sprite.die();
        }
    }
}
SpriteGroup.prototype.draw = function(ctx) {
    for(var i = 0; i < this.sprites.length; i ++){
        this.sprites[i].draw(ctx);
    }
}
SpriteGroup.prototype.cleanup = function() {
    var sprites = this.sprites;
    this.sprites = [];
    for(var i = 0; i < sprites.length; i++)
    {
        if(!sprites[i].dead) {
            this.sprites.push(sprites[i]);
        }
    }
}
SpriteGroup.prototype.splash_damage = function(dmg, cx, cy) {
    for(var i = 0; i < this.sprites.length; i++){
        var sprite = this.sprites[i];
        var dx = cx-sprite.x;
        var dy = cy-sprite.y;
        sprite.hp -= dmg/max(50, Math.sqrt(dx*dx+dy*dy));
    }
}
SpriteGroup.prototype.area_damage = function(dmg, cx, cy, r) {
    for(var i = 0; i < this.sprites.length; i++){
        var sprite = this.sprites[i];
        var dx = cx-sprite.x;
        var dy = cy-sprite.y;
        if(Math.sqrt(dx*dx+dy*dy)< r){
            sprite.hp -= dmg;
        }
    }
}

jswars.Animation = function(img, framerate)  {
    Sprite.call(this, img);
    this.frames = img.frames;
    this.framerate = framerate;
    this.w = img.width/this.frames;
    this.t = 0;
}
$.extend(Animation.prototype, Sprite.prototype);
Animation.prototype.tick = function(td){this.t += td; };
Animation.prototype.draw = function(ctx) {
    var duration = this.framerate;
    var w = this.img.width/this.frames;
    var x = Math.floor((this.t%(duration*this.frames))/duration)*w;
    ctx.drawImage(this.img, x, 0, w, this.img.height, Math.floor(this.x), Math.floor(this.y), w, this.img.height);
}

jswars.EyeExplosion = function(x, y) {
    Animation.call(this, data.eye_explosion, 0.10);
    this.x = x;
    this.y = y;
}
$.extend(EyeExplosion.prototype, Animation.prototype);
EyeExplosion.prototype.tick = function(td){this.t += td; if(this.t > this.frames*this.framerate) this.die(); };

jswars.Explosion = function(x, y) {
    Animation.call(this, data.explosion[Math.floor(Math.random()*data.explosion.length)], 0.05);
    if(html5av) {
        data.explosion_sound.cloneNode(true).play();
    }
    this.x = x - this.w/2;
    this.y = y - this.h/2;
    this.hp = 10000;
    this.dmg = 50;
}
$.extend(Explosion.prototype, Animation.prototype);
Explosion.prototype.tick = function(td){this.t += td; if(this.t > this.frames*this.framerate) this.die();};


jswars.Player = function (game, img) {
    Animation.call(this, img, 0.1);
    this.speed = 500;
    this.hp = 100;
    this.w -= 25;
    var self = this;
    this.primary_weapon = new Weapon('Blaster', function() { 
            return new Shot(self.x + self.w, self.y + self.h/3, 1000, 60);
        }, 0.2, game.friends);
    this.secondary_weapon = new Weapon('Missiles', function() { 
            return new Missile(self.x + self.w, self.y + self.h/3, 300);
        }, 1.0, game.friends, 5);
};
$.extend(Player.prototype, Animation.prototype);
Player.prototype.draw = function(ctx) {
    if(this.secondary_weapon.name == 'Nuke' && this.secondary_weapon.ammo > 0) {
        var w = data.nuke.width/data.nuke.frames;
        ctx.drawImage(data.nuke, 0, 0, w, data.nuke.height, Math.floor(this.x+10), Math.floor(this.y+16), w, data.nuke.height);
//        ctx.drawImage(data.nuke, Math.floor(this.x)-60, Math.floor(this.y + this.h), data.nuke.width/data.nuke.frames, data.nuke.height);

    }
   // todo: copy & pasted from Animation needs refactoring
    var duration = this.framerate;
    var w = this.img.width/this.frames;
    var x = Math.floor((this.t%(duration*this.frames))/duration)*w;
    ctx.drawImage(this.img, x, 0, w, this.img.height, Math.floor(this.x)-25, Math.floor(this.y), w, this.img.height);
//    ctx.drawImage(this.img, Math.floor(this.x)-60, Math.floor(this.y), this.img.width, this.img.height);
}
Player.prototype.tick = function(td) {
    this.hp = min(this.hp + td, 100);
    this.t += td;
}


jswars.Weapon = function(name, projectile, rate, group, ammo) {
    this.name = name;
    this.projectile = projectile;
    this.rate = rate;
    this.group = group;
    this.ammo = ammo || -1;
    this.t = 0;
}
jswars.Weapon.prototype.fire = function() {
    if(game.t-this.t > this.rate && this.ammo != 0) {
        this.t = game.t; 
        this.group.push(this.projectile());
        this.ammo --;
    }
}


jswars.Projectile = function (x, y, vx, img) {
    Sprite.call(this, img);
    this.x = x;
    this.y = y;
    this.vx = vx;
}
$.extend(Projectile.prototype, Sprite.prototype);
Projectile.prototype.tick = function(td) {
    this.x += this.vx * td;
    if(this.x > width || this.x+this.w < 0) this.dead = true;
}


jswars.Missile = function (x, y, vx, img) {
    Projectile.call(this, x, y, vx, data.rocket);
    Animation.call(this, data.rocket, 0.05);
    this.x = x;
    this.y = y;
    this.hp = 1;
    this.dmg = 100;
};
$.extend(Missile.prototype, Projectile.prototype, Animation.prototype);
Missile.prototype.tick = function(td) {
    Projectile.prototype.tick.call(this, td);
    Animation.prototype.tick.call(this, td);
};
Missile.prototype.die = function() {
    game.enemies.area_damage(100, this.x+this.w/2, this.y+this.h/2, 100);
    game.graphics.push(new Explosion(this.x+this.w/2, this.y+this.h/2));
    this.dead = true;
}

jswars.Nuke = function (x, y, vx) {
    Projectile.call(this, x, y, vx, data.nuke);
    Animation.call(this, data.nuke, 0.05);
    this.x = x;
    this.y = y;
    this.hp = 1;
    this.dmg = 100;
};
$.extend(Nuke.prototype, Projectile.prototype, Animation.prototype);
Nuke.prototype.tick = function(td) {
    Projectile.prototype.tick.call(this, td);
    Animation.prototype.tick.call(this, td);
}
Nuke.prototype.die = function(){
    game.enemies.splash_damage(8000, this.x, this.y)
    new NukeEffect(this.x, this.y);
    this.dead = true;
};

jswars.Shot = function(x, y, vx, dmg, img) {
    Projectile.call(this, x, y, vx, img||data.shot);
    this.dmg = dmg;
    this.hp = 1;
}
Shot.prototype = Projectile.prototype;


jswars.RadioactivePowerup = function(x, y, vx, vy) {
    Animation.call(this, data.radioactive_powerup, 0.05);
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.hp = 10;
};
$.extend(RadioactivePowerup.prototype, Animation.prototype);
RadioactivePowerup.prototype.tick = function(td) {
    Animation.prototype.tick.call(this, td);
    this.x += this.vx*td;
    this.y += this.vy*td;
};
RadioactivePowerup.prototype.die = function() {
    if(this.hp != 10) {
        console.log('activated radioactive powerup');
        game.player.secondary_weapon =  new Weapon('Nuke', function() {
            return new Nuke(game.player.x, game.player.y+16, 100);
        }, 1.0, game.friends, 1);
    }
    this.dead = true;
};

jswars.MissilePowerup = function(x, y, vx, vy) {
    // todo: generalize
    Animation.call(this, data.missile_powerup, 0.05);
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.hp = 10;
}
$.extend(MissilePowerup.prototype, Animation.prototype);
MissilePowerup.prototype.tick = function(td) {
    Animation.prototype.tick.call(this, td);
    this.x += this.vx*td;
    this.y += this.vy*td;
};
MissilePowerup.prototype.die = function() {
    if(this.hp != 10) {
        console.log('activated missile powerup');
        // todo: centralize
        game.player.secondary_weapon = new Weapon('Missiles', function() { 
            return new Missile(game.player.x + game.player.w, game.player.y + game.player.h/3, 300);
        }, 1.0, game.friends, 5);
    }
    this.dead = true;
};


// TODO: join this with Missile?
jswars.Mine = function (x, y, vx, vy) {
//    console.log('mine', x, y, vx);
    Sprite.call(this, data.mine);
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.hp = 20;
};

$.extend(Mine.prototype, Sprite.prototype);
Mine.prototype.tick = function(td) {
    this.x += this.vx * td;
    this.y += this.vy * td;
    this.y += Math.sin(game.t)*td*20;
}
Mine.prototype.die = function() {
    // explode
    game.graphics.push(new Explosion(this.x+this.w/2, this.y+this.h/2));
    game.score += 10;
    this.dead = true;
    this.hp = 25;
};


jswars.TrackingMine = function (x, y, v) {
    Animation.call(this, data.mine_blink, 1.0)
    this.x = x;
    this.y = y;
    this.v = v;
}
$.extend(TrackingMine.prototype, Animation.prototype);
TrackingMine.prototype.tick = function(td) {
    if(this.x < game.player.x) {
        this.t = 1.0;
        var v = v2(this.x-game.player.x, this.y-game.player.y).normalize().mul(this.v*td);
        this.x += v.a;
        this.y += v.b;
    }
    else{
        this.x += this.v*td;
        this.t = 0.0;
    }
}
TrackingMine.prototype.die = function() {
    // explode
    game.graphics.push(new Explosion(this.x+this.w/2, this.y+this.h/2));
    game.enemies.area_damage(40, this.x+this.w/2, this.y+this.h/2, 150);
    game.friends.area_damage(40, this.x+this.w/2, this.y+this.h/2, 150);
    game.score += 15;
    this.dead = true;
};


jswars.SkullBoss = function(x, y) {
    Animation.call(this, data.skull, 0.05);
    this.x = x;
    this.y = y;
    this.hp = 500;
    this.lastshot = 0;
    this.v = 0;
}
$.extend(SkullBoss.prototype, Animation.prototype);
SkullBoss.prototype.tick = function(td) {
    this.t += td;
    this.v = max(-1.0, min(1.0, (game.player.y-this.y-125)/200))*200;
    this.y += this.v*td;
    if(this.t%1.5 > 1.0 && this.t-this.lastshot > 0.5) {
        this.lastshot = this.t;
        game.enemies.push(new Shot(this.x, this.y+125, -300, 600, data.fireball));
    }
}
SkullBoss.prototype.die = function() {
    new NukeEffect(this.x, this.y);
    game.score += 1000;
    this.dead = true;
}


jswars.Eye = function (x, y, vx, vy) {
    Sprite.call(this, data.eye);
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.hp = 25;
};


$.extend(Eye.prototype, Sprite.prototype);
Eye.prototype.tick = function(td) {
    this.x += this.vx * td;
    this.y += this.vy * td;
    if(Math.random() > 0.99) {
        game.enemies.push(new Shot(this.x, this.y + this.h/2, -500, 200));
    }
}
Eye.prototype.die = function(){
    // explode
    game.graphics.push(new EyeExplosion(this.x, this.y));
    console.log('dead');
    game.score += 30;
    this.dead = true;
};

jswars.NukeEffect = function(cx, cy) {
    var scale = 8;
    var w = width/scale;
    var h = height/scale;
    var buffer = new Canvas(w, h);
    var buffer_clear = new Canvas(width, height);
//    document.body.appendChild(buffer);
    var bctx = buffer.getContext('2d');
    var bctx_clear = buffer_clear.getContext('2d');
//    var bdata_clear = ctx.getImageData(0, 0, width, height);
//    bctx_clear.putImageData(bdata_clear, 0, 0);
    bctx_clear.drawImage(screen[0], 0, 0);
    bctx.drawImage(screen[0], 0, 0, w, h);
    ctx.drawImage(buffer, 0, 0, width, height);
    var maxi = width*height*4;
    var bdata = ctx.getImageData(0, 0, width, height);
    if(bdata == null) {
        console.log('bdata is null, probably webkit');
        return;
    }
    var t = 0;
    var oldtick = timer.ontick;
    var oldrate = timer.rate;
    var amplitude = 100;
    var period = Math.PI*2/200;
    var v = -2;
//    var cx = width/3;
//    var cy = height/2;
    // createImageData is unsupported by some browsers
    var sdata = bctx.getImageData(0, 0, w, h);

    timer.ontick = function(td) {
        t += td;
        for(var x = 0; x < w; x ++) {
            for(var y = 0; y < h; y ++) {
                var i = (y*w+x)*4;
                var bx = x*scale;
                var by = y*scale;
                var xd = cx-bx;
                var yd = cy-by;
                var d = Math.sqrt(xd*xd+yd*yd);
                var o = Math.sin(d*period+t*v)*(amplitude/(1+(d/100)*(d/100))/t);
                bx = Math.round(bx+o*(xd/d));
                by = Math.round(by+o*(yd/d));
                var bi = (by*width+bx)*4;
                if(bi > maxi || bi < 1) {
                    sdata[i+3] = 0;
                }
                else{
                    sdata.data[i] = min(255, bdata.data[bi]*2);
                    sdata.data[i+1] = min(255, bdata.data[bi+1]*2);
                    sdata.data[i+2] = min(255, bdata.data[bi+2]*2);
                    sdata.data[i+3] = min(255, 15*Math.abs(o));
                }
            }
        }
        bctx.putImageData(sdata, 0, 0);
        ctx.drawImage(buffer_clear, 0, 0);
        ctx.drawImage(buffer, 0, 0, width, height);
//        ctx.putImageData(bdata_clear, 0, 0, width, height);
        console.log('drawn');
        if(t > 1.5) {
            timer.ontick = oldtick;
            timer.set_rate(oldrate);
        }
    }
//    timer.set_rate(20);
}

levels.push(function(game){
    var self = this;
    var boss = new SkullBoss(jswars.width-data.skull.width/data.skull.frames-10, jswars.height/2);
    
    function spawn_mine() {
        // todo: hacky
        var mine = new ([Eye, TrackingMine][Math.round(Math.random()*1)])(jswars.width, Math.random()*(height-data.mine.height), -30 - self.t, Math.random()*20-10);
        game.enemies.push(mine);
    }

    function spawn_powerup() {
        if(Math.random() > 0.5){
            game.enemies.push(new RadioactivePowerup(jswars.width, Math.random()*height, -250, 0));
        }
        else {
            game.enemies.push(new MissilePowerup(jswars.width, Math.random()*height, -250, 0));
        }
    }

    self.name = 'New Easy Level';
    var spawns = [];
    for(var i = 0; i < 1000; i ++) {
        spawns.push([i, spawn_mine]);
        if(i%30 == 0) {
            spawns.push([i, spawn_powerup]);
        }
    }
    spawns.push([150, function() {
        game.enemies.push(boss);
    }]);
//    spawns.push([135, function() {game.player.die();}])
    self.timeline = new Timeline(spawns);
    self.t = 0.0;
    game.background.layers = [[0,0, data.background0], [0, -3, data.background1], [0, -20, data.background2]];

    self.tick = function(t) {
        self.t += t;
        game.player.dead |= boss.dead;
        self.timeline.tick(self.t);
    }
});

$(function(){main()});
}
