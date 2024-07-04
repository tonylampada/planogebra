let scene, camera, renderer, controls;

class V {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(vector) {
        return new V(this.x + vector.x, this.y + vector.y, this.z + vector.z);
    }

    sub(vector) {
        return new V(this.x - vector.x, this.y - vector.y, this.z - vector.z);
    }

    xx(scalar) {
        return new V(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    module() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
}

function v(x,y, z){
    return new V(x, y, z);
}

function init() {
    scene = new THREE.Scene();
    // camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 160000);
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 160000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // Enable shadow maps in the renderer
    document.body.appendChild(renderer.domElement);

    // const controls = new THREE.OrbitControls(camera, renderer.domElement);
    // const controls = new THREE.FirstPersonControls(camera, renderer.domElement);
    // const controls = new THREE.FlyControls(camera, renderer.domElement);
    // controls = new THREE.TrackballControls(camera, renderer.domElement);

    camera.position.z = 5;
    // controls.update();

    document.addEventListener('mousedown', onMouseDown, false);
    document.addEventListener('wheel', onWheel, false);  // Add this line

    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();  // Prevent the context menu from appearing
    }, false);

    animate();
    loadObjects();
    pollCameraState();
    // document.addEventListener('keydown', onDocumentKeyDown, false);
    var objectInput = document.getElementById("objectInput");
    objectInput.addEventListener("keydown", function(event) {
        event.stopPropagation(); // This stops the keydown from propagating to the document level
    });
}


//dragging
let isDragging = false;
let isMoving = false;
let previousMousePosition = {
    x: 0,
    y: 0
};

function onMouseDown(e) {
    if (e.target.tagName === 'TEXTAREA') return; // Ignore mouse down events on textarea elements
    e.preventDefault();
    if (e.button === 0) {  // Left mouse button
        isDragging = true;
    } else if (e.button === 2) {  // Right mouse button
        isMoving = true;
    }
    previousMousePosition.x = e.clientX;
    previousMousePosition.y = e.clientY;
    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('mouseup', onMouseUp, false);
}

function onMouseMove(e) {
    if (isDragging) {
        const deltaMove = {
            x: e.clientX - previousMousePosition.x,
            y: e.clientY - previousMousePosition.y
        };

        const rotateAngleX = (deltaMove.x * Math.PI) / 180;
        const rotateAngleY = (deltaMove.y * Math.PI) / 180;

        camera.rotation.y += rotateAngleX;
        camera.rotation.x += rotateAngleY;
    } else if (isMoving) {
        const deltaMove = {
            x: e.clientX - previousMousePosition.x,
            y: e.clientY - previousMousePosition.y
        };

        // Get camera's forward and right vectors
        var forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        forward.y = 0; // Ignore any vertical component
        forward.normalize();
        var right = new THREE.Vector3();
        right.crossVectors(camera.up, forward).normalize();

        // Move camera based on the right and forward vectors
        camera.position.addScaledVector(right, -deltaMove.x * 0.01);
        camera.position.addScaledVector(new THREE.Vector3(0, 1, 0), deltaMove.y * 0.01); // Move up/down globally, not relative to camera tilt
    }

    previousMousePosition = {
        x: e.clientX,
        y: e.clientY
    };
}

function onMouseUp(e) {
    isDragging = false;
    isMoving = false;
    document.removeEventListener('mousemove', onMouseMove, false);
    document.removeEventListener('mouseup', onMouseUp, false);
}

function onWheel(e) {
    if (e.target.tagName === 'TEXTAREA') return; // Ignore mouse down events on textarea elements
    e.preventDefault();
    const delta = e.deltaY;  // Get the scroll delta
    const moveSpeed = 0.05;  // Define how fast the camera moves on scroll

    var forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.normalize();

    if (delta < 0) {
        // Scrolling up, move forward
        camera.position.addScaledVector(forward, moveSpeed);
    } else {
        // Scrolling down, move backward
        camera.position.addScaledVector(forward, -moveSpeed);
    }
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
///dragging

function pollCameraState(){
    setInterval(() => {
        const cameraState = describeCameraState();
        document.getElementById("topRightLabel").innerText = cameraState;
    }, 300);
}

function describeCameraState(){
    return `camera P(${camera.position.x.toFixed(1)}, ${camera.position.y.toFixed(1)}, ${camera.position.z.toFixed(1)}) R(${(camera.rotation.x * (180 / Math.PI)).toFixed(1)}, ${(camera.rotation.y * (180 / Math.PI)).toFixed(1)}, ${(camera.rotation.z * (180 / Math.PI)).toFixed(1)})`
}


function onDocumentKeyDown(event) {
    var keyCode = event.which;
    var moveSpeed = 0.1;
    var rotateSpeed = Math.PI / 180 * 1; // 1 degree in radians

    var forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    var right = new THREE.Vector3();
    right.crossVectors(camera.up, forward).normalize();

    // WSAD for movement
    if (keyCode == 87) { // W key
        camera.position.addScaledVector(forward, moveSpeed);
    } else if (keyCode == 83) { // S key
        camera.position.addScaledVector(forward, -moveSpeed);
    } else if (keyCode == 65) { // A key
        camera.position.addScaledVector(right, moveSpeed);
    } else if (keyCode == 68) { // D key
        camera.position.addScaledVector(right, -moveSpeed);
    }

    // Arrow keys for pitch and yaw
    if (keyCode == 37) { // left arrow
        camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), rotateSpeed);
    } else if (keyCode == 39) { // right arrow
        camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -rotateSpeed);
    } else if (keyCode == 38) { // up arrow
        camera.rotateOnWorldAxis(right, rotateSpeed);
    } else if (keyCode == 40) { // down arrow
        camera.rotateOnWorldAxis(right, -rotateSpeed);
    }
    console.log("camera", "position", camera.position, "rotation", camera.rotation)
}

function animate() {
    requestAnimationFrame(animate);
    // controls.update();  // Update the controls on each frame
    renderer.render(scene, camera);
}

const draw =  {
    cube(p1, p2, color, opacity) {
        const geometry = new THREE.BoxGeometry(p2.x, p2.y, p2.z);
        const material = new THREE.MeshPhongMaterial({ color, transparent: true, opacity});
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(p1.x, p1.y, p1.z);
        scene.add(cube)
    },
    sphere(c, r, color, opacity) {
        const geometry = new THREE.SphereGeometry(r, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(c.x, c.y, c.z);
        scene.add(sphere)
    },
    point(p, color){
        const geometry = new THREE.SphereGeometry(0.1, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color });
        const point = new THREE.Mesh(geometry, material);
        point.position.set(p.x, p.y, p.z);
        scene.add(point)
    },
    line(p1, p2, color){
        const material = new THREE.LineBasicMaterial({ color });
        const points = [];
        points.push(new THREE.Vector3(p1.x, p1.y, p1.z));
        points.push(new THREE.Vector3(p2.x, p2.y, p2.z));
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        scene.add(line)
    },
    circle(c, p, r, color, opacity){
        const pointOnNormal = new THREE.Vector3(p.x, p.y, p.z);
        // const radius = center.distanceTo(pointOnNormal);

        const circleGeometry = new THREE.CircleGeometry(r, 64);
        const material = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, transparent: true, opacity });
        const circle = new THREE.Mesh(circleGeometry, material);

        // Calculate the normal
        const normal = new THREE.Vector3().subVectors(pointOnNormal, c).normalize();
        const up = new THREE.Vector3(0, 0, 1);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(up, normal);
        circle.applyQuaternion(quaternion);
        circle.position.set(c.x, c.y, c.z);
        scene.add(circle)
    },
    cone(p1, p2, color, opacity) {
        const geometry = new THREE.ConeGeometry(p2.x, p2.y, 32);
        const material = new THREE.MeshPhongMaterial({ color, transparent: true, opacity });
        const cone = new THREE.Mesh(geometry, material);
        cone.position.set(p1.x, p1.y, p1.z);
        scene.add(cone)
    },
    cylinder(c, p, r1, r2, h, color, opacity) {  // Added parameter p for orientation
        const geometry = new THREE.CylinderGeometry(r2, r1, h, 32);
        const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity });
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.position.set(c.x, c.y, c.z);
        // Set the orientation of the cylinder
        const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(p.x, p.y, p.z).normalize());
        cylinder.applyQuaternion(quaternion);
        scene.add(cylinder);
    },
    camera(p, r){
        camera.position.set(p.x, p.y, p.z);
        camera.rotation.set(r.x, r.y, r.z);
    }
}

function loadObjects() {
    while (scene.children.length > 0) { 
        scene.remove(scene.children[0]); 
    }

    const input = document.getElementById("objectInput").value;
    eval(input)
    // const lines = input.split('\n').filter(l => !!l.trim() && !l.trim().startsWith('#'));
    // lines.forEach(line => {
    //     const parts = line.trim().split(/\s+/);
    //     const type = parts[0];
    //     try {
    //         draw[type](parts);
    //     } catch(e){
    //         alert(e);
    //     }
    // });
}

document.addEventListener("DOMContentLoaded", init);