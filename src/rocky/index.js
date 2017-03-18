var rocky = require('rocky');

function fractionToRadian(fraction) {
  return fraction * 2 * Math.PI;
}

function drawHand(ctx, cx, cy, angle, start, length, color, linewidth) {
  // Find the start points
  var x1 = cx + Math.sin(angle) * start;
  var y1 = cy - Math.cos(angle) * start;

  // Find the end points
  var x2 = cx + Math.sin(angle) * length;
  var y2 = cy - Math.cos(angle) * length;

  // Configure how we want to draw the hand
  ctx.lineWidth = linewidth;
  ctx.strokeStyle = color;

  // Begin drawing
  ctx.beginPath();

  // Move to the center point, then draw the line
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);

  // Stroke the line (output to display)
  ctx.stroke();
}

function drawPlaceHolder(ctx, cx, cy, maxLength) {
  var i;
  for (i = 0; i < 12; i++) {
    drawHand(ctx, cx, cy, fractionToRadian(i/12), maxLength*0.80, maxLength, "white", 4);
  }
}

function drawBackground() {
  var UI = require('ui');

  var logo_image = new UI.Image({
    position: new Vector2(0, 0),
    size: new Vector2(180, 180),
    backgroundColor: 'clear',
    image: 'images/no1.png',
  });

  wind.add(logo_image);
  wind.show();
}

rocky.on('draw', function(event) {
  var ctx = event.context;
  var d = new Date();

  // Clear the screen
  ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

  // Determine the width and height of the display
  var w = ctx.canvas.unobstructedWidth;
  var h = ctx.canvas.unobstructedHeight;

  // Determine the center point of the display
  // and the max size of watch hands
  var cx = w / 2;
  var cy = h / 2;

  // -20 so we're inset 10px on each side
  var maxLength = (Math.min(w, h) - 20) / 2;

  drawPlaceHolder(ctx, cx, cy, maxLength);

  var secondFraction = (d.getSeconds()) / 60;
  var secondAngle = fractionToRadian(secondFraction);
  // Draw the second hand
  drawHand(ctx, cx, cy, secondAngle, 0, maxLength * 0.90, "#7263F9", 2);

  // Calculate the minute hand angle
  var minuteFraction = (d.getMinutes()) / 60;
  var minuteAngle = fractionToRadian(minuteFraction);

  // Draw the minute hand
  drawHand(ctx, cx, cy, minuteAngle, 0, maxLength * 0.80, "white", 5);

  // Calculate the hour hand angle
  var hourFraction = (d.getHours() % 12 + minuteFraction) / 12;
  var hourAngle = fractionToRadian(hourFraction);

  // Draw the hour hand
  drawHand(ctx, cx, cy, hourAngle, 0, maxLength * 0.6, "white", 4);
});

rocky.on('secondchange', function(event) {
  // Request the screen to be redrawn on next pass
  rocky.requestDraw();
});
