$(document).ready(function () {

/** -----------------    Events related to the canvas  ---------------------------  */

	var shapeList;
	var lineList;
	var connectorList;
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

	init();

	function init() {
		shapeList = [];
		shapeOptionList = [];
		newDocument = true;
		lineList = [];
		connectorList = [];
		easeAmount = 0.45;
		mode = "draw";
		$(".draw").addClass("selected");
		$("#titleBar").html("Untitled");
		canvas = document.getElementById("canvas");
		context = canvas.getContext("2d");
		canvas.addEventListener("click", mouseClickListener, false);
	}

	function Triangle (x, y, direction) {
		/**
		* Up Triangle: 
		* line 1 = left
		* line 2 = bottom
		* line 3 = right
		
		* Down Triangle: 
		* line 1 = top
		* line 2 = left
		* line 3 = right

		* Left Triangle: 
		* line 1 = top
		* line 2 = right
		* line 3 = bottom

		* Right Triangle: 
		* line 1 = top
		* line 2 = left
		* line 3 = bottom
		*/
		this.x = x;
		this.y = y;
		this.shape ="triangle";
		

		this.direction = direction;
		this.radius = 50;

		this.topLeft = {};
		this.topLeft["x"] = x;
		this.topLeft["y"] = y;
		

		//for bounding boxes
		if (direction == "left") 
			this.topLeft["x"] = x - this.radius;

		if (direction == "up")
			this.topLeft["y"] = y - this.radius;
		

		this.angle = ((2 * Math.PI) / 6);
		this.line1 = true; 
		this.line2 = true;
		this.line3 = true;
		this.color = "#000000";
		this.color2 = "#4D5BFF";
		this.lineWidth = 2;
		this.triangleList = {};
		this.triangleList['one'] = null;
		this.triangleList['two'] = null;
		this.triangleList['three'] = null;
		this.squareList = {};
		this.squareList['one'] = null;
		this.squareList['two'] = null;

		this.draw = function (context) {
			context.lineWidth = this.lineWidth;
			context.strokeStyle = this.color;
			context.beginPath();
			context.moveTo(this.x, this.y);

			if (this.direction == "up") {
				context.lineTo(this.x + this.radius * Math.cos(this.angle),this.y - this.radius * Math.sin(this.angle));
				context.lineTo(this.x + this.radius, y);
			} else if (this.direction == "down") {
				context.lineTo(this.x + this.radius * Math.cos(this.angle),this.y + this.radius * Math.sin(this.angle));
				context.lineTo(this.x + this.radius, y);

			} else if (this.direction == "left") {
				context.lineTo(this.x - this.radius + 8,this.y + this.radius * Math.sin(this.angle) / 2);
				context.lineTo(this.x, y + this.radius);

			} else if (this.direction == "right") {
				context.lineTo(this.x + this.radius - 8,this.y + this.radius * Math.sin(this.angle) / 2);
				context.lineTo(this.x, y + this.radius);
			}
			context.closePath();
			context.stroke();

			//draw dark lines if necessary (use angles)

			if (direction == "up") {
				if(!this.line1) {
					context.beginPath();
					context.fillStyle = "black";
					context.moveTo(x, y);
					context.lineTo(x + this.radius * Math.cos(this.angle),y - this.radius * Math.sin(this.angle) - 1);
					context.lineTo(x + this.radius * Math.cos(this.angle) - 5, y - this.radius * Math.sin(this.angle) - 1);
					context.lineTo(x - 5, y + 1);
					context.closePath();
					context.fill();

				} 
				if((!this.line2)) {
					context.beginPath();
					context.fillStyle = "black";
					context.fillRect(this.x-1, this.y-1, 50, 5);
				}
				if(!this.line3) {
					
				}

			} else if (direction == "down") {
				if(!this.line1) {
					
				} 
				if(!this.line2) {
					context.beginPath();
					context.fillStyle = "black";
					context.moveTo(x, y);
					context.lineTo(x + this.radius * Math.cos(this.angle) , y + this.radius * Math.sin(this.angle) + 1);
					context.lineTo(x + this.radius * Math.cos(this.angle) - 5 , y + this.radius * Math.sin(this.angle) + 1);
					context.lineTo(x - 5, y - 1);
					context.closePath();
					context.fill();
				}
				if(!this.line3) {
					
				}

			}
			

		}

		//A function for drawing the optional triangles (light blue).
		this.drawShapeBlue = function (context) {
			context.beginPath();
			context.moveTo(this.x, this.y);

			if (this.direction == "up") {
				context.lineTo(this.x + this.radius * Math.cos(this.angle),this.y - this.radius * Math.sin(this.angle));
				context.lineTo(this.x + this.radius, y);
			} else if (this.direction == "down") {
				context.lineTo(this.x + this.radius * Math.cos(this.angle),this.y + this.radius * Math.sin(this.angle));
				context.lineTo(this.x + this.radius, y);

			} else if (this.direction == "left") {
				context.lineTo(this.x - this.radius + 8,this.y + this.radius * Math.sin(this.angle) / 2);
				context.lineTo(this.x, y + this.radius);

			} else if (this.direction == "right") {
				context.lineTo(this.x + this.radius - 8,this.y + this.radius * Math.sin(this.angle) / 2);
				context.lineTo(this.x, y + this.radius);
			}

			context.closePath();
			context.lineWidth = this.lineWidth;
			context.strokeStyle = this.color2;
			context.stroke();	
		}

		//The function below returns a Boolean value representing whether the point with the coordinates supplied "hits" the particle.
		this.hitTest = function (hitX, hitY, context) {
			context.beginPath();
			context.moveTo(this.x, this.y);

			if (this.direction == "up") {
				context.lineTo(this.x + this.radius * Math.cos(this.angle),this.y - this.radius * Math.sin(this.angle));
				context.lineTo(this.x + this.radius, y);
			} else if (this.direction == "down") {
				context.lineTo(this.x + this.radius * Math.cos(this.angle),this.y + this.radius * Math.sin(this.angle));
				context.lineTo(this.x + this.radius, y);

			} else if (this.direction == "left") {
				context.lineTo(this.x - this.radius + 8,this.y + this.radius * Math.sin(this.angle) / 2);
				context.lineTo(this.x, y + this.radius);

			} else if (this.direction == "right") {
				context.lineTo(this.x + this.radius - 8,this.y + this.radius * Math.sin(this.angle) / 2);
				context.lineTo(this.x, y + this.radius);
			}
			context.closePath();
			
			if (context.isPointInPath(hitX, hitY)) {
                return true;
            } else {
            	return false;
            }
		}

		/** Draw the optional shapes around this one **/
		this.drawShapes = function (context) {
			if (this.direction == "up") {
				if (this.line1) { 
					if (shapeSelection == "triangle") { //down triangle on the left side of this triangle
						var newTriangle = new Triangle(this.x - 30, this.y - 43, "down");
						var canAdd = true;
						// for (var i = 0; i < shapeList.length; i++) {
						// 	if (testBoundingBox(newTriangle, shapeList[i], 50))
						// 		canAdd = false;
						// }
						if (canAdd) {
							shapeOptionList.push(newTriangle);
							this.triangleList['one'] = newTriangle;
						}

						
					} else if (shapeSelection == "square") {
						//var newSquare = new Square(this.x - 55, this.y, 50, 50);
						//shapeOptionList.push(newSquare);
						//this.squareList['one'] = newSquare;
					}
					
				}
				if (this.line2) {  
					if (shapeSelection == "triangle") { //down triangle on the bottom side of this triangle
						var newTriangle = new Triangle(this.x, this.y + 5, "down");
						var canAdd = true;
						// for (var i = 0; i < shapeList.length; i++) {
						// 	if (testBoundingBox(newTriangle, shapeList[i], 50))
						// 		canAdd = false;
						// }
						if (canAdd) {
							shapeOptionList.push(newTriangle);
							this.triangleList['two'] = newTriangle;
						}
					} else if (shapeSelection == "square") { //square on the bottom side of this triangle
						var newSquare = new Square(this.x, this.y + 5, 50, 50);
						var canAdd = true;
						for (var i = 0; i < shapeList.length; i++) {
							if (testBoundingBox(newSquare, shapeList[i], 50))
								canAdd = false;
						}
						if (canAdd) {
							shapeOptionList.push(newSquare);
							this.squareList['one'] = newSquare;
						}
					}
				}
				if (this.line3) {
					if (shapeSelection == "triangle") { //down triangle on the right side of this triangle
						var newTriangle = new Triangle(this.x + 30, this.y - 43, "down");
						var canAdd = true;
						// for (var i = 0; i < shapeList.length; i++) {
						// 	if (testBoundingBox(newTriangle, shapeList[i], 50))
						// 		canAdd = false;
						// }
						if (canAdd) {
							shapeOptionList.push(newTriangle);
							this.triangleList['three'] = newTriangle;
						};
					} else if (shapeSelection == "square") {
						//var newSquare = new Square(this.x - 55, this.y, 50, 50);
						//shapeOptionList.push(newSquare);
						//this.squareList['one'] = newSquare;
					}
				}
			} else if (this.direction == "down") {
				if (this.line1) {
					if (shapeSelection == "triangle") {
						var newTriangle = new Triangle(this.x, this.y - 5, "up");
						var canAdd = true;
						// for (var i = 0; i < shapeList.length; i++) {
						// 	if (testBoundingBox(newTriangle, shapeList[i], 50))
						// 		canAdd = false;
						// }
						if (canAdd) {
							shapeOptionList.push(newTriangle);
							this.triangleList['one'] = newTriangle;
						}
					} else if (shapeSelection == "square") {
						var newSquare = new Square(this.x, this.y - 55, 50, 50);
						var canAdd = true;
						for (var i = 0; i < shapeList.length; i++) {
							if (testBoundingBox(newSquare, shapeList[i], 50))
								canAdd = false;
						}
						if (canAdd) {
							shapeOptionList.push(newSquare);
							this.squareList['one'] = newSquare;
						}
					}
					
				}
				if (this.line2) {
					if (shapeSelection == "triangle") {
						var newTriangle = new Triangle(this.x - 30, this.y + 43, "up");
						var canAdd = true;
						// for (var i = 0; i < shapeList.length; i++) {
						// 	if (testBoundingBox(newTriangle, shapeList[i], 50))
						// 		canAdd = false;
						// }
						if (canAdd) {
							shapeOptionList.push(newTriangle);
							this.triangleList['two'] = newTriangle;
						}
					} else if (shapeSelection == "square") {
						//var newSquare = new Square(this.x - 55, this.y, 50, 50);
						//shapeOptionList.push(newSquare);
						//this.squareList['one'] = newSquare;
					}
				}
				if (this.line3) {
					if (shapeSelection == "triangle") {
						var newTriangle = new Triangle(this.x + 30, this.y + 43, "up");
						var canAdd = true;
						// for (var i = 0; i < shapeList.length; i++) {
						// 	if (testBoundingBox(newTriangle, shapeList[i], 50))
						// 		canAdd = false;
						// }
						if (canAdd) {
							shapeOptionList.push(newTriangle);
							this.triangleList['three'] = newTriangle;
						}
					} else if (shapeSelection == "square") {
						//var newSquare = new Square(this.x - 55, this.y, 50, 50);
						//shapeOptionList.push(newSquare);
						//this.squareList['one'] = newSquare;
					}
				}
			}

			
			drawShapes();
		}

	}

	function Square (x, y, width, height) {
		this.x = x;
		this.y = y;
		this.shape ="square";
		this.width = width;
		this.height = height;

		this.topLeft = {};
		this.topLeft["x"] = x;
		this.topLeft["y"] = y;
		

		this.color = "#000000";
		this.color2 = "#4D5BFF";
		this.lineWidth = 2;
		this.line1 = true; //left
		this.line2 = true; //bottom
		this.line3 = true; //right
		this.line4 = true; //top
		this.squareList = {};
		this.squareList['one'] = null;
		this.squareList['two'] = null;
		this.squareList['three'] = null;
		this.squareList['four'] = null;
		this.triangleList = {};
		this.triangleList['one'] = null;
		this.triangleList['two'] = null;
		this.triangleList['three'] = null;
		this.triangleList['four'] = null;
		//A function for drawing the square in black.
		this.draw = function (context) {
			context.beginPath();
			context.rect(this.x, this.y, 50, 50);
			context.lineWidth = this.lineWidth;
			context.strokeStyle = this.color;
			context.stroke();	

			//draw dark lines if necessary
			if(!this.line1) {
				context.beginPath();
				context.fillStyle = "black";
				context.fillRect(this.x-5, this.y-1, 5, 52);
			} 
			if(!this.line2) {
				context.beginPath();
				context.fillStyle = "black";
				context.fillRect(this.x-1, this.y+50, 52, 5);
			}
			if(!this.line3) {
				context.beginPath();
				context.fillStyle = "black";
				context.fillRect(this.x+50, this.y-1, 5, 52);
			}
			if(!this.line4) {
				context.beginPath();
				context.fillStyle = "black";
				context.fillRect(this.x-1, this.y-5, 52, 5);
			}	

		}
		//A function for drawing the optional squares (light blue).
		this.drawShapeBlue = function (context) {
			context.beginPath();
			context.rect(this.x, this.y, 50, 50);
			context.lineWidth = this.lineWidth;
			context.strokeStyle = this.color2;
			context.stroke();	
		}

		//The function below returns a Boolean value representing whether the point with the coordinates supplied "hits" the particle.
		this.hitTest = function (hitX, hitY, context) {
			return((hitX > this.x) && 
				(hitX < this.x + this.width) &&
				(hitY > this.y) &&
				(hitY < this.y + this.height));
		}

		/** Draw the optional shapes around this one **/
		this.drawShapes = function (context) {
			if (this.line1) { //left
				if (shapeSelection == "triangle") {
					var newTriangle = new Triangle(this.x - 5, this.y, "left");
					var canAdd = true;
					for (var i = 0; i < shapeList.length; i++) {
						if (testBoundingBox(newTriangle, shapeList[i], 50))
							canAdd = false;
					}
					if (canAdd) {
						shapeOptionList.push(newTriangle);
						this.triangleList['one'] = newTriangle;
					}
				} else if (shapeSelection == "square") {
					var newSquare = new Square(this.x - 55, this.y, 50, 50);
					var canAdd = true;
					for (var i = 0; i < shapeList.length; i++) {
						if (testBoundingBox(newSquare, shapeList[i], 50))
							canAdd = false;
					}
					if (canAdd) {
						shapeOptionList.push(newSquare);
						this.squareList['one'] = newSquare;
					}
				}
			}
			if (this.line2) { //bottom
				if (shapeSelection == "triangle") {
					var newTriangle = new Triangle(this.x, this.y + 55, "down");
					var canAdd = true;
					for (var i = 0; i < shapeList.length; i++) {
						if (testBoundingBox(newTriangle, shapeList[i], 50))
							canAdd = false;
					}
					if (canAdd) {
						shapeOptionList.push(newTriangle);
						this.triangleList['two'] = newTriangle;
					}
				} else if (shapeSelection == "square") {
					var newSquare = new Square(this.x, this.y + 55, 50, 50);
					var canAdd = true;
					for (var i = 0; i < shapeList.length; i++) {
						if (testBoundingBox(newSquare, shapeList[i], 50))
							canAdd = false;
					}
					if (canAdd) {
						shapeOptionList.push(newSquare);
						this.squareList['two'] = newSquare;
					}
				}
			}
			if (this.line3) { //right
				if (shapeSelection == "triangle") {
					var newTriangle = new Triangle(this.x + 55, this.y, "right");
					var canAdd = true;
					for (var i = 0; i < shapeList.length; i++) {
						if (testBoundingBox(newTriangle, shapeList[i], 50))
							canAdd = false;
					}
					if (canAdd) {
						shapeOptionList.push(newTriangle);
						this.triangleList['three'] = newTriangle;
					}
				} else if (shapeSelection == "square") {
					var newSquare = new Square(this.x + 55, this.y, 50, 50);
					var canAdd = true;
					for (var i = 0; i < shapeList.length; i++) {
						if (testBoundingBox(newSquare, shapeList[i], 50))
							canAdd = false;
					}
					if (canAdd) {
						shapeOptionList.push(newSquare);
						this.squareList['three'] = newSquare;
					}
				}
			}
			if (this.line4) { //top
				if (shapeSelection == "triangle") {
					var newTriangle = new Triangle(this.x, this.y - 5, "up");
					var canAdd = true;
					for (var i = 0; i < shapeList.length; i++) {
						if (testBoundingBox(newTriangle, shapeList[i], 50))
							canAdd = false;
					}
					if (canAdd) {
						shapeOptionList.push(newTriangle);
						this.triangleList['four'] = newTriangle;
					}
				} else if (shapeSelection == "square") {
					var newSquare = new Square(this.x, this.y - 55, 50, 50);
					var canAdd = true;
					for (var i = 0; i < shapeList.length; i++) {
						if (testBoundingBox(newSquare, shapeList[i], 50))
							canAdd = false;
					}
					if (canAdd) {
						shapeOptionList.push(newSquare);
						this.squareList['four'] = newSquare;
					}
				}
			}
			drawShapes();
		}

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
		mouseX = (evt.clientX - rect.left)*(canvas.width/rect.width);
		mouseY = (evt.clientY - rect.top)*(canvas.height/rect.height);
		

		for (var i=0; i < shapeOptionList.length; i++) {

			if (shapeSelection == "triangle") {

				//Test if a triangle has been clicked on
				if (shapeOptionList[i].hitTest(mouseX, mouseY, context) && shapeOptionList[i].shape == "triangle") {	

					//once one of the triangles have been clicked on...

					for (var j = 0; j < shapeList.length; j++) {
						
						//go through each real shape and see if one of their side squares matches up
						
						//hit a triangle from a triangle
						if (shapeList[j].shape == "triangle") { //shapeList holds real shape
							if (shapeList[j].triangleList["one"] == shapeOptionList[i]) {
								if (shapeOptionList[i].x < shapeList[j].x) {  //clicked on left side of real triangle
									if (shapeList[j].direction == "up")  //for real up triangles
										shapeList[j].line1 = false;
									else if (shapeList[j].direction == "down") //for real down triangles
										shapeList[j].line2 = false;
									shapeOptionList[i].line3 = false;
								}
								
							} else if (shapeList[j].triangleList["two"] == shapeOptionList[i]) {
								if (shapeOptionList[i].x > shapeList[j].x) {  //clicked on right side of real triangle
									if (shapeList[j].direction == "up")  { //for real up triangles
										shapeList[j].line3 = false;
										shapeOptionList[i].line2 = false;
									}
									else if (shapeList[j].direction == "down") {//for real down triangles
										shapeList[j].line3 = false;
										shapeOptionList[i].line1 = false;
									}
									
								}
							} else if (shapeList[j].triangleList["three"] == shapeOptionList[i]) {
								if (shapeOptionList[i].x == shapeList[j].x) {  //clicked on bottom/top side of real triangle
									if (shapeList[j].direction == "up") { //for real up triangles
										shapeList[j].line2 = false;
										shapeOptionList[i].line1 = false;
									} else if (shapeList[j].direction == "down") { //for real down triangles
										shapeList[j].line1 = false;
										shapeOptionList[i].line2 = false;
									}
								}
							}
						} 
						//hit a triangle from a square
						else if (shapeList[j].shape == "square") { //shapeList holds real shape
							
							if (shapeList[j].triangleList["one"] == shapeOptionList[i]) {
								shapeList[j].line1 = false; //left side of square
								shapeOptionList[i].line2 = false; //left-facing triangle
							} else if (shapeList[j].triangleList["two"] == shapeOptionList[i]) {
								shapeList[j].line2 = false; //bottom side of square
								shapeOptionList[i].line1 = false; //bottom-facing triangle
							} else if (shapeList[j].triangleList["three"] == shapeOptionList[i]) {
								shapeList[j].line3 = false; //right side of square
								shapeOptionList[i].line2 = false; //right-facing triangle 
							} else if (shapeList[j].triangleList["four"] == shapeOptionList[i]) {
								shapeList[j].line4 = false; //top side of square
								shapeOptionList[i].line2 = false; //upward-facing triangle
							}
							
						}
					}

					shapeList.push(shapeOptionList[i]);

					//clear option list
					shapeOptionList = [];

					drawShapes();
				}

			} else if (shapeSelection == "square") {
				if (shapeOptionList[i].hitTest(mouseX, mouseY, context) && shapeOptionList[i].shape == "square") {	

					//once one of the squares have been clicked on...

					for (var j = 0; j < shapeList.length; j++) {
						
						//go through each real shape and see if one of their side squares matches up
						
						//hit a square from a triangle
						if (shapeList[j].shape == "triangle") { //shapeList holds real shape
							if (shapeList[j].squareList["one"] == shapeOptionList[i]) {
								if (shapeList[j].direction == "up") {  //clicked on bottom square from up-facing triangle
									shapeList[j].line2 = false;
									shapeOptionList[i].line4 = false;
								} else if (shapeList[j].direction == "down") { //clicked on top square from bottom-facing triangle
									shapeList[j].line1 = false;
									shapeOptionList[i].line2 = false;
								}
								
							}
						} 
						//hit a square from a square
						else if (shapeList[j].shape == "square") { //shapeList holds real shape
							
							//go through each real square and see if one of their side squares matches up
							if (shapeList[j].squareList["one"] == shapeOptionList[i]) {
								shapeList[j].line1 = false;
								shapeOptionList[i].line3 = false;
							} else if (shapeList[j].squareList["two"] == shapeOptionList[i]) {
								shapeList[j].line2 = false;
								shapeOptionList[i].line4 = false;
							} else if (shapeList[j].squareList["three"] == shapeOptionList[i]) {
								shapeList[j].line3 = false;
								shapeOptionList[i].line1 = false;
							} else if (shapeList[j].squareList["four"] == shapeOptionList[i]) {
								shapeList[j].line4 = false;
								shapeOptionList[i].line2 = false;
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
		mouseX = (evt.clientX - rect.left)*(canvas.width/rect.width);
		mouseY = (evt.clientY - rect.top)*(canvas.height/rect.height);


		for (var i=0; i < shapeList.length; i++) {
			if (shapeList[i].hitTest(mouseX, mouseY, context)) {	

				if (!(shapeList[i].color == "red")) {
					shapeList[i].color = "red";
				} else {
					shapeList[i].color = "black";
				}
				
				drawShapes();
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
		mouseX = (evt.clientX - rect.left)*(canvas.width/rect.width);
		mouseY = (evt.clientY - rect.top)*(canvas.height/rect.height);

		for (var i=0; i < shapeList.length; i++) {
			if (shapeList[i].hitTest(mouseX, mouseY, context)) {	
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
			newShape = new Square(x, y, 50, 50);
		} else {
			newShape = new Triangle(x - 30, y + 20, "up");
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
		
		for (var i = 0; i < shapeOptionList.length; i++) {
			shapeOptionList[i].drawShapeBlue(context);
		}
		for (var i = 0; i < shapeList.length; i++) {
			shapeList[i].draw(context);
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
		checkEmptyCanvas();
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



	$("#clearCanvas").on('click', function() {
		clearCanvas(canvas);
	});

	$("#new").on('click', function () {
		if (!newDocument) {
			Alert.render("Any changes you made will be lost. Do you want to continue?");
		}
		
	});

	$(".tools").on('click', function () {
		mode = $(this).attr('class').replace("tools button ", "");
		if (mode == "delete" && $(".draw").hasClass("selected")) {
			$(".delete").addClass("selected");
			$(".draw").removeClass("selected");
			shapeOptionList = [];
			drawShapes();
			canvas.addEventListener("click", mouseClickListener3, false);
			canvas.addEventListener("mousemove", mouseMoveListener, false);
		} else if (mode == "draw" && $(".delete").hasClass("selected")) {
			$(".draw").addClass("selected");
			$(".delete").removeClass("selected");
			canvas.removeEventListener("click", mouseClickListener3, false);
			canvas.removeEventListener("mousemove", mouseMoveListener, false);
			for (var i=0; i < shapeList.length; i++) {
				shapeList[i].color = "#000000";	
			}
			
		}
		drawShapes();
	});

	$("#deleteObject").on('click', function () {
		for(var i = 0; i < shapeList.length; i++) {
			if (shapeList[i].color == "red") {
				for (var j = 0; j < shapeList.length; j++) {
					if (shapeList[j].shape="square") {
						if (shapeList[i] == shapeList[j].squareList["one"]) {
						shapeList[j].line1 = true;
						}  
						if (shapeList[i] == shapeList[j].squareList["two"]) {
							shapeList[j].line2 = true;
						}  
						if (shapeList[i] == shapeList[j].squareList["three"]) {
							shapeList[j].line3 = true;
						}  
						if (shapeList[i] == shapeList[j].squareList["four"]) {
							shapeList[j].line4 = true;
						}
					}
					
				}
				shapeList.splice(i, 1);
				i--;
			}
		}

		drawShapes();
		checkEmptyCanvas();

	});

	$("#addSquare").on('click', function () {
		shapeOptionList = [];
		shapeSelection = "square";
		if (shapeList.length > 0) {
			for (var i = 0; i < shapeList.length; i++) {
				shapeList[i].drawShapes(context);
			}
			canvas.addEventListener('click', mouseClickListener2, false);
		}

		if ($(".delete").hasClass("selected")) {
			$(".draw").addClass("selected");
			$(".delete").removeClass("selected");
			for (var i=0; i < shapeList.length; i++) {
				shapeList[i].color = "#000000";	
			}
			drawShapes();
		}

	});

	$("#addTriangle").on('click', function () {
		shapeOptionList = [];
		shapeSelection = "triangle";
		if (shapeList.length > 0) {
			for (var i = 0; i < shapeList.length; i++) {
				shapeList[i].drawShapes(context);
			}
			canvas.addEventListener('click', mouseClickListener2, false);
		}

		if ($(".delete").hasClass("selected")) {
			$(".draw").addClass("selected");
			$(".delete").removeClass("selected");
			for (var i=0; i < shapeList.length; i++) {
				shapeList[i].color = "#000000";	
			}
			drawShapes();
		}

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

	var Alert = new CustomAlert();
	
});