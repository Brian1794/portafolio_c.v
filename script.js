document.addEventListener('DOMContentLoaded', () => {
    const listaProyectos = document.getElementById('lista-proyectos');
    const formularioProyecto = document.getElementById('formulario-proyecto');
    const datosPersonales = document.getElementById('datos-personales');

    // Configuración de Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('background').appendChild(renderer.domElement);

    // Crear partículas
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 10000; i++) {
        vertices.push(
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000
        );
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({ color: 0x888888, size: 3 });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    camera.position.z = 1000;

    function animate() {
        requestAnimationFrame(animate);
        points.rotation.x += 0.001;
        points.rotation.y += 0.002;
        renderer.render(scene, camera);
    }
    animate();

    // Cargar datos personales
    fetch('/datos_personales')
        .then(response => response.json())
        .then(data => {
            const tecnologias = data.tecnologias.join(', ');
            datosPersonales.innerHTML = `
                <div class="card">
                    <img src="${data.imagen}" alt="Mi foto" id="foto-perfil">
                    <h2>Datos Básicos</h2>
                    <ul>
                        <li><i class="fas fa-user"></i> <strong>Nombre:</strong> ${data.nombre}</li>
                        <li><i class="fas fa-calendar-alt"></i> <strong>Edad:</strong> ${data.edad}</li>
                        <li><i class="fas fa-laptop-code"></i> <strong>Profesión:</strong> ${data.profesion}</li>
                        <li><i class="fas fa-envelope"></i> <strong>Email:</strong> ${data.email}</li>
                        <li><i class="fas fa-cogs"></i> <strong>Tecnologías:</strong> ${tecnologias}</li>
                    </ul>
                </div>
            `;
        });

    // Cargar proyectos existentes
    fetch('/proyectos')
        .then(response => response.json())
        .then(proyectos => {
            proyectos.forEach(proyecto => {
                const elementoProyecto = crearProyecto(proyecto.nombre, proyecto.descripcion, proyecto.tecnologias, proyecto.imagen);
                listaProyectos.appendChild(elementoProyecto);
            });
        });

    // Manejar el formulario
    formularioProyecto.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre-proyecto').value;
        const descripcion = document.getElementById('descripcion-proyecto').value;
        const tecnologias = document.getElementById('tecnologias-proyecto').value;
        const imagen = document.getElementById('imagen-proyecto').files[0];

        if (nombre && descripcion && tecnologias && imagen) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const nuevoProyecto = {
                    nombre: nombre,
                    descripcion: descripcion,
                    tecnologias: tecnologias,
                    imagen: event.target.result
                };

                fetch('/proyectos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(nuevoProyecto),
                })
                .then(response => response.json())
                .then(data => {
                    const proyecto = crearProyecto(nombre, descripcion, tecnologias, event.target.result);
                    listaProyectos.appendChild(proyecto);
                    formularioProyecto.reset();
                });
            };
            reader.readAsDataURL(imagen);
        }
    });

    function crearProyecto(nombre, descripcion, tecnologias, imagenSrc) {
        const proyecto = document.createElement('div');
        proyecto.className = 'proyecto';
        proyecto.innerHTML = `
            <h3>${nombre}</h3>
            <img src="${imagenSrc}" alt="${nombre}">
            <p><strong>Descripción:</strong> ${descripcion}</p>
            <p><strong>Tecnologías:</strong> ${tecnologias}</p>
        `;
        return proyecto;
    }

    // Ajustar el tamaño del renderizador cuando se redimensiona la ventana
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
