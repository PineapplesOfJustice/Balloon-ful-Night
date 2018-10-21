// write your Balloon constructor here!

var balloon = [];

var balloonBlocker = {x: 10, y: 270, width: 80, height: 43.07, moveX: 0, color: "black",};

var arrow = [];

var imageSrc = {};

function preload(){
    imageSrc["sky"] = loadImage("Images/Background/Sky.jpg");
    imageSrc["wall"] = loadImage("Images/Background/Wall.png");
    imageSrc["arrow"] = loadImage("Images/Background/Arrow.png");
}

function setup() {
    createCanvas(600, 400)
    background("#dad2f7");
    image(imageSrc["sky"], -100, 0, 785, 442);
    strokeWeight(3);
    textSize(18);
}

function draw() {
    background("#dad2f7");
    image(imageSrc["sky"], -100, 0, 785, 442);

    for(var i=0, length=balloon.length; i<length; i++){
        balloon[i].x += balloon[i].moveX.current;
        balloon[i].y += balloon[i].moveY.current;
        
        fill(balloon[i].color.current.red, balloon[i].color.current.green, balloon[i].color.current.blue);
        ellipse(balloon[i].x, balloon[i].y, balloon[i].width, balloon[i].height);
        fill("black");
        line(balloon[i].x, balloon[i].y + balloon[i].height/2, balloon[i].x, balloon[i].y + balloon[i].height/2 + balloon[i].stringLength);
        if(balloon[i].frozen.status && balloon[i].frozen.wait == balloon[i].frozen.need){
            for(var h=0, length=balloon.length; h<length; h++){
                if(!balloon[h].frozen.status){
                    if(collideCircleCircle(balloon[i].x, balloon[i].y, balloon[i].height, balloon[h].x, balloon[h].y, balloon[h].height)){
                        balloon[i].color.current = balloon[i].color.original;
                        balloon[i].moveX.current = balloon[i].moveX.original;
                        balloon[i].moveY.current = balloon[i].moveY.original;
                        balloon[i].frozen.status = false;
                        balloon[i].frozen.wait = 0;
                    }
                }
            }
        }
        else{
            balloon[i].frozen.wait += 1;
        }
        if(balloon[i].y < balloon[i].y*-1){
            balloon.splice(i, 1);
            i -= 1;
            length -= 1;
        }
    }
    
    //fill(balloonBlocker.color);
    balloonBlocker.x += balloonBlocker.moveX;
    image(imageSrc["wall"], balloonBlocker.x, balloonBlocker.y, balloonBlocker.width, balloonBlocker.height);
    
    if(balloonBlocker.x == 0 || (balloonBlocker.x+balloonBlocker.width) == 600){
        balloonBlocker.moveX = 0;
    }
    
    for(var i=0, length=balloon.length; i<length; i++){
        while(collideRectCircle(balloonBlocker.x, balloonBlocker.y, balloonBlocker.width, balloonBlocker.height, balloon[i].x, balloon[i].y, balloon[i].height)){
            balloon[i].y += 0.1;
        }
    }
    
    for (var i=0, length=arrow.length; i<length; i++){
        arrow[i].x += arrow[i].speed;
        if(arrow[i].x <= -(arrow[i].width)){
            arrow.splice(i, 1);
            i -= 1;
            length -= 1;
        }
        else{
            image(imageSrc["arrow"], arrow[i].x-(arrow[i].width/200), arrow[i].y+(arrow[i].height/200), arrow[i].width*1.01, arrow[i].height*1.01);
            imageSrc["arrow"].filter("invert");
            image(imageSrc["arrow"], arrow[i].x, arrow[i].y, arrow[i].width, arrow[i].height);
            imageSrc["arrow"].filter("invert");
            for(var h=0, balloonLength=balloon.length; h<balloonLength; h++){
                if(collideRectCircle(arrow[i].x, arrow[i].y, arrow[i].width, arrow[i].height, balloon[h].x, balloon[h].y, balloon[h].height)){
                    balloon.splice(h, 1);
                    h -= 1;
                    balloonLength -= 1;
                }
            }
            if(collideRectRect(arrow[i].x, arrow[i].y, arrow[i].width, arrow[i].height, balloonBlocker.x, balloonBlocker.y, balloonBlocker.width, balloonBlocker.height)){
                arrow.splice(i, 1);
                i -= 1;
                length -= 1;
            }
        }
    }
    
    
    
    var amountOfFrozenBalloon = 0;
    for(var i=0, length=balloon.length; i<length; i++){
        if(balloon[i].frozen.status){
            amountOfFrozenBalloon += 1;
        }
    }
    fill("white");
    text("Total Balloon: " + balloon.length, 13, 30);
    text("Frozen Balloon: " + amountOfFrozenBalloon, 13, 60);
}

var balloonWait = {current: 10, need: 10};
spawnBalloon();

function spawnBalloon(){
    if(balloonWait.current == balloonWait.need){
        balloonWait.current = 0;
        var red = Math.random()*255;
        var green = Math.random()*255;
        var blue = Math.random()*255;
        balloon[balloon.length] = new Balloon(Math.random()*600, 400, 40, 45, red, green, blue, 14, 3);
    }
    else{
        balloonWait.current += 1;
    }
    requestAnimationFrame(spawnBalloon);
}

var arrowWait = {current: 0, need: 400};
spawnArrow();

function spawnArrow(){
    if(arrowWait.current == arrowWait.need){
        arrowWait.current = 0;
        arrowWait.need = Math.floor(Math.random()*200) + 200;
        arrow[arrow.length] = new Arrow(640, (Math.random()*(400-96)) + 48, 96, 48, 15);
    }
    else{
        arrowWait.current += 1;
    }
    requestAnimationFrame(spawnArrow);
}

function Balloon(x, y, width, height, colorRed, colorGreen, colorBlue, stringLengthLimit, speedLimit){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = {current: {red: colorRed, green: colorGreen, blue: colorBlue,}, original: {red: colorRed, green: colorGreen, blue: colorBlue,}};
    this.stringLength = (Math.random()*(stringLengthLimit-5)) + 5;
    
    this.speed = Math.ceil(Math.random()*speedLimit);
    var moveX = Math.random();
    if(Math.random() < 0.1){
        moveX *= -1;
    }
    var moveY = -1;
    var scaleFactor = Math.sqrt(Math.pow(this.speed, 2)/(Math.pow(moveX, 2)+Math.pow(moveY, 2)));
    this.moveX = {current: moveX * scaleFactor, original: moveX * scaleFactor,};
    this.moveY = {current: moveY * scaleFactor, original: moveY * scaleFactor,};
    this.frozen = {status: false, wait: 0, need: 20,};
}

function Arrow(x, y, width, height, speed){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = -(speed);
}

function mouseClicked(){
    //var balloonPop = false;
    for(var i=0, length=balloon.length; i<length; i++){
        if(collidePointCircle(mouseX, mouseY, balloon[i].x, balloon[i].y, balloon[i].height)){
            balloon[i].color.current = {red: 255, green: 255, blue: 255,};
            balloon[i].moveX.current = 0;
            balloon[i].moveY.current = 0;
            balloon[i].frozen.status = true;
            balloon[i].frozen.wait = 0;
            //balloonPop = true;
        }
    }
}

function keyPressed(){
    if(keyCode == LEFT_ARROW || keyCode == 65){
        balloonBlocker.moveX = -5;
    }
    else if(keyCode == RIGHT_ARROW || keyCode == 68){
        balloonBlocker.moveX = 5;
    }
}

function keyReleased(){
    if(!keyIsPressed){
        balloonBlocker.moveX = 0;
    }
}