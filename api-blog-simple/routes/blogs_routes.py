from flask import Blueprint, jsonify, request, Flask
from config import Config
from werkzeug.utils import secure_filename
from extensions import db
from PIL import Image
import os
from models import Blog, User

blogs_routes = Flask(__name__)
blog_bp = Blueprint('blog_bp', __name__)
blogs_routes.config.from_object(Config)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

@blog_bp.route('/blogs/<int:id>', methods = ['GET'])
def getBlogsByUserId(id):
    blogs = Blog.query.filter_by(user_id=id).order_by(Blog.id.desc()).all()
    if blogs:
        blogs_to_dict = [blog.to_dict() for blog in blogs]
        return jsonify({'blogs':blogs_to_dict}), 200
    return jsonify({"message": "Este usuario no tiene blogs"}), 404

@blog_bp.route('/home/<int:id>', methods = ['GET'])
def getUsersBlogs(id):
    blogs = Blog.query.filter(Blog.user_id != id).order_by(Blog.id.desc()).all()
    if blogs:
        blogs_to_dict = []
        for blog in blogs:
            user = User.query.get(blog.user_id)
            blog_dict = blog.to_dict()
            if user:
                blog_dict['user'] = user.to_dict()
            blogs_to_dict.append(blog_dict)
        return jsonify({'blogs': blogs_to_dict}), 200
    return jsonify({"message": "Este usuario no tiene blogs"}), 404

@blog_bp.route('/blogs', methods = ['POST'])
def createBlog():
    if request.form is None:
        return jsonify({ "message": "Error en el formato JSON" })

    data = request.form
    user_id = data.get('user_id')
    title = data.get('title')
    description = data.get('description')

    if not user_id or not title:
        return jsonify({ "message": 'Error, falta algun campo' }), 401

    try:
        db.session.begin()
        blog = Blog()
        blog.user_id = user_id
        blog.title = title
        blog.description = description

        if 'image' in request.files:
            file = request.files['image']
            if file.filename == '':
                return jsonify({"message": 'No selected file'}), 400
            if file and allowed_file(file.filename):
                from datetime import datetime
                filename = secure_filename(file.filename)
                timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
                filename_with_time = f"{timestamp}_{os.path.splitext(filename)[0]}.webp"
                filepath = os.path.join(blogs_routes.config['UPLOAD_FOLDER'], filename_with_time)
                
                image = Image.open(file.stream)
                image.save(filepath, 'webp')
                blog.picture_url = f"{blogs_routes.config['UPLOAD_FOLDER']}/{filename_with_time}"
            else:
                return({"message": "Tipo de archivo incorrecto"}), 400
        db.session.add(blog)
        db.session.commit()
    
        return jsonify({ "message": "Blog creado exitosamente" }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@blog_bp.route('/blogs', methods=['DELETE'])
def deleteBlog():
    try:
        if request.json is None:
            return jsonify({'error': 'Invalid JSON data'}), 400
        id = request.json['id']
        
        blog = Blog.query.get(id)
        if blog:
            db.session.delete(blog)
            db.session.commit()
                
            return jsonify({'message': 'Blog eliminado correctamente'}), 200
        return jsonify({'message': 'Blog no encontrado'})
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error al eliminar el blog", "error": str(e)}), 500

@blog_bp.route('/blogs', methods=['PUT'])
def editBlog():
    try:
        if request.form is None:
            return jsonify({'error': 'Invalid FORM data'}), 400
        data = request.form
        id = data.get('id')
        if not id:
            return jsonify({'error': 'Blog ID is required'}), 400
        title = data.get('title')
        description = data.get('description')
        blog = Blog.query.get(id)
        
        if blog:
            if title:
                blog.title = title
            if description:
                blog.description = description
                
            if 'image' in request.files:
                file = request.files['image']
                if file.filename == '':
                    return jsonify({"message": 'No selected file'}), 400
                if file and allowed_file(file.filename):
                    from datetime import datetime
                    filename = secure_filename(file.filename)
                    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
                    filename_with_time = f"{timestamp}_{os.path.splitext(filename)[0]}.webp"
                    filepath = os.path.join(blogs_routes.config['UPLOAD_FOLDER'], filename_with_time)
                    
                    image = Image.open(file.stream)
                    image.save(filepath, 'webp')
                    blog.picture_url = f"{blogs_routes.config['UPLOAD_FOLDER']}/{filename_with_time}"
                else:
                    return jsonify({"message": "Tipo de archivo incorrecto"}), 400
            db.session.commit()
            return jsonify({'message': 'Blog actualizado correctamente'}), 200
        return jsonify({'message': 'Blog no encontrado'}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error al actualizar el blog", "error": str(e)}), 500
    
def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS