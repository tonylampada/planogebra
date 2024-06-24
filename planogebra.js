let scene, camera, renderer;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);

    camera.position.z = 5;
    controls.update();

    animate();
    loadObjects()
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

const draw =  {
    cube(parts) {
        const geometry = new THREE.BoxGeometry(parseFloat(parts[4]), parseFloat(parts[5]), parseFloat(parts[6]));
        const material = new THREE.MeshBasicMaterial({ color: parts[7], transparent: true, opacity: 0.5 });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
        return cube
    },
    sphere(parts) {
        const geometry = new THREE.SphereGeometry(parseFloat(parts[4]), 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: parts[5], transparent: true, opacity: 0.5 });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
        return sphere
    },
    point(parts){
        const geometry = new THREE.SphereGeometry(0.1, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: parts[4] });
        const point = new THREE.Mesh(geometry, material);
        point.position.set(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
        return point
    },
    line(parts){
        const material = new THREE.LineBasicMaterial({ color: parts[7] });
        const points = [];
        points.push(new THREE.Vector3(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])));
        points.push(new THREE.Vector3(parseFloat(parts[4]), parseFloat(parts[5]), parseFloat(parts[6])));
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        return line
    },
    circle(parts){
        const center = new THREE.Vector3(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
        const pointOnNormal = new THREE.Vector3(parseFloat(parts[4]), parseFloat(parts[5]), parseFloat(parts[6]));
        // const radius = center.distanceTo(pointOnNormal);
        const radius = parseFloat(parts[7])

        const circleGeometry = new THREE.CircleGeometry(radius, 64);
        const material = new THREE.MeshBasicMaterial({ color: parts[8], side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
        const circle = new THREE.Mesh(circleGeometry, material);

        // Calculate the normal
        const normal = new THREE.Vector3().subVectors(pointOnNormal, center).normalize();
        const up = new THREE.Vector3(0, 0, 1);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(up, normal);
        circle.applyQuaternion(quaternion);

        circle.position.set(center.x, center.y, center.z);
        return circle
    }
}

function loadObjects() {
    while (scene.children.length > 0) { 
        scene.remove(scene.children[0]); 
    }

    const input = document.getElementById("objectInput").value;
    const lines = input.split('\n').filter(l => !!l.trim() && !l.trim().startsWith('#'));
    lines.forEach(line => {
        const parts = line.split(/\s+/);
        const type = parts[0];
        try{
            scene.add(draw[type](parts))
        } catch(e){
            alert(e);
        }
    });
}

document.addEventListener("DOMContentLoaded", init);