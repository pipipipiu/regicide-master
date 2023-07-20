
function getTop(e) {
    var offset = e.offsetTop;
    if (e.offsetParent != null) offset += getTop(e.offsetParent);
    return offset;
}
function getLeft(e) {
    var offset = e.offsetLeft;
    if (e.offsetParent != null) offset += getLeft(e.offsetParent);
    return offset;
}

function animate(obj, targetX, targetY, speed, callback) {
    obj.style.visibility = 'visible';
    obj.style.transition = 'all 1.2s';
    clearInterval(obj.AnimateTimer);
    obj.AnimateTimer = setInterval(function () {
        var stepX = (targetX - obj.offsetLeft) / speed;
        var stepY = (targetY - obj.offsetTop) / speed;
        stepX = stepX > 0 ? Math.ceil(stepX) : Math.floor(stepX);
        stepY = stepY > 0 ? Math.ceil(stepY) : Math.floor(stepY);
        if (obj.offsetLeft == targetX) {
            callback && callback();
            clearInterval(obj.AnimateTimer);
        }
        obj.style.left = obj.offsetLeft + stepX + 'px';
        obj.style.top = obj.offsetTop + stepY + 'px';
    }, 15);
}





function FullAnimate(obj, left, top, targetObj, mode, speed, idx, cb) {

    var newobj = obj.cloneNode(true);
    if (mode == 2 || mode == 3) {
        newobj.style.transform = 'rotateY(180deg)';
    }

    newobj.style.zIndex = idx + '';
    newobj.style.left = left + 'px';
    newobj.style.top = top + 'px';
    // newobj.style.transform = 'translateZ('+10+'px)';
    newobj.style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2)";
    var animatePart = document.querySelector('.animatePart');
    var idx = animatePart.children.length;
    animatePart.appendChild(newobj);

    newobj.style.visibility = 'visible';
    var targetX = getLeft(targetObj);
    var targetY = getTop(targetObj);

    // targetObj.style.display='none';
    animate(newobj, targetX, targetY, speed, function () {

        newobj.style.transition = 'all 0.4s';
        if (mode == 1 || mode == 2) {
            newobj.style.transform = 'rotateY(180deg)';
            // newobj.style.left=targetX+'px';
            // newobj.style.top=targetY-20+'px';
            setTimeout(function () {

                setTimeout(function () {
                    newobj.parentNode.removeChild(newobj);
                }, 100);

                cb && cb();
            }, 800);
        }
        else if (mode == 3) {
            newobj.style.transform = 'rotateY(0)';
            // newobj.style.left=targetX+'px';
            // newobj.style.top=targetY-20+'px';
            setTimeout(function () {

                setTimeout(function () {
                    newobj.parentNode.removeChild(newobj);
                }, 100);

                cb && cb();
            }, 800);
        }
        else {
            newobj.parentNode.removeChild(newobj);
            cb && cb();
        }
    })

}

function AutoAnimate(obj, left, right, targetObj, mode, speed, idx, cb) {
    return function () {
        FullAnimate(obj, left, right, targetObj, mode, speed, idx, cb);
    }
}