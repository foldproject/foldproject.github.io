$(document).ready(function () {

/** -----------------    Events related to the canvas  ---------------------------  */

	var shapeList;
	var lineList;
	var hingeList;
	var dragging;
	var mouseX;
	var mouseY;
	var dragIndex;
	var dragHoldX;
	var dragHoldY;
	var timer;
	var targetX;
	var targetY;
	var easeAmount;
	var canvas;
	var context;
	var newDocument;
	var mode;
	var shapeOptionList;
	var shapeSelection = "square";
	var degToRad = 0.017453;
	var distance = 30;

	init();

	function init() {
		shapeList = [];
		shapeOptionList = [];
		newDocument = true;
		lineList = [];
		hingeList = [];
		easeAmount = 0.45;
		mode = "draw";
		$(".draw").addClass("selected");
		$("#addSquare").addClass("addShape");
		$("#titleBar").html("Untitled");
		canvas = document.getElementById("canvas");
		context = canvas.getContext("2d");
		canvas.addEventListener("click", mouseClickListener, false);

		// var test2 = new Shape("triangle", 200, 200, 180);

		// context.beginPath();

		// context.moveTo(test2.xValues[0], test2.yValues[0]);          
		 
		// for (var i = 1; i < test2.numberOfSides;i += 1) {
		//     context.lineTo (test2.xValues[i],test2.yValues[i]);
		// }

		// context.lineTo(test2.xValues[0], test2.yValues[0]);
		 
		// context.strokeStyle = "#000000";
		// context.stroke();

		// var test2 = new Shape("hexagon", 200, 200, 90);

		// context.beginPath();

		// context.moveTo(test2.xValues[0], test2.yValues[0]);          
		 
		// for (var i = 1; i < test2.numberOfSides;i += 1) {
		//     context.lineTo (test2.xValues[i],test2.yValues[i]);
		// }

		// context.lineTo(test2.xValues[0], test2.yValues[0]);
		 
		// context.strokeStyle = "#000000";
		// context.stroke();
	}

	//Self-explanatory
	function Line(x1, y1, x2, y2) {
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
	}

	//Self-explanatory
	function Point(x, y) {
		this.x = x;
		this.y = y;
	}

	//Takes two lines as paramaters that act as vectors
	//Gets the angle of the first vector and compares it to
	//the angle of the second vector. If the are equal, return
	//true. If not, return false.
	function compareAngle(line1, line2, degrees, shape) {

		//Checking for vertical lines
		//Divide by zero runtime error
		if (line1.x2 == line1.x1) {
			if (line2.x1 == line2.x2) {
				return true;
			} else {
				return false;
			}
		} else if(line2.x1 == line2.x2) {
			return false;
		}

		var slope1 = (line1.y2 - line1.y1) / (line1.x2 - line1.x1);
		var slope2 = (line2.y2 - line2.y1) / (line2.x2 - line2.x1);

		if (Math.round(slope1*100000) == Math.round(1.6923076923076923*100000) && Math.abs(slope2)==1.72)
			return true;
		if(shape == "triangle" && shapeSelection == "triangle" && ((slope1*1000/slope2*1000) < 1.02) && (degrees == 30 || degrees == 60 || degrees == 90 || degrees == 120 || degrees == 150 || degrees == 180)) {
			// alert((slope1*1000)/(slope2*1000));
			return true;
		}

		if (slope1 == -1.76 && slope2 == -1.72)
			return true;

		if (slope1 == 1.76 && slope2 == -1.72)
			return true;

		if (line1.y2 == line1.y1 && line2.y2 == line2.y1)
			return true;

		if (Math.abs(slope1) == Math.abs(slope2))
			return true;

		var angle1 = Math.atan(1/slope1);
		var angle2 = Math.atan(1/slope2);

		if (angle1 == angle2)
			return true;
		else 
			return false;
	}

	function Shape(type, originX, originY, degrees) {
		this.x = originX;
		this.y = originY;
		this.degrees = degrees;
		this.angle2 = degrees * (Math.PI/180);
		this.xValues = {};
		this.yValues = {};
		this.lines = [];
		this.hingeLines = [];
		this.leftX = 0;
		this.leftY = 0;
		this.color = "black";

		switch(type) {
			case("triangle"):
				this.name = "triangle";
				this.numberOfSides = 3;
				this.angle = ((2 * Math.PI)/3);
				this.triangleList = {};
				this.triangleList['0'] = null;
				this.triangleList['1'] = null;
				this.triangleList['2'] = null;
				this.squareList = {};
				this.squareList['0'] = null;
				this.squareList['1'] = null;
				this.squareList['2'] = null;
				this.hexagonList = {};
				this.hexagonList['0'] = null;
				this.hexagonList['1'] = null;
				this.hexagonList['2'] = null;
				break;
			case("square"):
				this.name = "square";
				this.numberOfSides = 4;
				this.angle = ((2 * Math.PI)/4);
				this.squareList = {};
				this.squareList['0'] = null;
				this.squareList['1'] = null;
				this.squareList['2'] = null;
				this.squareList['3'] = null;
				this.triangleList = {};
				this.triangleList['0'] = null;
				this.triangleList['1'] = null;
				this.triangleList['2'] = null;
				this.triangleList['3'] = null;
				this.hexagonList = {};
				this.hexagonList['0'] = null;
				this.hexagonList['1'] = null;
				this.hexagonList['2'] = null;
				this.hexagonList['3'] = null;
				break;
			case("hexagon"):
				this.name = "hexagon";
				this.numberOfSides = 6;
				this.angle = ((2 * Math.PI)/6);
				this.triangleList = {};
				this.triangleList['0'] = null;
				this.triangleList['1'] = null;
				this.triangleList['2'] = null;
				this.triangleList['3'] = null;
				this.triangleList['4'] = null;
				this.triangleList['5'] = null;
				this.squareList = {};
				this.squareList['0'] = null;
				this.squareList['1'] = null;
				this.squareList['2'] = null;
				this.squareList['3'] = null;
				this.squareList['4'] = null;
				this.squareList['5'] = null;
				this.hexagonList = {};
				this.hexagonList['0'] = null;
				this.hexagonList['1'] = null;
				this.hexagonList['2'] = null;
				this.hexagonList['3'] = null;
				this.hexagonList['4'] = null;
				this.hexagonList['5'] = null;
				break;
			default:
				console.log("Error: Unrecognized shape type");
				alert("Error: Unrecongized shape type");
				break;
		}

		this.radius = (1/2)*50*(1/Math.sin(Math.PI/this.numberOfSides));

		if (degrees > 720) {
			alert("stop");
			throw new Error("Degrees went over 720");
		}

		
		for (var i = 0; i < this.numberOfSides; i += 1) {
			//Setting the points on the shape to their default location
			this.xValues[i] = parseInt(this.x + this.radius * Math.cos(i * this.angle));
			this.yValues[i] = parseInt(this.y + this.radius * Math.sin(i * this.angle));    
			//Rotating the shape so that it aligns with the set degrees
			var tempX = this.xValues[i];
			var tempY = this.yValues[i];
			this.xValues[i] = Math.round(this.x + (tempX - this.x)*Math.cos(this.angle2) - (tempY - this.y)*Math.sin(this.angle2));
			this.yValues[i] = Math.round(this.y + (tempX - this.x)*Math.sin(this.angle2) + (tempY - this.y)*Math.cos(this.angle2)); 
		}

		//Getting a list of all of the lines within the shape
		//Also setting the hinge lines to true values so that shapes
		//can be added across from them
		for (var i = 0; i < this.numberOfSides; i+=1) {
			if (i != this.numberOfSides -1) {
				this.lines[i] = new Line(this.xValues[i], this.yValues[i], this.xValues[i+1], this.yValues[i+1]);
			} else {
				this.lines[i] = new Line(this.xValues[i], this.yValues[i], this.xValues[0], this.yValues[0]);
			}

			this.hingeLines[i] = true;
		} 

		//Draws the shape in black
		this.draw = function () {
			context.beginPath();

			context.moveTo(this.xValues[0], this.yValues[0]);          
			 
			for (var i = 1; i < this.numberOfSides;i += 1) {
			    context.lineTo(this.xValues[i],this.yValues[i]);
			}

			context.lineTo(this.xValues[0], this.yValues[0]);
			 
			context.strokeStyle = this.color;
			context.stroke();
		}

		//Draws the shape in blue
		this.drawBlue = function() {
			context.beginPath();
			context.moveTo(this.xValues[0], this.yValues[0]);

			for (var i = 1; i < this.numberOfSides;i += 1) {
			    context.lineTo (this.xValues[i],this.yValues[i]);
			}

			context.lineTo(this.xValues[0], this.yValues[0]);
			 
			context.strokeStyle = "#4D5BFF";
			context.stroke();
		}


		//Checks to see if the shape could be drawn
		//by checking the bounds of the shape and seeing
		//if the point lies within those bounds
		this.hitTest = function (point) {
			context.beginPath();
			context.moveTo(this.xValues[0], this.yValues[0]);

			for (var i = 1; i < this.numberOfSides;i += 1) {
			    context.lineTo (this.xValues[i],this.yValues[i]);
			}

			context.lineTo(this.xValues[0], this.yValues[0]);
			context.closePath();
			
			if (context.isPointInPath(point.x, point.y)) {
                return true;
            } else {
            	return false;
            }
		}

		this.drawShapes = function() {
			var lines = this.lines;
			var x = this.x;
			var y = this.y;
			var triangleList = this.triangleList;
			var hexagonList = this.hexagonList;
			var squareList = this.squareList;

			this.hingeLines.forEach( function(value, index, array) {
				if (value) {
					switch(shapeSelection) {
						case("triangle"):
							var newShape = ShapeMagic(lines[index], x, y, "triangle");
							shapeOptionList.push(newShape);
							triangleList[''+index] = newShape;
							break;
						case("square"):
							var newShape = ShapeMagic(lines[index], x, y, "square");
							shapeOptionList.push(newShape);
							squareList[''+index] = newShape;
							break;
						case("hexagon"):
							var newShape = ShapeMagic(lines[index], x, y, "hexagon");
							shapeOptionList.push(newShape);
							hexagonList[''+index] = newShape;
							break;
						default:
							break;
					}
				}
			});

			this.triangleList = triangleList;
			this.hexagonList = hexagonList;
			this.squareList = squareList;

			drawShapes();
		}
	}

	function roundToTen(value) {
		var newVal = (value *180)/Math.PI;
		newVal = newVal/10;
		newVal = Math.round(newVal);
		newVal = newVal*10;
		newVal = (newVal*Math.PI)/180;
		return newVal;
	}

	function getNewPoint(line, originX, originY) {
		var x = (line.x1 + line.x2)/2;
		var y = (line.y1 + line.y2)/2;

		var angle; 

		//checking for infinite slope
		if (x == originX) {
			if (y < originY)   //origin is below
				angle = 90 * Math.PI/180;
			else  //origin is above
				angle = 270 * Math.PI/180;
		} else if (y == originY) {
			if (originX < x )
				angle = 0;
			else 
				angle = 180 * Math.PI/180;
		} else {
			var slope = (y - originY)/(x - originX);
			if (x < originX && y < originY) {
				angle = Math.atan(1/slope) + 90*Math.PI/180;
			} else if (x < originX && y > originY) {
				angle = Math.atan(1/slope) + 270*Math.PI/180;
			} else if (x > originX && y < originY) {
				angle = Math.atan(1/slope) + 90*Math.PI/180;
			} else if (x > originX && y > originY) {
				angle = Math.atan(1/slope) - 90*Math.PI/180;
			}
		}
		angle = roundToTen(angle);

		var newOriginX = x + (distance)*Math.cos(angle);
		// if ((angle*180)/Math.PI > 90 && (angle*180)/Math.PI < 270)
		// 	var newOriginY = y - (30)*Math.sin(angle);
		// else if(angle == 90 * Math.PI/180)
		// 	var newOriginY = y - (30)*Math.sin(angle);
		// else 
		// 	var newOriginY = y + (30)*Math.sin(angle);
		var newOriginY = y - (distance)*Math.sin(angle);


		return new Point(newOriginX, newOriginY);
	}

	function rotate(line, shape) {

		while(shape.angle2 < 4*Math.PI) {
			
			for(var i = 0; i < shape.numberOfSides; i++) {
				if(shape.name == "triangle" && (shape.degrees == 30 || shape.degrees == 60 || shape.degrees == 90 || shape.degrees == 120 || shape.degrees == 150 || shape.degrees == 180)) {
				var slope1 = (line.y2 - line.y1) / (line.x2 - line.x1);
				var slope2 = (shape.lines[i].y2 - shape.lines[i].y1) / (shape.lines[i].x2 - shape.lines[i].x1);
				// console.log("\n\n\n\n\n\n\n\n\n\n\n\n");
				// console.log(shape.degrees);
				// console.log(slope1);
				// console.log(slope2);
				// console.log();
			}
				if (compareAngle(line, shape.lines[i], shape.degrees, shape.name)) {
					// var test2 = new Shape(shape.name, shape.x, shape.y, shape.degrees);

					// context.beginPath();

					// context.moveTo(test2.xValues[0], test2.yValues[0]);          
					 
					// for (var i = 1; i < test2.numberOfSides;i shpa+= 1) {
					//     context.lineTo (test2.xValues[i],test2.yValues[i]);
					// }

					// context.lineTo(test2.xValues[0], test2.yValues[0]);
					 
					// context.strokeStyle = "#000000";
					// context.stroke();
					
					for(var j = 0; j < shape.numberOfSides; j++) {
						if (shape.name == "square" && shape.degrees == 44) {
						break;
						}
						if (compareDistance(line, shape.lines[j])) {
				 			shape.leftX = (shape.lines[j].x1 < shape.lines[j].x2) ? shape.lines[j].x1 : shape.lines[j].x2;
				 			shape.leftY = (shape.lines[j].y1 < shape.lines[j].y2) ? shape.lines[j].y1 : shape.lines[j].y2;
				 			shape.hingeLines[j] = false;
							return shape;	

						}

					}
					
				}
			}
			shape = getNewShape(shape, shape.degrees);
		}	
	}	

	function compareDistance(line1, line2) {

		var leftLine1X = (line1.x2 > line1.x1) ? line1.x1 : line1.x2;

		if (leftLine1X == line1.x1) {
			var leftLine1Y = line1.y1;
			var rightLine1X = line1.x2;
			var rightLine1Y = line1.y2;
		}
		else  {
			var leftLine1Y = line1.y2;
			var rightLine1X = line1.x1;
			var rightLine1Y = line1.y1;
		}

		var leftLine2X = (line2.x2 > line2.x1) ? line2.x1 : line2.x2;

		if (leftLine2X == line2.x1) {
			var leftLine2Y = line2.y1;
			var rightLine2X = line2.x2;
			var rightLine2Y = line2.y2;
		}
		else  {
			var leftLine2Y = line2.y2;
			var rightLine2X = line2.x1;
			var rightLine2Y = line2.y1;
		}

		//Check for vertical Lines
		if (line1.x1 == line1.x2) {
			if (line1.y1 > line1.y2) {
				var leftLine1X = line1.x2;
				var leftLine1Y = line1.y2;
				var rightLine1X = line1.x1;
				var rightLine1Y = line1.y1;
			} else {
				var leftLine1X = line1.x1;
				var leftLine1Y = line1.y1;
				var rightLine1X = line1.x2;
				var rightLine1Y = line1.y2;
			}
		}

		//Check for vertical Lines
		if (line2.x1 == line2.x2) {
			if (line2.y1 > line2.y2) {
				var leftLine2X = line2.x2;
				var leftLine2Y = line2.y2;
				var rightLine2X = line2.x1;
				var rightLine2Y = line2.y1;
			} else {
				var leftLine2X = line2.x1;
				var leftLine2Y = line2.y1;
				var rightLine2X = line2.x2;
				var rightLine2Y = line2.y2;
			}
		}
		//console.log(Math.sqrt(Math.pow(leftLine2X - leftLine1X, 2) + Math.pow(leftLine2Y - leftLine1Y, 2)));
		//console.log(Math.sqrt(Math.pow(rightLine2X - rightLine1X, 2) + Math.pow(rightLine2Y - rightLine1Y, 2)));
		if (Math.sqrt(Math.pow(leftLine2X - leftLine1X, 2) + Math.pow(leftLine2Y - leftLine1Y, 2)) < (distance-12) 
			&& Math.sqrt(Math.pow(rightLine2X - rightLine1X, 2) + Math.pow(rightLine2Y - rightLine1Y, 2)) < (distance-12)) 
			return true;
		else 
			return false;
	}

	function drawHinges(line1, line2) {

		var leftLine1X = (line1.x2 > line1.x1) ? line1.x1 : line1.x2;

		if (leftLine1X == line1.x1) {
			var leftLine1Y = line1.y1;
			var rightLine1X = line1.x2;
			var rightLine1Y = line1.y2;
		}
		else  {
			var leftLine1Y = line1.y2;
			var rightLine1X = line1.x1;
			var rightLine1Y = line1.y1;
		}

		var leftLine2X = (line2.x2 > line2.x1) ? line2.x1 : line2.x2;

		if (leftLine2X == line2.x1) {
			var leftLine2Y = line2.y1;
			var rightLine2X = line2.x2;
			var rightLine2Y = line2.y2;
		}
		else  {
			var leftLine2Y = line2.y2;
			var rightLine2X = line2.x1;
			var rightLine2Y = line2.y1;
		}

		//Check for vertical Lines
		if (line1.x1 == line1.x2) {
			if (line1.y1 > line1.y2) {
				var leftLine1X = line1.x2;
				var leftLine1Y = line1.y2;
				var rightLine1X = line1.x1;
				var rightLine1Y = line1.y1;
			} else {
				var leftLine1X = line1.x1;
				var leftLine1Y = line1.y1;
				var rightLine1X = line1.x2;
				var rightLine1Y = line1.y2;
			}
		}

		//Check for vertical Lines
		if (line2.x1 == line2.x2) {
			if (line2.y1 > line2.y2) {
				var leftLine2X = line2.x2;
				var leftLine2Y = line2.y2;
				var rightLine2X = line2.x1;
				var rightLine2Y = line2.y1;
			} else {
				var leftLine2X = line2.x1;
				var leftLine2Y = line2.y1;
				var rightLine2X = line2.x2;
				var rightLine2Y = line2.y2;
			}
		}

		context.beginPath();

		context.moveTo(leftLine1X, leftLine1Y);
		context.lineTo(leftLine2X, leftLine2Y);
		context.lineTo(rightLine2X, rightLine2Y);
		context.lineTo(rightLine1X, rightLine1Y);
		context.closePath();

		context.fillStyle = "#000000";
		context.fill();

	}

	function getNewShape(shape, degrees) {
		return new Shape(shape.name, shape.x, shape.y, degrees + 1);
	}

	function ShapeMagic(line, originX, originY, shapeName) {
		var point = getNewPoint(line, originX, originY);
		var shape = new Shape(shapeName, point.x, point.y, 0);
		var square = new Shape("square", point.x, point.y, 0);
		square = rotate(line, square);
		shape = rotate(line, shape);
		// var test2 = new Shape(square.name, square.x, square.y, square.degrees);

		// 			context.beginPath();

		// 			context.moveTo(test2.xValues[0], test2.yValues[0]);          
					 
		// 			for (var i = 1; i < test2.numberOfSides;i += 1) {
		// 			    context.lineTo (test2.xValues[i],test2.yValues[i]);
		// 			}

		// 			context.lineTo(test2.xValues[0], test2.yValues[0]);
					 
		// 			context.strokeStyle = "#000000";
		// 			context.stroke();
		// 			alert("a");	
		var leftX1 = square.leftX;
		var leftY1 = square.leftY;
		var leftX2 = shape.leftX;
		var leftY2 = shape.leftY;
		var diffX = leftX1 - leftX2;
		var diffY = leftY1 - leftY2;  
		var newShape = new Shape(shapeName, (shape.x + diffX), (shape.y + diffY), shape.degrees);
		newShape.hingeLines = shape.hingeLines;
		return newShape;
	}

	// ** Handles initial shape add **/
	function mouseClickListener(evt) {

		var rect = canvas.getBoundingClientRect();
		mouseX = (evt.clientX - rect.left)*(canvas.width/rect.width);
		mouseY = (evt.clientY - rect.top)*(canvas.height/rect.height);

		drawScreen(mouseX, mouseY);

		canvas.removeEventListener("click", mouseClickListener, false);

		//code below prevents the mouse down from having an effect on the main browser window:
		if (evt.preventDefault) {
			evt.preventDefault();
		} //standard
		else if (evt.returnValue) {
			evt.returnValue = false;
		} //older IE
		return false;

	}

	/** Handles adding shapes after first (from shapeOptionList) **/
	function mouseClickListener2(evt) {

		//getting mouse position correctly 
		var rect = canvas.getBoundingClientRect();

		var point = new Point();
		point.x = (evt.clientX - rect.left)*(canvas.width/rect.width);
		point.y = (evt.clientY - rect.top)*(canvas.height/rect.height);
		

		for (var i=0; i < shapeOptionList.length; i++) {

			if (shapeSelection == "triangle") {

				//Test if a triangle has been clicked on
				if (shapeOptionList[i].hitTest(point) && shapeOptionList[i].name == "triangle") {	

					//once one of the triangles have b.
					for (var j = 0; j < shapeList.length; j++) {
						
						//go through each real shape and see if one of their side squares matches up
						
						//hit a triangle from a triangle
						if (shapeList[j].name == "triangle") { //shapeList holds real shape
							if (shapeList[j].triangleList["0"] == shapeOptionList[i]) {
								shapeList[j].hingeLines[0] = false;
							} else if (shapeList[j].triangleList["1"] == shapeOptionList[i]) {
								shapeList[j].hingeLines[1] = false;
							} else if (shapeList[j].triangleList["2"] == shapeOptionList[i]) {
								shapeList[j].hingeLines[2] = false;
							}
						} 
						//hit a triangle from a square
						else if (shapeList[j].name == "square") { //shapeList holds real shape
							
							if (shapeList[j].triangleList["0"] == shapeOptionList[i]) {
								shapeList[j].hingeLines[0] = false;
							} else if (shapeList[j].triangleList["1"] == shapeOptionList[i]) {
								shapeList[j].hingeLines[1] = false;
							} else if (shapeList[j].triangleList["2"] == shapeOptionList[i]) {
								shapeList[j].hingeLines[2] = false; 
							} else if (shapeList[j].triangleList["3"] == shapeOptionList[i]) {
								shapeList[j].hingeLines[3] = false;
							}
							
						}
						//hit a triangle from a hexagon
						else if (shapeList[j].name == "hexagon") { //shapeList holds real shape
							
							if (shapeList[j].triangleList["0"] == shapeOptionList[i]) {  //top of hexagon
								shapeList[j].hingeLines[0] = false;
							} else if (shapeList[j].triangleList["1"] == shapeOptionList[i]) { //top left of hexagon
								shapeList[j].hingeLines[1] = false;
							} else if (shapeList[j].triangleList["2"] == shapeOptionList[i]) { //bottom right of hexagon
								shapeList[j].hingeLines[2] = false;
							} else if (shapeList[j].triangleList["3"] == shapeOptionList[i]) { //bottom of hexagon
								shapeList[j].hingeLines[3] = false; 
							} else if (shapeList[j].triangleList["4"] == shapeOptionList[i]) { //bottom right of hexagon
								shapeList[j].hingeLines[4] = false; 
							} else if (shapeList[j].triangleList["5"] == shapeOptionList[i]) { //top right of hexagon
								shapeList[j].hingeLines[5] = false; 
							}
							
						}
					}

					shapeList.push(shapeOptionList[i]);

					//clear option list
					shapeOptionList = [];

					drawShapes();
				}

			} else if (shapeSelection == "square") {
				if (shapeOptionList[i].hitTest(point) && shapeOptionList[i].name == "square") {	

					//once one of the squares have been clicked on...

					for (var j = 0; j < shapeList.length; j++) {
						
						//go through each real shape and see if one of their side squares matches up
						
						//hit a square from a triangle
						if (shapeList[j].name == "triangle") { //shapeList holds real shape
							if (shapeList[j].squareList["0"] == shapeOptionList[i]) {
								shapeList[j].hingeLines[0] = false;
							} else if (shapeList[j].squareList["1"] == shapeOptionList[i]) {
								shapeList[j].hingeLines[1] = false;
							} else if (shapeList[j].squareList["2"] == shapeOptionList[i]) {
								shapeList[j].hingeLines[2] = false;
							}
						} 
						//hit a square from a square
						else if (shapeList[j].name == "square") { //shapeList holds real shape
							
							//go through each real square and see if one of their side squares matches up
							if (shapeList[j].squareList["0"] == shapeOptionList[i]) {
								shapeList[j].hingeLines[0] = false;
							} else if (shapeList[j].squareList["1"] == shapeOptionList[i]) {
								shapeList[j].hingeLines[1] = false;
							} else if (shapeList[j].squareList["2"] == shapeOptionList[i]) {
								shapeList[j].hingeLines[2] = false; 
							} else if (shapeList[j].squareList["3"] == shapeOptionList[i]) {
								shapeList[j].hingeLines[3] = false;
							}
							
						}
						//hit a square from a hexagon
						else if (shapeList[j].name == "hexagon") { //shapeList holds real shape
							
							if (shapeList[j].squareList["0"] == shapeOptionList[i]) {  //top of hexagon
								shapeList[j].hingeLines[0] = false;
							} else if (shapeList[j].squareList["1"] == shapeOptionList[i]) { //top left of hexagon
								shapeList[j].hingeLines[1] = false;
							} else if (shapeList[j].squareList["2"] == shapeOptionList[i]) { //bottom right of hexagon
								shapeList[j].hingeLines[2] = false;
							} else if (shapeList[j].squareList["3"] == shapeOptionList[i]) { //bottom of hexagon
								shapeList[j].hingeLines[3] = false; 
							} else if (shapeList[j].squareList["4"] == shapeOptionList[i]) { //bottom right of hexagon
								shapeList[j].hingeLines[4] = false; 
							} else if (shapeList[j].squareList["5"] == shapeOptionList[i]) { //top right of hexagon
								shapeList[j].hingeLines[5] = false; 
							}
							
						}
						
					}

					shapeList.push(shapeOptionList[i]);

					//clear option list
					shapeOptionList = [];

					drawShapes();
				}
			} else if (shapeSelection == "hexagon") {
				if (shapeOptionList[i].hitTest(point) && shapeOptionList[i].name == "hexagon") {	

					//once one of the hexagons have been clicked on...

					for (var j = 0; j < shapeList.length; j++) {
						
						//go through each real shape and see if one of their side squares matches up
						
						//hit a hexagon from a triangle
						if (shapeList[j].name == "triangle") { //shapeList holds real shape
							if (shapeList[j].hexagonList["0"] == shapeOptionList[i]) {
								shapeList[j].hingeLines[0] = false;
							} else if (shapeList[j].hexagonList["1"] == shapeOptionList[i]) {
								shapeList[j].hingeLines[1] = false;
							} else if (shapeList[j].hexagonList["2"] == shapeOptionList[i]) {
								shapeList[j].hingeLines[2] = false;
							}

						} 
						//hit a hexagon from a square
						else if (shapeList[j].name == "square") { //shapeList holds real shape
							
							//go through each real square and see if one of their side hexagons match up
							if (shapeList[j].hexagonList["0"] == shapeOptionList[i]) {
								shapeList[j].hingeLines[0] = false;
							} else if (shapeList[j].hexagonList["1"] == shapeOptionList[i]) {
								shapeList[j].hingeLines[1] = false;
							} else if (shapeList[j].hexagonList["2"] == shapeOptionList[i]) {
								shapeList[j].hingeLines[2] = false; 
							} else if (shapeList[j].hexagonList["3"] == shapeOptionList[i]) {
								shapeList[j].hingeLines[3] = false;
							}
							
						}
						//hit a hexagon from a hexagon
						else if (shapeList[j].name == "hexagon") { //shapeList holds real shape
							
							if (shapeList[j].hexagonList["0"] == shapeOptionList[i]) {  //top of hexagon
								shapeList[j].hingeLines[0] = false;
							} else if (shapeList[j].hexagonList["1"] == shapeOptionList[i]) { //top left of hexagon
								shapeList[j].hingeLines[1] = false;
							} else if (shapeList[j].hexagonList["2"] == shapeOptionList[i]) { //bottom right of hexagon
								shapeList[j].hingeLines[2] = false;
							} else if (shapeList[j].hexagonList["3"] == shapeOptionList[i]) { //bottom of hexagon
								shapeList[j].hingeLines[3] = false; 
							} else if (shapeList[j].hexagonList["4"] == shapeOptionList[i]) { //bottom right of hexagon
								shapeList[j].hingeLines[4] = false; 
							} else if (shapeList[j].hexagonList["5"] == shapeOptionList[i]) { //top right of hexagon
								shapeList[j].hingeLines[5] = false; 
							}
							
						}
					}

					shapeList.push(shapeOptionList[i]);

					//clear option list
					shapeOptionList = [];

					drawShapes();
				}
			}
			
		}

		canvas.removeEventListener("click", mouseClickListener2, false);

		//code below prevents the mouse down from having an effect on the main browser window:
		if (evt.preventDefault) {
			evt.preventDefault();
		} //standard
		else if (evt.returnValue) {
			evt.returnValue = false;
		} //older IE
		return false;


	}

	/** Handles deletes **/
	function mouseClickListener3(evt) {

		//getting mouse position correctly 
		var rect = canvas.getBoundingClientRect();

		var point = new Point();
		point.x = (evt.clientX - rect.left)*(canvas.width/rect.width);
		point.y = (evt.clientY - rect.top)*(canvas.height/rect.height);


		for (var i=0; i < shapeList.length; i++) {
			if (shapeList[i].hitTest(point)) {	

				if (!(shapeList[i].color == "red")) {
					shapeList[i].color = "red";
				} else {
					shapeList[i].color = "black";
				}
				
				
			}
		}

		drawShapes();

		//code below prevents the mouse down from having an effect on the main browser window:
		if (evt.preventDefault) {
			evt.preventDefault();
		} //standard
		else if (evt.returnValue) {
			evt.returnValue = false;
		} //older IE
		return false;


	}

	function checkEmptyCanvas() {
		if (shapeList.length == 0) {
			canvas.removeEventListener("click", mouseClickListener3, false);
			canvas.removeEventListener("mousemove", mouseMoveListener, false);
			canvas.addEventListener('click', mouseClickListener, false);
		}
	}


	function mouseMoveListener (evt) {

		//getting mouse position correctly 
		var rect = canvas.getBoundingClientRect();

		var point = new Point();
		point.x = (evt.clientX - rect.left)*(canvas.width/rect.width);
		point.y = (evt.clientY - rect.top)*(canvas.height/rect.height);

		for (var i=0; i < shapeList.length; i++) {
			if (shapeList[i].hitTest(point)) {	
				$("#canvas").css({"cursor":"pointer"});
			} else {
				$("#canvas").css({"cursor":"auto"});
			}
		}

		//code below prevents the mouse down from having an effect on the main browser window:
		if (evt.preventDefault) {
			evt.preventDefault();
		} //standard
		else if (evt.returnValue) {
			evt.returnValue = false;
		} //older IE
		return false;
	}

	function testBoundingBox(object1, object2, dimension) {

		if (!((object1.topLeft["y"] + dimension < object2.topLeft["y"]) ||
			(object1.topLeft["y"] > object2.topLeft["y"] + dimension) ||
			(object1.topLeft["x"] + dimension < object2.topLeft["x"]) ||
			(object1.topLeft["x"] > object2.topLeft["x"] + dimension)
			))
			return true;
		else 
			return false;
	}

	//Draw the first shape on the canvas
	function drawScreen(x, y) {
		var newShape;
		if (shapeSelection == "square") {
			newShape = new Shape("square", x, y, 45);
		} else if (shapeSelection == "triangle") {
			newShape = new Shape("triangle", x, y, 270); 
		} else if (shapeSelection == "hexagon") {
			newShape = new Shape("hexagon", x, y, 0);
		}

		shapeList.push(newShape);
		if (newDocument) {
			newDocument = false;
			$("#titleBar").html("* " + $("#titleBar").html());
		}
		drawShapes();	
	}


	function drawShapes() {
		//Call the draw function on each shape to draw onto the canvas
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.beginPath();
		context.fillStyle ="#FFFFFF";
		context.fillRect(0, 0, canvas.width, canvas.height);

		lineList = [];
		
		for (var i = 0; i < shapeOptionList.length; i++) {
			shapeOptionList[i].drawBlue();
		}
		for (var i = 0; i < shapeList.length; i++) {
			shapeList[i].draw();
			for (var j = 0; j < shapeList[i].lines.length; j++) {
				lineList.push(shapeList[i].lines[j]);
			}
		}
		for (var i = 0; i < lineList.length; i++) {
			var line1 = lineList[i];
			for(var j = 0; j < lineList.length; j++) {
				if (i != j) {
					var line2 = lineList[j];
					if(compareDistance(line1, line2))
						drawHinges(line1, line2);
				}
			}
		}
	}

	function clearCanvas() {
		//Clear all shapes off of the canvas
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.beginPath();
		context.fillStyle ="#FFFFFF";
		context.fillRect(0, 0, canvas.width, canvas.height);
		shapeList = [];
		shapeOptionList = [];
		lineList = [];
		checkEmptyCanvas();
		canvas.removeEventListener('click', mouseClickListener2, false);
		canvas.removeEventListener("mousemove", mouseMoveListener, false);
	}

/** -----------------    Events not related to the canvas  ---------------------------  */
	
	$("#file").on('click', function(evt) {
			$("#menuDropdown").slideDown();
			$("#menuDropdown").css({"z-index" : "3"});
			$("#menuDropdown").find("div").css({"z-index" : "3"});
			$('<div id="invisible"></div>').insertBefore($("#menu"));
			$("#invisible").css({"height" : $(window).height(), "width" : $(window).width(), "z-index" : "2", "position" : "fixed"});
			$("#invisible").on('click', function() {
				$("#menuDropdown").slideUp();
				$("#menuDropdown").css({"z-index" : "0"});
				$("#menuDropdown").find("div").css({"z-index" : "0"})
				$(this).remove();
			});
		
	});

	$("#templates").on('click', function(evt) {
			$("#templatesDropdown").slideDown();
			$("#templatesDropdown").css({"z-index" : "3"});
			$("#templatesDropdown").find("div").css({"z-index" : "3"});
			$('<div id="invisible"></div>').insertBefore($("#menu"));
			$("#invisible").css({"height" : $(window).height(), "width" : $(window).width(), "z-index" : "2", "position" : "fixed"});
			$("#invisible").on('click', function() {
				$("#templatesDropdown").slideUp();
				$("#templatesDropdown").css({"z-index" : "0"});
				$("#templatesDropdown").find("div").css({"z-index" : "0"})
				$(this).remove();
			});
		
	});



	$("#clearCanvas").on('click', function() {
		clearCanvas(canvas);
	});

	$("#new").on('click', function () {
		if (!newDocument) {
			Alert.render("Any changes you made will be lost. Do you want to continue?");
		}
		
	});

	$(".delete").on('click', function() {

		$(".delete").addClass("selected");
		$(".draw").removeClass("selected");
		shapeOptionList = [];
		drawShapes();
		canvas.addEventListener("click", mouseClickListener3, false);
		canvas.addEventListener("mousemove", mouseMoveListener, false);

	});

	$(".draw").on('click', function() {

		$(".draw").addClass("selected");
		$(".delete").removeClass("selected");
		canvas.removeEventListener("click", mouseClickListener3, false);
		canvas.removeEventListener("mousemove", mouseMoveListener, false);
		for (var i=0; i < shapeList.length; i++) {
			shapeList[i].color = "#000000";	
		}
		drawShapes();

	});

	$("#deleteObject").on('click', function () {
		for(var i = 0; i < shapeList.length; i++) {
			if (shapeList[i].color == "red") {
				shapeList.splice(i, 1);
				i--;
			}
		}

		drawShapes();
		checkEmptyCanvas();

	});

	$("#addSquare").on('click', function () {
		$("#addTriangle").removeClass("addShape");
		$("#addHexagon").removeClass("addShape");
		$("#addSquare").addClass("addShape");
		shapeOptionList = [];
		shapeSelection = "square";
		if (shapeList.length > 0) {
			for (var i = 0; i < shapeList.length; i++) {
				shapeList[i].drawShapes();
			}
			canvas.addEventListener('click', mouseClickListener2, false);
		}

		$(".draw").click();

	});

	$("#addTriangle").on('click', function () {
		$("#addSquare").removeClass("addShape");
		$("#addHexagon").removeClass("addShape");
		$("#addTriangle").addClass("addShape");
		shapeOptionList = [];
		shapeSelection = "triangle";
		if (shapeList.length > 0) {
			for (var i = 0; i < shapeList.length; i++) {
				shapeList[i].drawShapes();
			}
			canvas.addEventListener('click', mouseClickListener2, false);
		}

		$(".draw").click();

	});

	$("#plusHinge").on("click", function() {
		if (distance <= 36)
			distance = distance + 1;

		$("."+shapeSelection).click();
	});

	$("#minusHinge").on("click", function() {
		if (distance >= 28)
			distance = distance - 1;
		$("."+shapeSelection).click();
	});

	$("#addHexagon").on('click', function () {
		$("#addSquare").removeClass("addShape");
		$("#addTriangle").removeClass("addShape");
		$("#addHexagon").addClass("addShape");
		shapeOptionList = [];
		shapeSelection = "hexagon";
		if (shapeList.length > 0) {
			for (var i = 0; i < shapeList.length; i++) {
				shapeList[i].drawShapes();
			}
			canvas.addEventListener('click', mouseClickListener2, false);
		}

		$(".draw").click();

	});

	$("#cube").on("click", function () {
		clearCanvas(canvas);
		shapeSelection = "square";
		var centerCube = new Shape("square", canvas.width/2, canvas.height/2, 45);
		var lines = centerCube.lines;
		var x = centerCube.x;
		var y = centerCube.y;
		var squareList = centerCube.squareList;
		shapeList.push(centerCube);

		centerCube.hingeLines.forEach( function(value, index, array) {

			var newShape = ShapeMagic(centerCube.lines[index], x, y, "square");
			if (index == 2) {
				var topShape = ShapeMagic(newShape.lines[2], newShape.x, newShape.y, "square");
				shapeList.push(topShape);
				newShape.hingeLines[2] = false;
			}
			shapeList.push(newShape);	
			
		});
		for (var i = 0; i < centerCube.hingeLines.length; i++) {
			centerCube.hingeLines[i] = false;
		}

		drawShapes();
	});

	$("#rectangularPyramid").on("click", function () {
		clearCanvas(canvas);
		shapeSelection = "square";
		var centerCube = new Shape("square", canvas.width/2, canvas.height/2, 45);
		var lines = centerCube.lines;
		var x = centerCube.x;
		var y = centerCube.y;
		var squareList = centerCube.squareList;
		shapeList.push(centerCube);

		centerCube.hingeLines.forEach( function(value, index, array) {

			var newShape = ShapeMagic(centerCube.lines[index], x, y, "triangle");
			shapeList.push(newShape);	
			
		});
		for (var i = 0; i < centerCube.hingeLines.length; i++) {
			centerCube.hingeLines[i] = false;
		}

		drawShapes();
	});

	$("#hexagonalPyramid").on("click", function () {
		clearCanvas(canvas);
		shapeSelection = "triangle";
		drawScreen(canvas.width/2, canvas.height/2);

		// var centerCube = new Shape("hexagon", canvas.width/2, canvas.height/2, 0);
		// var lines = centerCube.lines;
		// var x = centerCube.x;
		// var y = centerCube.y;
		// var squareList = centerCube.squareList;
		// shapeList.push(centerCube);
		// centerCube.drawShapes();
		// centerCube.hingeLines.forEach( function(value, index, array) {

		// 	var newShape = ShapeMagic(centerCube.lines[index], x, y, "triangle");
		// 	shapeList.push(newShape);	
			
		// });
		// for (var i = 0; i < centerCube.hingeLines.length; i++) {
		// 	centerCube.hingeLines[i] = false;
		// }

		//drawShapes();
	});

	$("#hexagonalPyramid").on("click", function () {
		clearCanvas(canvas);
		shapeSelection = "hexagon";
		var centerCube = new Shape("hexagon", canvas.width/2, canvas.height/2, 45);
		var lines = centerCube.lines;
		var x = centerCube.x;
		var y = centerCube.y;
		var squareList = centerCube.squareList;
		shapeList.push(centerCube);

		centerCube.hingeLines.forEach( function(value, index, array) {

			var newShape = ShapeMagic(centerCube.lines[index], x, y, "triangle");
			shapeList.push(newShape);	
			
		});
		for (var i = 0; i < centerCube.hingeLines.length; i++) {
			centerCube.hingeLines[i] = false;
		}

		drawShapes();
	});

	$("#print").on('click', function (event) {
		event.preventDefault();
		var canvas = document.getElementById("canvas");
		var dataURL = canvas.toDataURL("image/png");
		var newWindow = window.open(dataURL, "_blank", "width=660, height=385");
	});

	function CustomAlert() { 

		this.render = function(dialog) { 

			var winW = window.innerWidth; 
			var winH = window.innerHeight; 
			var dialogoverlay = document.getElementById('dialogoverlay'); 
			var dialogbox = document.getElementById('dialogbox'); 
			dialogoverlay.style.display = "block"; 
			dialogoverlay.style.height = winH+"px"; 
			dialogbox.style.left = (winW/2) - (550 * .5)+"px"; 
			dialogbox.style.top = "100px"; 
			dialogbox.style.display = "block"; 
			document.getElementById('dialogboxhead').innerHTML = "Acknowledge This Message"; 
			document.getElementById('dialogboxbody').innerHTML = dialog; 
			document.getElementById('dialogboxfoot').innerHTML = '<button id="yes">Yes</button>        <button id="cancel">Cancel</button>'; 
			$("#yes").on('click', function () {
				newResponse("yes");
			});
			$("#cancel").on('click', function () {
				newResponse("cancel");
			});
		} 
	} 

	function newResponse (response) {
		document.getElementById('dialogbox').style.display = "none"; 
		document.getElementById('dialogoverlay').style.display = "none";
		if (response == "yes") {
			clearCanvas();
			$("#titleBar").html("Untitled");
			newDocument = true;
		}
	}

	$("#help").on("click", function() {
		$("#helpPdf").show();
		$("#pdfHolder").height($(window).height());
	});

	$("#helpPdf").on("click", function(evt) {
		if(evt.target == this) {
			$("#helpPdf").hide();
		}
	});

	document.addEventListener("keydown", keyDownTextField, false);

	function keyDownTextField(e) {
	var keyCode = e.keyCode;
	  if(keyCode==112)
	  	$("#help").click();
	}	

	var Alert = new CustomAlert();
	
});