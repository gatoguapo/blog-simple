from flask import Blueprint, jsonify, request, Flask
from sqlalchemy import false, true
from sqlalchemy.exc import IntegrityError
from extensions import db
from models import Follower


followers_routes = Flask(__name__)
follower_bp = Blueprint('follower_bp', __name__)

@follower_bp.route('/followers/<int:id>', methods=['GET'])
def getFollowers(id):
    followers = Follower.query.filter_by(user_id=id).order_by(Follower.user_id.desc()).all()
    if followers:
        followers_to_dict = [follower.to_dict() for follower in followers]
        return jsonify(followers_to_dict), 200
    return jsonify({"message": "Error al recuperar followers"}), 400

@follower_bp.route('/followers', methods=['PUT'])
def createFollow():
    if request.json is None:
        return jsonify({'message': 'Invalid JSON Data'}), 400
    data = request.get_json()
    user_id = data['user_id']
    follower_id = data['follower_id']
    try:
        follower = Follower()
        follower.user_id = user_id
        follower.follower_id = follower_id

        db.session.add(follower)
        db.session.commit()

        return jsonify({ "message": 'Usuario seguido exitosamente' }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@follower_bp.route('/search_follower', methods=['GET'])
def searchFollower():
    user_id = request.args.get('user_id', type=int)
    follower_id = request.args.get('follower_id', type=int)

    if user_id is None or follower_id is None:
        return jsonify({'message': 'Faltan user_id o follower_id en los parámetros de la URL'}), 400

    follower = Follower.query.filter_by(
        user_id=user_id,
        follower_id=follower_id
    ).first()

    if follower:
        return jsonify({'follow': True}), 200
    else:
        return jsonify({'follow': False}), 200
