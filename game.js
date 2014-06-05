var foodCount = 1;
var points = 0;
var lives = 10;
var canvas;
var paused;
var mousePos = {
  x: 30,
  y: 175
};



/* Creates game, players, and obstacles */
var Game = function () {
  this.c = new Coquette(this, "canvas", canvas.width, canvas.height, "#D0D0D0");

  //bind player to mouse for non-touchscreen players
  this.c.inputter.bindMouseMove(function (position) {
    mousePos.y = position.y;
    //console.log("The mouse is at", position.x, position.y);
  });

  //defines player, its position, and collision behavior
  this.c.entities.create(Person, {
    center: {
      x: 30,
      y: 175
    },
    update: function () {
      this.center.y = mousePos.y;
    },
    collision: function (other, type) {
      if ((other instanceof Obstacle) && (type === this.c.collider.INITIAL)) {
        lives--;
        if (lives == -1) {
          gameOver(this.c);
        }
        this.size = {
          x: 20,
          y: 20
        };
        foodCount = 1;
        console.log("woops");

        //animation
      } else if ((other instanceof FoodItem) && (type === this.c.collider.INITIAL)) {
        foodCount++;
        var newx = this.size.x * 1.02;
        var newy = this.size.y * 1.02;
        console.log("YUM");
        this.size = {
          x: newx,
          y: newy
        };
        this.c.entities.destroy(other);
      } else {
        console.log(other);
      }
      //if other == Obstacle, shrinks
      //else if other == FoodItem, increase size
    }
  });

  //this.c.entities.create(Obstacle, {center: {x:500, y: 60}, size:{ x: 30, y: 60}, color:"red"});

  createObstaclesAndFood(this, this.c);
};


var createObstaclesAndFood = function (game, c) {

  if (paused) {
    console.log("Game is paused");
  } else if (lives < 0) {
    console.log("You died");
  } else {
    c.entities.create(Obstacle, {
      center: {
        x: canvas.width,
        y: canvas.height * Math.random()
      },
      size: {
        x: 30 + 30 * Math.random(),
        y: 100 * Math.random()
      }
    });
    //create one food item ~ for every three obstacles
    if (Math.random() * 100 < 30) {
      c.entities.create(FoodItem, {
        center: {
          x: canvas.width,
          y: canvas.height * Math.random()
        }
      });
    }
    setTimeout(function () {
      createObstaclesAndFood(game, c);
    }, Math.random() * level());
  }
};

//returns the speed of the obstacles
var speed = function () {
  return 0.1 + (Math.pow(points, 1 / 5)) / 80;
};

//returns the time interval between obstacles
var level = function () {
  return 5000 - lives;
};

//function to create Player. defines size, drawing function, etc.
var Person = function (game, settings) {

  this.c = game.c;
  for (var i in settings) {
    this[i] = settings[i];
  }
  this.size = {
    x: 20,
    y: 20
  };
  this.boundingBox = this.c.collider.CIRCLE;
  this.draw = function (ctx) {
    ctx.fillStyle = "#339933";
    /*ctx.fillRect(this.center.x - this.size.x/2,
				this.center.y - this.size.y/2,
				this.size.x,
				this.size.y);
			*/
    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, this.size.x, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
  };

};

var Obstacle = function (game, settings) {

  this.c = game.c;
  for (var i in settings) {
    this[i] = settings[i];
  }
  this.boundingBox = this.c.collider.RECTANGLE;
  this.angle = 180 * Math.random();

  this.draw = function (ctx) {
    ctx.fillStyle = "#FF6600";
    ctx.fillRect(this.center.x - this.size.x / 2,
      this.center.y - this.size.y / 2,
      this.size.x,
      this.size.y);
  }
  this.update = function (timeSinceLastTick) {
    if (!paused) {
      this.center.x -= speed() * timeSinceLastTick;
    }
    if (this.center.x < -80) {
      console.log("Obstacle being deleted. Points: " + points + " Food items: " + foodCount);
      points += foodCount;
      console.log(points);
      this.c.entities.destroy(this);
      $("#points").html("Score : " + points);
    }

  };
};

var FoodItem = function (game, settings) {

  this.c = game.c;
  this.boundingBox = this.c.collider.CIRCLE;
  this.angle = 0;

  for (var i in settings) {
    this[i] = settings[i];
  }
  this.size = {
    x: 5,
    y: 8
  };
  this.draw = function (ctx) {
    ctx.fillStyle = "#009933";
    /*ctx.fillRect(this.center.x - this.size.x/2,
				this.center.y - this.size.y/2,
				this.size.x,
				this.size.y);
			}*/
    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, this.size.x, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    this.update = function (timeSinceLastTick) {
      if (!paused) {
        this.center.x -= 0.15 * timeSinceLastTick;
      }
    }
    if (this.center.x < 0) {
      this.c.entities.destroy(this);
    }
  };
};

var gameOver = function (game) {
  var currentScore = points;
  //this.c = game.c;
  console.log("function called?");
  var all = game.entities.all();
  console.log("entities are :" + all);
  var a;
  for (a in all) {
    console.log("deleting one entitity");
    game.entities.destroy(a);
  }
  //	alert();

  if (window.confirm("Game Over. Score: " + currentScore + ". Would you like to play again?")) {
    window.location = './index.html';
  } else {
    window.location = './index.html';
  }


};

window.addEventListener('load', function () {
  canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 50;
  Game();

});
document.ontouchmove = function (e) {
  e.preventDefault();
};

document.addEventListener('touchmove', function (e) {
  var touch = e.touches[0];
  mousePos.y = touch.pageY;
}, true);


var pauseGame = function () {
  if (paused) {
    paused = false;
  } else {
    paused = true;
  }
};

var newGame = function (game) {
  canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 50;

  var all = game.entities.all();
  console.log("entities are :" + all);
  var a;
  for (a in all) {
    console.log("deleting one entitity");
    game.entities.destroy(a);
  }
  foodCount = 1;
  points = 0;
  lives = 10;
  $("#points").html("Score : " + points);

  Game();
  paused = false;

};
