from flask import Blueprint, jsonify, request, Flask
from sqlalchemy.exc import IntegrityError
from extensions import db
from models import User
from werkzeug.utils import secure_filename
from config import Config
from PIL import Image
import os

users_routes = Flask(__name__)
user_bp = Blueprint('user_bp', __name__)
users_routes.config.from_object(Config)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

@user_bp.route("/users/<int:id>", methods=['GET'])
def getUser(id):
    user = User.query.get(id)
    if user:
        return user.to_dict(), 201
    return jsonify({"message":"error al recuperar usuario"}), 400

@user_bp.route("/users", methods=['POST'])
def addUser():
    if request.json is None:
        return jsonify({ "message": 'Error, invalid JSON data' }), 400

    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({ "message": 'Error, falta algun campo' }), 401
    try:
        user = User()
        user.username = data['username']
        user.email = data['email']
        user.set_password(password)
        user.picture_url = 'uploads/images/pfpic.jpg'
        user.bgimage_url = 'uploads/images/bgimage.jpg'
    
        db.session.add(user)
        db.session.commit()

        return jsonify({ "message": 'Usuario creado exitosamente' }), 201
    except IntegrityError as e:
        db.session.rollback()
        return jsonify({ "message": 'Ocurrio un error al crear el usuario, intenta con otro usuario o correo' }), 405
    except Exception as e:
        db.session.rollback()
        return jsonify({ "message": 'Ocurrio un error al crear usuario'}), 500

@user_bp.route("/users/picture", methods=['PUT'])
def updateUserPicture():
    if request.form is None:
        return jsonify({ "message": "Error en el formato JSON" })
    data = request.form
    user = User.query.get(data.get("id"))
    if 'image' in request.files:
        file = request.files['image']
        if file.filename == '':
            return jsonify({"message": 'No selected file'}), 400
        if file and allowed_file(file.filename):
            from datetime import datetime
            filename = secure_filename(file.filename)
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            filename_with_time = f"{timestamp}_{os.path.splitext(filename)[0]}.webp"
            filepath = os.path.join(users_routes.config['UPLOAD_FOLDER'], filename_with_time)
            
            image = Image.open(file.stream)
            image.save(filepath, 'webp')
            user.picture_url = f"{users_routes.config['UPLOAD_FOLDER']}/{filename_with_time}"
            db.session.commit()
            return jsonify({"message": "Imagen de usuario actualizada exitosamente"}), 200
        else:
            return jsonify({"message": "Tipo de archivo incorrecto"}), 400
    return jsonify({"message": "Error al recuperar usuario"})

@user_bp.route("/users/bgImage", methods=['PUT'])
def updateUserBGImage():
    if request.form is None:
        return jsonify({ "message": "Error en el formato JSON" })
    data = request.form
    user = User.query.get(data.get("id"))
    if 'image' in request.files:
        file = request.files['image']
        if file.filename == '':
            return jsonify({"message": 'No selected file'}), 400
        if file and allowed_file(file.filename):
            from datetime import datetime
            filename = secure_filename(file.filename)
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            filename_with_time = f"{timestamp}_{os.path.splitext(filename)[0]}.webp"
            filepath = os.path.join(users_routes.config['UPLOAD_FOLDER'], filename_with_time)
            
            image = Image.open(file.stream)
            image.save(filepath, 'webp')
            user.bgimage_url = f"{users_routes.config['UPLOAD_FOLDER']}/{filename_with_time}"
            db.session.commit()
            return jsonify({"message": "Imagen BG de usuario actualizada exitosamente"}), 200
        else:
            return jsonify({"message": "Tipo de archivo incorrecto"}), 400
    return jsonify({"message": "Error al recuperar usuario"})

@user_bp.route('/login', methods=['GET'])
def validateLogin():
    username = request.args.get('username')
    password = request.args.get('password')
    if not username or not password:
        return jsonify({'message': 'Faltan credenciales'}), 400

    try:
        user = User.query.filter_by(username=username).first()
        if user and user.check_password(password):
            return jsonify({
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email
                }
            }), 200
        else:
            return jsonify({'message': 'Nombre de usuario o contraseña incorrectos'}), 401
    except Exception as e:
        return jsonify({'message': 'Error al iniciar sesion'}), 401

def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS