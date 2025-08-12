from flask import Blueprint, Flask, request, send_from_directory, current_app 
from flask.json import jsonify
from config import Config
from werkzeug.utils import secure_filename
import os
from PIL import Image

uploads_routes = Flask(__name__)
uploads_bp = Blueprint('uploads_bp', __name__)
uploads_routes.config.from_object(Config)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@uploads_bp.route('/uploads/images/<filename>')
def uploaded_file(filename):
    return send_from_directory(
        os.path.join(current_app.root_path, 'uploads', 'images'),
        filename
    )

@uploads_bp.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"message": 'No file part'}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({"message": 'No selected file'}), 400
    if file and allowed_file(file.filename):
        from datetime import datetime
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        filename_with_time = f"{timestamp}_{os.path.splitext(filename)[0]}.webp"
        filepath = os.path.join(uploads_routes.config['UPLOAD_FOLDER'], filename_with_time)
        
        image = Image.open(file.stream)
        image.save(filepath, 'webp')
        
        return jsonify({"message": f'Image saved to {filepath}'})
    return jsonify({"message": 'Error uploading image'}), 500