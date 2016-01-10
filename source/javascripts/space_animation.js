paper.install(window);

var mousePos, position, mousePercentageFromCenter;
var items = 2;
var count = 20;
var accordion = document.getElementById('middle-words');

window.onload = function() {
  paper.setup('ochapos-space');
  mousePos = paper.view.center.add([view.bounds.width / 3, 100]);
  position = paper.view.center;
  createScene();
  mousePercentageFromCenter = mousePos.y / paper.view.bounds.height
  paper.view.draw();

  paper.view.onFrame = function(event) {
    position = position.add( (mousePos.subtract(position).divide(10) ) );
    var vector = (view.center.subtract(position)).divide(10);
    moveStars(vector.multiply(3));
    // var distanceFromCenter = mousePos.x - view.center.x;
    // accordionText(distanceFromCenter);
  };
};



// ---------------------------------------------------
//  Helpers
// ---------------------------------------------------
window.onresize = function() {
  project.clear();
  createScene();
};

var random = function(minimum, maximum) {
  return Math.round(Math.random() * (maximum - minimum) + minimum);
};

var createScene = function() {

  // Draw the BG
  var background = new Path.Rectangle(paper.viewBounds);

  // Draw stars
  buildStars();
};

// ---------------------------------------------------
//  Stars (from paperjs.org examples section)
// ---------------------------------------------------
window.onmousemove = function(event) {
  mousePos.x = event.x;
  mousePos.y = event.y;
};

var buildStars = function() {

  var circle = new Path.Circle({
    center: [0, 0],
    radius: 8,
    fillColor: 'white',
  });
  var symbolCircle = new Symbol(circle);
  
  //var cactus = project.importSVG('http://ochapos.space.s3.amazonaws.com/images/cactus.svg');
  var cactus = project.importSVG(document.getElementById('cactus_svg'));
  cactus.fillColor = '#20ceac';
  var symbolCactus = new Symbol(cactus);
  
  var wave = project.importSVG(document.getElementById('wave_svg'));
  wave.fillColor = '#1eabf1';
  var symbolWave = new Symbol(wave);
  
  var star = project.importSVG(document.getElementById('star_svg'));
  star.fillColor = '#e2c51b';
  var symbolStar = new Symbol(star);

  var symbolNames = [symbolCactus, symbolCircle, symbolStar, symbolWave];
  
  // Place the instances of the symbol:
  // Iterate for different symbols
  for (var a = 0; a < symbolNames.length; a++) {
    // Iterate for each placement of that symbol
    for (var i = 0; i < count; i++) {
      // The center position is a random point in the view:
      var center = Point.random().multiply(paper.view.size);
      // Place symbol and scale
      var placed = symbolNames[a].place(center);
      placed.scale(i / count + 0.01);
      // Opacity clunks in Safari :(
      //placed.opacity = i / count + 0.1
      placed.data = {
        vector: new Point({
          angle: Math.random() * 360,
          length : (i / count) * Math.random() / 5
        })
      };
    }
  }
  
  var vector = new Point({
    angle: 45,
    length: 0
  });
};

var keepInView = function(item) {
  var position = item.position;
  var viewBounds = paper.view.bounds;
  if (position.isInside(viewBounds))
    return;
  var itemBounds = item.bounds;
  if (position.x > viewBounds.width + 5) {
    position.x = -item.bounds.width;
  }

  if (position.x < -itemBounds.width - 5) {
    position.x = viewBounds.width;
  }

  if (position.y > viewBounds.height + 5) {
    position.y = -itemBounds.height;
  }

  if (position.y < -itemBounds.height - 5) {
    position.y = viewBounds.height
  }
};

var moveStars = function(vector) {
  // Run through the active layer's children list and change
  // the position of the placed symbols:
  var layer = project.activeLayer;
  for (var i = 1; i < count * 4 + 1; i++) {
    var item = layer.children[i];
    var scale = item.scaling;
    var length = vector.length / 15 * scale.x;
    item.position = item.position.add( vector.normalize(length).add(item.data.vector) );
    
  /*  
    Trying to get items to scale up as they get farther from center

    var itemPos = item.position.y;
    var negative = itemPos, 
    itemPos = itemPos<0 ? 0 : itemPos;
    var bounds = paper.view.bounds.height / 2;
    
    if (itemPos > bounds) {
      item.opacity = 1 + (1/bounds) - ( itemPos / (bounds * 2) );
    } else {
      item.opacity = ( itemPos / (bounds) );
    }
  */
    
    keepInView(item);
  }
};

// ---------------------------------------------------
//  Accordion Text
// ---------------------------------------------------

var accordionText = function(distanceFromCenter) {

  var percentFromCenter = distanceFromCenter / (window.innerWidth / 2);

  percentFromCenter = -percentFromCenter>0 ? -percentFromCenter : percentFromCenter;

  if (0.2 >= percentFromCenter) {
    percentFromCenter = 0.000001;
  } else if (percentFromCenter >= 0.8) {
    percentFromCenter = 1;
  } else {
    percentFromCenter = (percentFromCenter - 0.2) / 0.6;
  }
  
  var accordion = document.querySelector('#middle-words');
  //accordion.style.opacity = percentFromCenter;
  //accordion.style.zoom = percentFromCenter;
  //accordion.style.webkitTransform = "scaleX(" + percentFromCenter + ")";
};
