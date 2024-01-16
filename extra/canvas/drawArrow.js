window.addEventListener("load", eventWindowLoaded, false);

function eventWindowLoaded() {
  canvasApp(); //包含整个Canvas应用程序
}
function canvasSupport(e) {
  return !!e.getContext;
}
function canvasApp() {
  var myCanvas = document.getElementById("myCanvas");

  if (!canvasSupport(myCanvas)) {
    return;
  }

  var ctx = myCanvas.getContext("2d");

  myCanvas.width = window.innerWidth;
  myCanvas.height = window.innerHeight;

  // Draw grid
  function drawGrid(ctx, w, h, strokeStyle, step) {
    for (var x = 0.5; x < w; x += step) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }

    for (var y = 0.5; y < h; y += step) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }

    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
  }

  // From: http://www.dbp-consulting.com/tutorials/canvas/CanvasArrow.html
  // Draw arrow head
  function drawHead(ctx, x0, y0, x1, y1, x2, y2, style, color, width) {
    if (typeof x0 == "string") {
      x0 = parseInt(x0);
    }
    if (typeof y0 == "string") {
      y0 = parseInt(y0);
    }
    if (typeof x1 == "string") {
      x1 = parseInt(x1);
    }
    if (typeof y1 == "string") {
      y1 = parseInt(y1);
    }
    if (typeof x2 == "string") {
      x2 = parseInt(x2);
    }
    if (typeof y2 == "string") {
      y2 = parseInt(y2);
    }

    var radius = 3,
      twoPI = 2 * Math.PI;

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);

    switch (style) {
      case 0:
        var backdist = Math.sqrt((x2 - x0) * (x2 - x0) + (y2 - y0) * (y2 - y0));
        ctx.arcTo(x1, y1, x0, y0, 0.55 * backdist);
        ctx.fill();
        break;
      case 1:
        // 有很多没用的代码……，其实主要就是画箭头的三个点，三条线，最后 fill 即可；
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        // 甚至其实两条线也可以，这条线可以不要
        ctx.lineTo(x0, y0);
        ctx.fill();
        break;
      case 2:
        ctx.stroke();
        break;
      case 3:
        var cpx = (x0 + x1 + x2) / 3;
        var cpy = (y0 + y1 + y2) / 3;
        ctx.quadraticCurveTo(cpx, cpy, x0, y0);
        ctx.fill();
        break;
      case 4:
        var cp1x, cp1y, cp2x, cp2y, backdist;
        var shiftamt = 5;
        if (x2 == x0) {
          backdist = y2 - y0;
          cp1x = (x1 + x0) / 2;
          cp2x = (x1 + x0) / 2;
          cp1y = y1 + backdist / shiftamt;
          cp2y = y1 - backdist / shiftamt;
        } else {
          backdist = Math.sqrt((x2 - x0) * (x2 - x0) + (y2 - y0) * (y2 - y0));
          var xback = (x0 + x2) / 2;
          var yback = (y0 + y2) / 2;
          var xmid = (xback + x1) / 2;
          var ymid = (yback + y1) / 2;
          var m = (y2 - y0) / (x2 - x0);
          var dx = backdist / (2 * Math.sqrt(m * m + 1)) / shiftamt;
          var dy = m * dx;
          cp1x = xmid - dx;
          cp1y = ymid - dy;
          cp2x = xmid + dx;
          cp2y = ymid + dy;
        }
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x0, y0);
        ctx.fill();
        break;
    }
    ctx.restore();
  }

  // draw arrow
  function drawArrow(
    ctx,
    x1,
    y1,
    x2,
    y2,
    style,
    which,
    angle,
    d,
    color,
    width
  ) {
    if (typeof x1 == "string") {
      x1 = parseInt(x1);
    }
    if (typeof y1 == "string") {
      y1 = parseInt(y1);
    }
    if (typeof x2 == "string") {
      x2 = parseInt(x2);
    }
    if (typeof y2 == "string") {
      y2 = parseInt(y2);
    }
    style = typeof style != "undefined" ? style : 3;
    which = typeof which != "undefined" ? which : 1;
    angle = typeof angle != "undefined" ? angle : Math.PI / 9;
    d = typeof d != "undefined" ? d : 10;
    color = typeof color != "undefined" ? color : "#000";
    width = typeof width != "undefined" ? width : 1;
    var toDrawHead = typeof style != "function" ? drawHead : style;
    var dist = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    var ratio = (dist - d / 3) / dist;
    var tox, toy, fromx, fromy;
    if (which & 1) {
      tox = Math.round(x1 + (x2 - x1) * ratio);
      toy = Math.round(y1 + (y2 - y1) * ratio);
    } else {
      tox = x2;
      toy = y2;
    }

    if (which & 2) {
      fromx = x1 + (x2 - x1) * (1 - ratio);
      fromy = y1 + (y2 - y1) * (1 - ratio);
    } else {
      fromx = x1;
      fromy = y1;
    }

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.stroke();

    var lineangle = Math.atan2(y2 - y1, x2 - x1);
    var h = Math.abs(d / Math.cos(angle));
    if (which & 1) {
      var angle1 = lineangle + Math.PI + angle;
      var topx = x2 + Math.cos(angle1) * h;
      var topy = y2 + Math.sin(angle1) * h;
      var angle2 = lineangle + Math.PI - angle;
      var botx = x2 + Math.cos(angle2) * h;
      var boty = y2 + Math.sin(angle2) * h;
      toDrawHead(ctx, topx, topy, x2, y2, botx, boty, style, color, width);
    }

    if (which & 2) {
      var angle1 = lineangle + angle;
      var topx = x1 + Math.cos(angle1) * h;
      var topy = y1 + Math.sin(angle1) * h;
      var angle2 = lineangle - angle;
      var botx = x1 + Math.cos(angle2) * h;
      var boty = y1 + Math.sin(angle2) * h;
      toDrawHead(ctx, topx, topy, x1, y1, botx, boty, style, color, width);
    }
  }

  // draw arced arrow
  function drawArcedArrow(
    ctx,
    x,
    y,
    r,
    startangle,
    endangle,
    anticlockwise,
    style,
    which,
    angle,
    d,
    color,
    width
  ) {
    style = typeof style != "undefined" ? style : 3;
    which = typeof which != "undefined" ? which : 1;
    angle = typeof angle != "undefined" ? angle : Math.PI / 8;
    d = typeof d != "undefined" ? d : 10;
    color = typeof color != "undefined" ? color : "#000";
    width = typeof width != "undefined" ? width : 1;

    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.arc(x, y, r, startangle, endangle, anticlockwise);
    ctx.stroke();
    var sx, sy, lineangle, destx, desty;
    ctx.strokeStyle = "rgba(0,0,0,0)";
    if (which & 1) {
      sx = Math.cos(startangle) * r + x;
      sy = Math.sin(startangle) * r + y;
      lineangle = Math.atan2(x - sx, sy - y);
      if (anticlockwise) {
        destx = sx + 10 * Math.cos(lineangle);
        desty = sy + 10 * Math.sin(lineangle);
      } else {
        destx = sx - 10 * Math.cos(lineangle);
        desty = sy - 10 * Math.sin(lineangle);
      }
      drawArrow(ctx, sx, sy, destx, desty, style, 2, angle, d, color, width);
    }

    if (which & 2) {
      sx = Math.cos(endangle) * r + x;
      sy = Math.sin(endangle) * r + y;
      lineangle = Math.atan2(x - sx, sy - y);
      if (anticlockwise) {
        destx = sx - 10 * Math.cos(lineangle);
        desty = sy - 10 * Math.sin(lineangle);
      } else {
        destx = sx + 10 * Math.cos(lineangle);
        desty = sy + 10 * Math.sin(lineangle);
      }
      drawArrow(ctx, sx, sy, destx, desty, style, 2, angle, d, color, width);
    }
    ctx.restore();
  }
  function drawScreen() {
    drawGrid(ctx, myCanvas.width, myCanvas.height, "#eee", 10);

    drawArrow(ctx, 100, 50, 250, 50, 1, 1, 20, 10, "#f36", 4);
    drawArrow(ctx, 300, 50, 450, 50, 2, 1, 20, 10, "blue", 4);
    drawArrow(ctx, 500, 50, 650, 50, 3, 1, 20, 10, "orange", 4);
    drawArrow(ctx, 700, 50, 850, 50, 4, 1, 20, 10, "green", 4);

    drawArrow(ctx, 100, 100, 250, 100, 1, 2, 20, 10, "#f36", 4);
    drawArrow(ctx, 300, 100, 450, 100, 2, 2, 20, 10, "blue", 4);
    drawArrow(ctx, 500, 100, 650, 100, 3, 2, 20, 10, "orange", 4);
    drawArrow(ctx, 700, 100, 850, 100, 4, 2, 20, 10, "green", 4);

    drawArrow(ctx, 100, 150, 250, 250, 1, 2, 20, 10, "#f36", 4);
    drawArrow(ctx, 300, 150, 450, 250, 2, 2, 20, 10, "blue", 4);
    drawArrow(ctx, 500, 150, 650, 250, 3, 2, 20, 10, "orange", 4);
    drawArrow(ctx, 700, 150, 850, 250, 4, 2, 20, 10, "green", 4);

    drawArcedArrow(ctx, 900, 200, 100, 20, 100, true, 1, 1, 20, 10, "blue", 4);
  }

  drawScreen();
}
