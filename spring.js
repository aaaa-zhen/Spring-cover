// DOM Elements
const ball = document.querySelector('.ball');
const stiffnessSlider = document.querySelector('.stiffness input');
const stiffnessDisplay = document.querySelector('.stiffness span');
const dampingSlider = document.querySelector('.damping input');
const dampingDisplay = document.querySelector('.damping span');
const tensionSlider = document.querySelector('.tension input');
const tensionDisplay = document.querySelector('.tension span');
const frictionSlider = document.querySelector('.friction input');
const frictionDisplay = document.querySelector('.friction span');
const refreshButton = document.querySelector('.button');
const durationElement = document.getElementById("durationText");

// Constants and conversion factors
const MASS = 1;
const TARGET_X = 450;
const MIN_MOVEMENT_THRESHOLD = 0.1;
const FRAME_RATE = 1000 / 60; // 60fps in milliseconds

// State variables
let state = {
    position: 0,
    velocity: 0,
    stiffness: 150,
    dampingRatio: 0.55,
    animationStart: null,
    lastFrameTime: null,
    isAnimating: false
};

// Conversion utilities
const convertProtopieToAndroid = {
    tensionToStiffness: (tension) => tension,
    frictionToDamping: (friction) => (friction * 0.433) / 15
};

const convertAndroidToProtopie = {
    stiffnessToTension: (stiffness) => stiffness,
    dampingToFriction: (damping) => (damping * 15) / 0.433
};

// Update damping based on stiffness and damping ratio
function updateDamping() {
    const criticalDamping = 2 * Math.sqrt(MASS * state.stiffness);
    return criticalDamping * state.dampingRatio;
}

// Reset animation state
function resetAnimation() {
    state.position = 0;
    state.velocity = 0;
    state.animationStart = null;
    state.lastFrameTime = null;
    state.isAnimating = true;
    durationElement.textContent = "时长：";
    requestAnimationFrame(animate);
}

// Event Listeners
stiffnessSlider.addEventListener('input', function() {
    state.stiffness = parseFloat(this.value);
    stiffnessDisplay.textContent = state.stiffness;
    
    // Update Protopie tension
    tensionSlider.value = convertAndroidToProtopie.stiffnessToTension(state.stiffness);
    tensionDisplay.textContent = tensionSlider.value;
    resetAnimation();
});

dampingSlider.addEventListener('input', function() {
    state.dampingRatio = parseFloat(this.value) / 10;
    dampingDisplay.textContent = state.dampingRatio.toFixed(2);
    
    // Update Protopie friction
    const friction = convertAndroidToProtopie.dampingToFriction(state.dampingRatio);
    frictionSlider.value = friction;
    frictionDisplay.textContent = friction.toFixed(1);
    resetAnimation();
});

tensionSlider.addEventListener('input', function() {
    const tension = parseFloat(this.value);
    tensionDisplay.textContent = tension;
    
    // Update Android stiffness
    state.stiffness = convertProtopieToAndroid.tensionToStiffness(tension);
    stiffnessSlider.value = state.stiffness;
    stiffnessDisplay.textContent = state.stiffness;
    resetAnimation();
});

frictionSlider.addEventListener('input', function() {
    const friction = parseFloat(this.value);
    frictionDisplay.textContent = friction.toFixed(1);
    
    // Update Android damping
    state.dampingRatio = convertProtopieToAndroid.frictionToDamping(friction);
    dampingSlider.value = state.dampingRatio * 10;
    dampingDisplay.textContent = state.dampingRatio.toFixed(2);
    resetAnimation();
});

refreshButton.addEventListener('click', resetAnimation);

// Animation function using precise timing
function animate(timestamp) {
    if (!state.isAnimating) return;
    
    if (!state.animationStart) {
        state.animationStart = timestamp;
        state.lastFrameTime = timestamp;
    }
    
    // Calculate actual time step
    const deltaTime = (timestamp - state.lastFrameTime) / 1000;
    state.lastFrameTime = timestamp;
    
    // Spring physics calculations
    const displacement = state.position - TARGET_X;
    const springForce = -state.stiffness * displacement;
    const dampingForce = -updateDamping() * state.velocity;
    const totalForce = springForce + dampingForce;
    const acceleration = totalForce / MASS;
    
    // Update state
    state.velocity += acceleration * deltaTime;
    state.position += state.velocity * deltaTime;
    
    // Update ball position
    ball.style.transform = `translateX(${state.position}px)`;
    
    // Check if animation should stop
    const isMoving = Math.abs(state.velocity) > MIN_MOVEMENT_THRESHOLD ||
                    Math.abs(displacement) > MIN_MOVEMENT_THRESHOLD;
    
    if (!isMoving) {
        state.isAnimating = false;
        const duration = (timestamp - state.animationStart) / 1000;
        durationElement.textContent = `时长：${duration.toFixed(2)}秒`;
    } else {
        requestAnimationFrame(animate);
    }
}

// Initialize values
stiffnessSlider.value = state.stiffness;
stiffnessDisplay.textContent = state.stiffness;
dampingSlider.value = state.dampingRatio * 10;
dampingDisplay.textContent = state.dampingRatio.toFixed(2);
tensionSlider.value = convertAndroidToProtopie.stiffnessToTension(state.stiffness);
tensionDisplay.textContent = tensionSlider.value;
frictionSlider.value = convertAndroidToProtopie.dampingToFriction(state.dampingRatio);
frictionDisplay.textContent = frictionSlider.value;

// Start animation
resetAnimation();
