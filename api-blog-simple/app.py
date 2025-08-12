from flask import Flask
from flask_cors import CORS
from extensions import db, migrate
from config import Config
from dotenv import load_dotenv
from routes.uploads_routes import uploads_bp
from routes.users_routes import user_bp
from routes.blogs_routes import blog_bp
from routes.followers_routes import follower_bp


load_dotenv()
app = Flask(__name__)
CORS(app)
app.config.from_object(Config)

db.init_app(app)
migrate.init_app(app, db)

app.register_blueprint(user_bp)
app.register_blueprint(blog_bp)
app.register_blueprint(uploads_bp)
app.register_blueprint(follower_bp)

# from models import User