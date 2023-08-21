// 获取HTML元素
var ball = document.querySelector('.ball');
var stiffnessSlider = document.querySelector('.stiffness input');
var stiffnessDisplay = document.querySelector('.stiffness span');
var dampingSlider = document.querySelector('.damping input');
var dampingDisplay = document.querySelector('.damping span');
var refreshButton = document.querySelector('.button');
var tensionSlider = document.querySelector('.tension input');
var tensionDisplay = document.querySelector('.tension span');

var frictionSlider = document.querySelector('.friction input');
var frictionDisplay = document.querySelector('.friction span');




var startTime = null;




// 初始物理参数
var k = 150;  // stiffness
var m = 1;    // mass
var dampingRatio = 0.55;
var damping = 2 * Math.sqrt(m * k) * dampingRatio;  // 初始化damping值
dampingSlider.value = dampingRatio * 10;
dampingDisplay.textContent = dampingRatio.toFixed(1);

var x = 0;    // initial position
var targetX = 450;
var v = 0;    // initial velocity
var dt = 1 / 60; // time step, assuming 60fps

// Slider event listeners
stiffnessSlider.addEventListener('input', function() {
    k = parseFloat(stiffnessSlider.value);
    stiffnessDisplay.textContent = k;
    // x = 0;  // reset position
    // v = 0;  // reset velocity
    updateDamping();
});

dampingSlider.addEventListener('input', function() {
    dampingRatio = parseFloat(dampingSlider.value) / 10;
    dampingDisplay.textContent = dampingRatio.toFixed(1);
    // x = 0;  // reset position
    // v = 0;  // reset velocity
    updateDamping();
});

function updateDamping() {
    var criticalDamping = 2 * Math.sqrt(m * k);
    damping = criticalDamping * dampingRatio;
}

stiffnessSlider.addEventListener('input', function() {
    k = parseFloat(stiffnessSlider.value);
    stiffnessDisplay.textContent = k;

    // 更新 Tension 的值
    tensionSlider.value = k;
    tensionDisplay.textContent = k;

    x = 0;  // reset position
    v = 0;  // reset velocity
    updateDamping();
});


tensionSlider.addEventListener('input', function() {
    var tensionValue = parseFloat(tensionSlider.value);
    tensionDisplay.textContent = tensionValue;

    // 由于 Stiffness 和 Tension 直接关联，所以我们可以直接设置 Stiffness 的值为 Tension 的值
    stiffnessSlider.value = tensionValue;
    stiffnessDisplay.textContent = tensionValue;

    // 这里可以重置动画的参数，如果需要的话
    // x = 0;  // reset position
    // v = 0;  // reset velocity
});


dampingSlider.addEventListener('input', function() {
    dampingRatio = parseFloat(dampingSlider.value) / 10;
    dampingDisplay.textContent = dampingRatio.toFixed(1);

    // 使用上述关系更新friction
    var a = 15 / 0.433;
    var frictionValue = a * dampingRatio;
    frictionSlider.value = frictionValue;
    frictionDisplay.textContent = frictionValue.toFixed(1);

    // x = 0;  // reset position
    // v = 0;  // reset velocity
    updateDamping();
});

frictionSlider.addEventListener('input', function() {
    var frictionValue = parseFloat(frictionSlider.value);
    frictionDisplay.textContent = frictionValue.toFixed(1);

    // 使用上述关系反向计算damping ratio
    var a = 15 / 0.433;
    var dampingValue = frictionValue / a;
    dampingSlider.value = dampingValue * 10;  // 乘以10是因为您的滑块步进是0.1
    dampingDisplay.textContent = dampingValue.toFixed(3);  // 更高的精度，因为数值通常较小

    // x = 0;  // reset position
    // v = 0;  // reset velocity
});




function animate(){
    requestAnimationFrame(animate);


    if (startTime === null) {
        startTime = Date.now();
    }

    var dx = x - targetX;
    var Fspring = -k * dx;
    var Fdamping = -damping * v;
    var a = (Fspring + Fdamping) / m;

    v += a * dt;
    x += v * dt;


    if (Math.abs(x - targetX) < 5 && startTime !== null) {
        var elapsedTime = Date.now() - startTime;
        var durationElement = document.getElementById("durationText");
        durationElement.textContent = "时长：" + (elapsedTime / 1000).toFixed(2) + "秒";
        startTime = null; // 重置开始时间
    }

    ball.style.left = x + 'px';
    console.log("位置:", x, "速度:", v);
}

animate();

refreshButton.addEventListener('click', function() {
    x = 0;  // 重置位置
    v = 0;  // 重置速度
});
