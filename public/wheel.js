//Constants
var MIN_SLICES = 1;
var BOUNCE_VELOCITY = .01;
var STOP_VELOCITY = .005;
var IO_MODE = false;
var DEBUG = false;


var abbreviations = new Array({ text: "Sexual Harassment Seminar", abbreviation: "Sexual Harassment" }, { text: "Self Help Seminar", abbreviation: "Self Help" }, { text: "Apple Product Launch", abbreviation: "Apple Product" }, { text: "New Hire Orientation", abbreviation: "Orientation" }, { text: "Video Game Pitch", abbreviation: "Video Game" }, { text: "Lifetime Achievement Award", abbreviation: "Lifetime Achievement" });

// Colors
// blend of cyan and magent from new logo
// var cyanpink="#86396d";
// washed-out purple from new logo
var cyanpink = "#876c9e";
// purple from old logo
//var cyanpink = "#a83b7d";
var silver = "#e0e0e0";
var black = "#000000";
var darkGray = "#3f3f3f";
var white = "#ffffff";
var red = "#ff0000";
var logoTextColor = "#565654";

// io colors
var ioCyan = "#00bcd4";
var logoYellow = "#ffbb03";
var logoBlue = "#186dee";
var logoRed = "#d6412b";
var logoGreen = "#009b58";
var logoYellowBright = "#ffe303";
var logoBlueBright = "#209bfb";
var logoRedBright = "#f35e3e";
var logoGreenBright = "#00cb7c";
var logoColors = [logoBlue, logoRed, logoYellow, logoBlue, logoGreen, logoRed];
var logoColorsBright = [logoBlueBright, logoRedBright, logoYellowBright, logoBlueBright,
    logoGreenBright, logoRedBright
];

// thing color assignments
var hubColor = white;
var clickerColor = logoTextColor;
var categoryTextColor = logoTextColor;

var hubColor = IO_MODE ? ioCyan : cyanpink;

var wheelInsetSize = 30;
var wheelCenterX = 250;
var wheelCenterY = 250;
var wheelRadius = 250;
var c = document.getElementById("myCanvas");
var mainCtx = c.getContext("2d");
var hubFraction = 0.2;
var paddingFraction = 0.075;
var speechlessFont;
var speechlessSize;
var speechlessHeight;
var pegDistance = 20;
var mPrevNumPegs = 0;
var mPegFriction = .99;
var clickerBend = 0;
var prevClickerBend = 0;
var frictionFactor = 0; // 10% loss per revolution
var textHeight = 0;
var bounced = false;
var clickerOutset = 25;
var numCategories = 0;
var mCategories = new Array();

var canvasDiv = document.getElementById("canvas-container");
document.onkeydown = onKeyDown;

var categoryCanvasDiv = document.getElementById("current-category-container");
var categoryCanvas = document.getElementById("categoryCanvas");
var categoryCtx = categoryCanvas.getContext("2d");

var bodyElement = document.getElementById("body");

var wheelValid = false;
var hubValid = false;
var firstTimeWheelDisplayed = true;

var lastAnimationFrameId = -1;

//categoryCtx.

// var bgGradient = mainCtx.createLinearGradient(0, 0, 0, 500);
// bgGradient.addColorStop(0, "white");
// bgGradient.addColorStop(1, "black");
// mainCtx.fillStyle = bgGradient;
// mainCtx.strokeStyle = "#000000";
// mainCtx.fillRect(0, 0, 500, 500);
// c.width = window.innerWidth * .8
// c.height = window.innerHeight;
// c.style.left = c.width/2 + "px";
// c.style.alignSelf="center";

var offscreenCanvas = document.createElement("canvas");
offscreenCanvas.width = 500;
offscreenCanvas.height = 500;
var offscreenCtx = offscreenCanvas.getContext('2d');
c.addEventListener("mousedown", onMouseDown);
c.addEventListener("mouseclick", onMouseClick);

var pegTapSound = document.getElementById("pegTap");
var gongSound = document.getElementById("gong");

function scheduleAnimation() {
    window.cancelAnimationFrame(lastAnimationFrameId);
    lastAnimationFrameId = window.requestAnimationFrame(drawWheel);
}

function resizeCanvas() {
    //    var canvas = c;
    //    var maxDimension = Math.min(window.innerWidth, window.innerHeight);
    //    if (canvas.width != maxDimension || canvas.height != maxDimension) {
    //        canvas.width = maxDimension;
    //        canvas.height = maxDimension;
    //    }
    //    console.log("Setting cat canvas w to " + categoryCanvasDiv.clientWidth);
    categoryCanvas.width = categoryCanvasDiv.clientWidth;
    categoryCanvas.height = categoryCanvasDiv.clientHeight;
    categoryCtx.font = "30pt GothamRnd-Medium";
    //    categoryCtx.fillStyle = hubColor;
    categoryCtx.fillStyle = categoryTextColor;

    scheduleAnimation();
}

function onKeyDown(event) {
    log("onKeyDown" + event.keyCode);
    if (!formVisible) {
        if (event.keyCode == '38' || event.keyCode == '39') {
            // UP or RIGHT
            spinWheel(false);
            return false;
        } else if (event.keyCode == '37' || event.keyCode == '40') {
            spinWheel(true);
            return false;
        }
    }
    // shortcut keys for various commands
    if (event.ctrlKey && event.keyCode == '68') {
        // toggle logging
        DEBUG = !DEBUG;
        //    } else if (event.ctrlKey && event.keyCode == '48') {
        //        // set mCurrentAngle to something dumb
        //        mCurrentAngle = NaN;
    } else if (event.ctrlKey && event.shiftKey && event.keyCode == '191') {
        // toggle help display
        var commandsTable = document.getElementById("commands");
        var oldVisibility = commandsTable.style.display;
        commandsTable.style.display = oldVisibility == "inline" ? "none" : "inline";
    }
}

function onMouseClick(event) {
    //    console.log(event);
}

resize();

var mouseDownX, mouseDownY;
var mDownPhi, mLastPhi;
var mDownTime;
var mTrajectory;
var mStartAngle;
var mCurrentAngle = 0;
var mPrevX, mPrevY;
var timerId;
var mAnimating = false;
var mPrevAngle = -1;
var mLastAnimTime;

var ColorUtils = {};
/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and v in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSV representation
 */
ColorUtils.rgbToHsv = function(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }

        h /= 6;
    }

    return [h, s, v];
};

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
ColorUtils.hsvToRgb = function(h, s, v) {
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0:
            r = v, g = t, b = p;
            break;
        case 1:
            r = q, g = v, b = p;
            break;
        case 2:
            r = p, g = v, b = t;
            break;
        case 3:
            r = p, g = q, b = v;
            break;
        case 4:
            r = t, g = p, b = v;
            break;
        case 5:
            r = v, g = p, b = q;
            break;
    }

    return [r * 255, g * 255, b * 255];
};


function resize() {
    var width = window.innerWidth * .8;
    var height = window.innerHeight * .8;
    var size = Math.min(width, height);
    c.width = Math.max(width, height);
    c.height = size;
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    wheelRadius = size / 2 - wheelInsetSize;
    wheelCenterX = wheelInsetSize + wheelRadius;
    wheelCenterY = wheelInsetSize + wheelRadius;
    resizeCanvas();
    wheelValid = false;
    hubValid = false;
}

window.onresize = resize;
var dragging = false;

function setCurrentAngle(angle) {
    if (angle != mCurrentAngle) {
        mCurrentAngle = angle;
        if (isNaN(mCurrentAngle)) {
            // workaround for unknown issue where angle gets set to NaN
            mCurrentAngle = 0;
        }
    }
}

function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function deleteCategory(angle) {
    for (var i = 0; i < slices.length; ++i) {
        if (angle >= slices[i].startAngle && angle < slices[i].endAngle) {
            for (var categoryIndex = 0; categoryIndex < numCategories; ++categoryIndex) {
                if (slices[i].text == mCategories[categoryIndex].text) {
                    mCategories.splice(categoryIndex, 1);
                    numCategories--;
                    createWheel();
                    setCategoryText(true);
                    return;
                }
            }
            console.log("Error: couldn't find category row for " + slices[i].text);
            break;
        }
    }
}

function onMouseDown(event) {
    log("onMouseDown");
    var mousePos = getMousePos(c, event);
    var wheelInset = canvasDiv.clientWidth / 2 - wheelRadius;
    mouseDownX = mousePos.x - wheelInset;
    mouseDownY = mousePos.y;
    var deltaX = mouseDownX - wheelCenterX;
    var deltaY = mouseDownY - wheelCenterY;
    var distanceFromCenter = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    // console.log("mouseDownX/Y")
    if (distanceFromCenter < wheelRadius) {
        if (distanceFromCenter < wheelRadius * hubFraction) {
            c.addEventListener("mouseup", onMouseUpHub);
        } else {
            mDownPhi = Math.atan2(-deltaY, deltaX);
            mDownPhi = mDownPhi / Math.PI * 180;
            if (mDownPhi < 0) {
                mDownPhi += 360;
            }
            mLastPhi = mDownPhi;
            if (event.shiftKey || event.metaKey) {
                mDownPhi = 360 - mDownPhi;
                mDownPhi += mCurrentAngle + 90;
                mDownPhi = mDownPhi % 360;
                if (mDownPhi < 0) {
                    mDownPhi += 360;
                }
                deleteCategory(mDownPhi);
            } else {
                c.addEventListener("mousemove", onMouseDrag);
                mStartAngle = mCurrentAngle;
                mTrajectory = 0;
                // console.log("mDownPhi = " + mDownPhi);
                mDownTime = event.timeStamp;
                // timerId = setInterval(drawWheel, 10);
                scheduleAnimation();
                mPrevX = deltaX;
                mPrevY = deltaY;
                c.addEventListener("mouseup", onMouseUp);
                c.addEventListener("mouseout", onMouseUp);
            }
        }
    }
}

function onMouseUpHub(event) {
    var mousePos = getMousePos(c, event);
    var wheelInset = canvasDiv.clientWidth / 2 - wheelRadius;
    mouseDownX = mousePos.x - wheelInset;
    mouseDownY = mousePos.y;
    var deltaX = mouseDownX - wheelCenterX;
    var deltaY = mouseDownY - wheelCenterY;
    var distanceFromCenter = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    // console.log("mouseDownX/Y")
    if (distanceFromCenter < wheelRadius * hubFraction) {
        // Spin the wheel at some standard speed
        spinWheel(true);
        c.removeEventListener("mouseup", onMouseUpHub);
    }
}

function start() {
    bounced = false;
    mAnimating = true;
    mPegFriction = .999999;
    frictionFactor = 0;
    mLastAnimTime = Date.now();
    scheduleAnimation();
}

function spinWheel(clockwise) {
    log("spinWheel " + (clockwise ? "clockwise" : "counter-clockwise"));
    mVelocity = .8 + (Math.random() * .25);
    //    mVelocity = .01;
    if (clockwise) {
        mVelocity *= -1;
    }
    start();
}

function onMouseUp(event) {
    log("onMouseUp");
    c.removeEventListener("mousemove", onMouseDrag);
    c.removeEventListener("mouseup", onMouseUp);
    c.removeEventListener("mouseout", onMouseUp);
    var deltaTime = event.timeStamp - mDownTime;
    calcTrajectory(event);
    mVelocity = (mTrajectory) / deltaTime;
    //    console.log("mouseUp: trajectory, velocity = " + mTrajectory + ", " + mVelocity);
    if (mVelocity != 0) {
        start();
    }
}

function onMouseDrag(event) {
    log("onMouseDrag");
    //    console.log("drag: mouse position = " + event.clientX + ", " + event.clientY);
    calcTrajectory(event);
    setCurrentAngle(mStartAngle + mTrajectory);
    //    console.log("drag: currentAngle = " + mCurrentAngle);
    scheduleAnimation();
}

function calcTrajectory(event) {
    var mousePos = getMousePos(c, event);
    var wheelInset = canvasDiv.clientWidth / 2 - wheelRadius;
    var moveX = mousePos.x - wheelInset;
    var moveY = mousePos.y;
    var xFromCenter1 = moveX - wheelCenterX;
    var yFromCenter1 = moveY - wheelCenterY;
    var movePhi = Math.atan2(-yFromCenter1, xFromCenter1);
    movePhi = movePhi / Math.PI * 180;
    if (movePhi < 0) {
        movePhi += 360;
    }
    // console.log("moveXY, centerXY, movePhi = " + moveX + ", " + moveY + ", " +
    //     xFromCenter1 + ", " + yFromCenter1 + ", " + movePhi);
    mTrajectory += (movePhi - mLastPhi);
    if (xFromCenter1 > 0) {
        if (yFromCenter1 > 0 && mPrevY < 0) {
            mTrajectory -= 360;
        } else if (yFromCenter1 < 0 && mPrevY > 0) {
            mTrajectory += 360;
        }
    }
    mPrevX = xFromCenter1;
    mPrevY = yFromCenter1;
    mLastPhi = movePhi;
}

function decelerate(t) {
    return (1 - (1 - t) * (1 - t));
}

function getNumPegs(angle, velocity) {
    var numPegs = Math.floor(angle / pegDistance);
    if (numPegs < 0) {
        // account for floor() on negatives
        numPegs += 1;
    }
    return numPegs;
}

function getFriction(velocity) {
    var absVel = Math.abs(velocity);
    if (absVel < 2 * BOUNCE_VELOCITY) {
        return .8;
    } else if (absVel < .1) {
        return .9;
    } else if (absVel < .2) {
        return .99;
    } else {
        return .998;
    }
}

function drawWheel() {
    log("drawWheel()");
    if (!wheelValid) {
        createWheel();
    }
    if (numCategories == 0) {
        // nothing to draw
        return;
    }
    var wheelTranslation = canvasDiv.clientWidth / 2 - wheelRadius - wheelInsetSize;
    mainCtx.save();
    mainCtx.translate(wheelTranslation, 0);
    if (prevClickerBend != clickerBend) {
        // erase clicker area
        drawClicker(mainCtx, prevClickerBend, white);
    }

    if (mAnimating || prevClickerBend != clickerBend) {
        var nowTime = Date.now();
        var deltaTime = nowTime - mLastAnimTime;
        var degreesMoved = mVelocity * deltaTime;
        var percentMoved = Math.abs(degreesMoved / 360);
        log("drawWheel(): deltaTime, percentMoved = " + deltaTime + ",  " + percentMoved);
        mVelocity *= (1 - (percentMoved * frictionFactor));
        // crank the friction up over time
        frictionFactor += (bounced ? 50 : 0) * percentMoved;
        // count the pegs passed since last time
        var currAngle = mCurrentAngle + degreesMoved;
        var currNumPegs = getNumPegs(currAngle, mVelocity);
        var deltaPegs = Math.abs(currNumPegs - mPrevNumPegs);
        prevClickerBend = clickerBend;
        if (deltaPegs > 0) {
            //            mPegFriction -= .01;
            //            mPegFriction *= mPegFriction;
            // if going slower than some minimum, bounce
            if (Math.abs(mVelocity) < BOUNCE_VELOCITY) {
                mVelocity = -mVelocity;
                var offsetFromPeg;
                if (Math.abs(mPrevNumPegs) < Math.abs(currNumPegs)) {
                    offsetFromPeg = currAngle - (currNumPegs * pegDistance);
                } else {
                    offsetFromPeg = -((mPrevNumPegs * pegDistance) - currAngle);
                }
                currAngle -= 2 * offsetFromPeg;
                currNumPegs = getNumPegs(currAngle, mVelocity);
                if (Math.abs(mVelocity) < STOP_VELOCITY) {
                    // if going really slow, stop
                    //                    console.log("stop: mVelocity = " + mVelocity);
                } else {
                    // bounce
                    bounced = true;
                    //                    console.log("*****************************");
                    //                    console.log("bounce: currAngle, prevAngle, currPegs, prevPegs, deltaPegs, mVel = " +
                    //                                currAngle, mPrevAngle, currNumPegs, mPrevNumPegs, deltaPegs, mVelocity);
                }
                clickerBend = mVelocity == 0 ? 0 : (mVelocity < 0) ? clickerBend + 3 : clickerBend - 3;
                gongSound.currentTime = 0;
                gongSound.play();
            } else {
                pegTapSound.currentTime = 0;
                pegTapSound.play();
                mPegFriction *= getFriction(mVelocity);
                mVelocity *= mPegFriction;
                clickerBend = (mVelocity < 0) ? -15 : 15;
            }
            mPrevNumPegs = currNumPegs;
        } else {
            clickerBend = clickerBend < 0 ? clickerBend + 1 : clickerBend > 0 ? clickerBend - 1 : 0;
        }
        if (Math.abs(mVelocity) < STOP_VELOCITY) {
            //            console.log("Stopping animation with velocity at " + mVelocity);
            mAnimating = false;
            // one last time...
            scheduleAnimation();
        }
        //        log("bend = " + clickerBend + " with elapsed time " + deltaTime);
        setCurrentAngle(currAngle);
        mLastAnimTime = nowTime;
        if (mAnimating) {
            scheduleAnimation();
        }
    }
    if (mPrevAngle != mCurrentAngle || prevClickerBend != clickerBend) {
        //         console.log("rotating by " + mCurrentAngle + " or " + (mCurrentAngle * Math.PI / 180));
        mainCtx.save();
        mainCtx.translate(wheelCenterX, wheelCenterY);
        mainCtx.rotate(-(mCurrentAngle + 90) * Math.PI / 180);
        mainCtx.translate(-wheelCenterX, -wheelCenterY);
        mainCtx.drawImage(offscreenCanvas, 0, 0);
        mainCtx.restore();
        mPrevAngle = mCurrentAngle;
        setCategoryText(false);
        if (!IO_MODE) {
            // Draw hub text
            mainCtx.font = speechlessFont;
            mainCtx.fillStyle = "#565654";
            //            mainCtx.fillStyle = "#FFFFFF";
            mainCtx.fillText("speechless", wheelCenterX - speechlessSize / 2, wheelCenterY + speechlessHeight / 2);
        } else {
            var logo = document.getElementById("ioLogoTrans");
            var logoImageW = logo.width;
            var logoImageH = logo.height;
            var hToWRatio = logoImageH / logoImageW;
            var logoW = hubFraction * wheelRadius;
            var logoH = logoW * hToWRatio;
            var logoX = wheelCenterX - logoW / 2;
            var logoY = wheelCenterY - logoH / 2;
            mainCtx.drawImage(logo, logoX, logoY, logoW, logoH);
        }
    }
    drawClicker(mainCtx, clickerBend, clickerColor);
    mainCtx.restore();
}

function formSubmit(form) {
    log("form submitted");
    for (var i = 0; i < form.elements.length; i++) {
        var checkbox = form.elements[i];
        if (checkbox.checked == true) {
            log("child = " + checkbox.value);
            log("value, inner text = " + checkbox.value + ", " + checkbox.textContent);
        }
    }

    mCategories = new Array();
    numCategories = 0;
    for (var i = 0; i < form.elements.length; i++) {
        var checkbox = form.elements[i];
        if (checkbox.checked == true) {
            log("child = " + checkbox.value);
            var category = checkbox.value;
            var abbreviation = checkbox.name;
            if (abbreviation == "") {
                abbreviation = category;
            }
            mCategories[numCategories] = new Object();
            mCategories[numCategories].text = category;
            mCategories[numCategories].abbreviation = abbreviation;
            log("new category = " + mCategories[numCategories].text + ", " + mCategories[numCategories].abbreviation);
            //            var abbreviation = getAbbreviation(category);
            //            slices[numCategories].abbreviation = abbreviation;
            //            if (abbreviation.length > largestCategoryString.length) {
            //                largestCategoryString = abbreviation;
            //            }
            //            slices[numCategories].abbreviation = abbreviation;
            //            mCategories[numCategories] = category;
            numCategories++;
        }
    }
    if (firstTimeWheelDisplayed) {
        // Lazily size hub text on first creation
        hubValid = false;
        firstTimeWheelDisplayed = false;
    }
    createWheel();

}


function drawClicker(ctx, bend, color) {
    var erase = (color == white) ? true : false;
    var eraseFudge = erase ? 2 : 0;
    ctx.fillStyle = color;
    ctx.save();
    ctx.translate(wheelCenterX, wheelCenterY - wheelRadius - clickerOutset + 4);
    ctx.rotate(degToRad(bend * 3));
    ctx.beginPath();
    ctx.moveTo(-clickerOutset / 3 - eraseFudge, -eraseFudge);
    ctx.lineTo(0, clickerOutset + 4 + eraseFudge);
    ctx.lineTo(clickerOutset / 3 + eraseFudge, -eraseFudge);
    ctx.closePath();
    ctx.restore();
    ctx.fill();
}

function degToRad(degrees) {
    return degrees / 180 * Math.PI;
}

function setCategoryText(force) {
    var categoryText = document.getElementById("categoryText");
    for (var i = 0; i < slices.length; ++i) {
        var currentAngle = mCurrentAngle % 360;
        if (currentAngle < 0) {
            currentAngle = 360 + currentAngle;
        }
        if (currentAngle >= slices[i].startAngle && currentAngle < slices[i].endAngle) {
            ctx = categoryCtx;
            categoryCtx.clearRect(0, 0, categoryCanvas.width, categoryCanvas.height);
            var metrics = ctx.measureText(slices[i].text);
            var textWidth = metrics.width;
            //            ctx.fillStyle = "#000000";
            //            console.log("drawing text " + slices[i].text + " to " + (categoryCanvas.width/2 - metrics.width/2)
            //                        + ", " + (categoryCanvas.height));
            categoryCtx.fillText(slices[i].text, categoryCanvas.width / 2 - metrics.width / 2, categoryCanvas.height - 20);
        }
        if (currentAngle >= slices[i].startAngle && currentAngle < slices[i].endAngle &&
            (force || i != currentSlice)) {
            //            categoryText.innerHTML = slices[i].text;
            currentSlice = i;
            break;
        }
    }
}

var slices = new Array();
var currentSlice = -1;

function getAbbreviation(originalText) {
    for (var i = 0; i < abbreviations.length; ++i) {
        if (originalText == abbreviations[i].text) {
            return abbreviations[i].abbreviation;
        }
    }
    return originalText;
}

var sliceColors = new Array();

function createSliceColors(numSlices) {
    if (IO_MODE) {
        for (var index = 0; index < numSlices; index++) {
            sliceColors[index] = logoColors[index % logoColors.length];
        }
    } else {
        var cyanR = 0x74;
        var cyanG = 0xa1;
        var cyanB = 0xca;
        var pinkR = 0xab;
        var pinkG = 0x3f;
        var pinkB = 0x83;
        var purpleR = 0x86;
        var purpleG = 0x6b;
        var purpleB = 0x9d;
        var hsvCyan = ColorUtils.rgbToHsv(cyanR, cyanG, cyanB);
        var hsvPink = ColorUtils.rgbToHsv(pinkR, pinkG, pinkB);
        var hsvPurple = ColorUtils.rgbToHsv(purpleR, purpleG, purpleB);
        var useCyan = true;
        for (var index = 0; index < numSlices; index++) {
            var hsvSaturation = 1;
            var color;
            var rgbColor;
            switch (index % 3) {
                case 0:
                    color = hsvCyan;
                    rgbColor = "#74a1ca";
                    break;
                case 1:
                    color = hsvPink;
                    rgbColor = "#ab3f83";
                    break;
                case 2:
                    color = hsvPurple;
                    rgbColor = "#866b9d";
                    break;
            }
            var hsvColor = ColorUtils.hsvToRgb(color[0], hsvSaturation, color[2]);
            var red = Math.floor(hsvColor[0]);
            var green = Math.floor(hsvColor[1]);
            var blue = Math.floor(hsvColor[2]);
            sliceColors[index] = rgbColor;
        }
    }
}

function createWheel() {
    log("createWheel()");
    setInputVisibility(false);

    if (!hubValid) {
        var hubDiamter = 2 * wheelRadius * hubFraction;
        speechlessFont = getFontSize(mainCtx, "speechless", "GothamRnd-Medium", hubDiamter * (1 - 2 * paddingFraction), 0);
        speechlessSize = getStringWidth(mainCtx, "speechless", speechlessFont);
        speechlessHeight = 10;
        hubValid = true;
    }

    slices = new Array();
    curentSlice = -1;
    ctx = offscreenCtx;
    ctx.font = "20pt GothamRnd-Medium";
    var categories = new Array();
    var maxCategoryLength = 0;
    var largestCategoryString = "";

    for (var index = 0; index < mCategories.length; ++index) {
        var category = mCategories[index].text;
        var abbreviation = mCategories[index].abbreviation;
        slices[index] = new Object();
        slices[index].text = category;
        slices[index].abbreviation = abbreviation;
        if (abbreviation.length > largestCategoryString.length) {
            largestCategoryString = abbreviation;
        }
    }
    ctx.fillStyle = "#00FF00";
    var r = 50;
    var i;
    var catIndex = 0;
    //    numCategories = categoriesList.rows.length;
    var numSlices = numCategories;
    if (numSlices < MIN_SLICES) {
        var multiplier = Math.ceil(MIN_SLICES / numSlices);
        numSlices *= multiplier;
    }
    var increment = (2 * Math.PI / numSlices);
    ctx.font = getFontSize(ctx, largestCategoryString, "GothamRnd-Light",
        wheelRadius * (1 - hubFraction) - wheelRadius * 2 * paddingFraction, 0);
    metrics = ctx.measureText("M");
    textHeight = metrics.width;
    createSliceColors(numSlices);
    for (var index = 0, i = 0; index < numSlices; i += increment, index++) {
        slices[index].startAngle = i / Math.PI * 180;
        slices[index].endAngle = (i + increment) / Math.PI * 180;
        var x1 = wheelCenterX + Math.cos(i) * r;
        var y1 = wheelCenterY + Math.sin(i) * r;
        var x2 = wheelCenterX + Math.cos(i + increment) * r;
        var y2 = wheelCenterY + Math.sin(i + increment) * r;
        var color = sliceColors[index];
        if (index == (numSlices - 1) && ((numSlices % 3) == 1)) {
            color = sliceColors[1];
        }
        ctx.fillStyle = color;
        ctx.strokeStyle = silver;
        ctx.beginPath();
        ctx.lineTo(x1, y1);
        ctx.arc(wheelCenterX, wheelCenterY, wheelRadius, i, i + increment);
        ctx.lineTo(wheelCenterX, wheelCenterY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#FFFFFF";
        ctx.save();
        ctx.translate(wheelCenterX, wheelCenterY);
        var metrics = ctx.measureText(slices[catIndex].abbreviation);
        var textWidth = metrics.width;
        ctx.rotate(i + increment / 2);
        ctx.translate(-wheelCenterX + wheelRadius - textWidth - (paddingFraction * wheelRadius), -wheelCenterY + textHeight / 2);
        ctx.fillText(slices[catIndex].abbreviation, wheelCenterX, wheelCenterY);
        catIndex = (catIndex + 1) % numCategories;
        ctx.restore();
    }
    ctx.fillStyle = hubColor;
    ctx.fillStyle = white;
    ctx.beginPath();
    ctx.arc(wheelCenterX, wheelCenterY, wheelRadius * hubFraction, 0, 360, false);
    ctx.closePath();
    ctx.fill();

    var numPegs = 2 * numSlices;
    pegDistance = 360 / numPegs;
    ctx.fillStyle = silver;
    for (angle = 0, pegIndex = 0; pegIndex < numPegs; angle += pegDistance, pegIndex++) {
        ctx.beginPath();
        ctx.arc(wheelCenterX + wheelRadius - 4, wheelCenterY, 4, 0, 2 * Math.PI);
        ctx.fill();
        radians = pegDistance * Math.PI / 180;
        ctx.translate(wheelCenterX, wheelCenterY);
        ctx.rotate(radians);
        ctx.translate(-wheelCenterX, -wheelCenterY);
    }

    mPrevAngle = -1;
    scheduleAnimation();

    wheelValid = true;

}

function createCategoryInner(categoryText, abbreviation) {

    var categories = document.getElementById("categoryListForm");
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = abbreviation;
    checkbox.value = categoryText;
    log("creating checkbox with value, name = " + checkbox.value + ", " + checkbox.name);
    checkbox.id = categoryText;
    checkbox.checked = true;
    var label = document.createElement("label")
    label.htmlFor = categoryText;
    label.appendChild(document.createTextNode(categoryText));
    categories.appendChild(checkbox);
    categories.appendChild(label);
    categories.appendChild(document.createElement("br"));

    document.getElementById("newCategory").value = "";
    document.getElementById("newCategoryAbbreviation").value = "";

}

function selectCategory(selectedItem) {
    createCategoryInner(selectedItem.value);
    //    var value = selectedItem.value;
    //    var categoryInputField = document.getElementById("newCategory");
    //    categoryInputField.value = selectedItem.value;
    //    
}

var formVisible = true;

function setInputVisibility(visible) {
    if (visible == formVisible) {
        return;
    }
    var categoryForm = document.getElementById("categoryForm");
    categoryForm.style.display = formVisible ? "none" : "inline";
    var canvasTable = document.getElementById("canvastable");
    formVisible = !formVisible;
}

function toggleInputVisibility() {
    var categoryForm = document.getElementById("categoryForm");
    categoryForm.style.display = formVisible ? "none" : "inline";
    var canvasTable = document.getElementById("canvastable");
    formVisible = !formVisible;
}

function deleteRow(row) {
    var categories = document.getElementById("categoriesList");
    categories.deleteRow(row.rowIndex);
}

function createCategory() {
    var newCategoryText = document.getElementById("newCategory").value;
    var abbreviation = document.getElementById("newCategoryAbbreviation").value;
    createCategoryInner(newCategoryText, abbreviation);
}

// Text utilities
function setFontSizeInner(context, textString, fontName, maxWidth, maxHeight, lowerBound, upperBound) {
    var boundDiff = upperBound - lowerBound;
    if (boundDiff < 2) {
        return;
    }
    var midPoint = lowerBound + Math.floor(boundDiff / 2);
    context.font = midPoint + "pt " + fontName;
    var metrics = context.measureText(textString);
    var textWidth = metrics.width;
    if (textWidth < maxWidth) {
        return setFontSizeInner(context, textString, fontName, maxWidth, maxHeight, midPoint, upperBound);
    } else {
        return setFontSizeInner(context, textString, fontName, maxWidth, maxHeight, lowerBound, midPoint);
    }
}

function getFontSize(context, textString, fontName, maxWidth, maxHeight) {
    var oldFont = context.font;
    setFontSizeInner(context, textString, fontName, maxWidth, maxHeight, 0, 200);
    var newFont = context.font;
    context.font = oldFont;
    return newFont;
}

function getStringWidth(context, textString, font) {
    var oldFont = context.font;
    context.font = font;
    var metrics = context.measureText(textString);
    var textWidth = metrics.width;
    context.font = oldFont;
    return textWidth;
}

function log(message) {
    if (DEBUG) {
        console.log(message);
    }
}