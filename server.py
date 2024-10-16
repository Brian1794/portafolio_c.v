from flask import Flask, request, jsonify, send_from_directory
import json
import os

app = Flask(__name__)

# Ruta al archivo JSON de proyectos
PROYECTOS_FILE = 'datos.json'

# Cargar proyectos desde el archivo JSON
def cargar_proyectos():
    if os.path.exists(PROYECTOS_FILE):
        with open(PROYECTOS_FILE, 'r') as file:
            return json.load(file)
    return []

# Guardar proyectos en el archivo JSON
def guardar_proyectos(proyectos):
    with open(PROYECTOS_FILE, 'w') as file:
        json.dump(proyectos, file)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

@app.route('/proyectos', methods=['GET', 'POST'])
def manejar_proyectos():
    if request.method == 'GET':
        return jsonify(cargar_proyectos())
    elif request.method == 'POST':
        nuevo_proyecto = request.json
        proyectos = cargar_proyectos()
        proyectos.append(nuevo_proyecto)
        guardar_proyectos(proyectos)
        return jsonify({"message": "Proyecto agregado con éxito"}), 201

@app.route('/datos_personales')
def datos_personales():
    return jsonify({
        "nombre": "Brian Gerardo Alfonso Rodriguez",
        "edad": "30",
        "profesion": "Análista en Desarrollo de Software",
        "email": "alfonsobrian7@email.com",
        "imagen": "/img/foto.png",  # Asegúrate de que esta ruta sea correcta
        "tecnologias": ["HTML", "CSS", "JavaScript", "Python"]
    })

# Añade esta ruta para servir archivos estáticos si no la tienes ya
@app.route('/img/<path:path>')
def send_img(path):
    return send_from_directory('img', path)

if __name__ == '__main__':
    app.run(debug=True)
