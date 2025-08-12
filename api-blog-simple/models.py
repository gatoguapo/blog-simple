from sqlalchemy import func
from sqlalchemy.orm import relationship, Mapped
from app import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(128), unique=True, nullable=False)
    email = db.Column(db.String(128), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    picture_url = db.Column(db.String(255), nullable=True)
    bgimage_url = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.now())

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "password_hash": self.password_hash,
            "description": self.description,
            "picture_url": self.picture_url,
            "bgimage_url": self.bgimage_url,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f'<User {self.username}>'

class Blog(db.Model):
    __tablename__ = 'blogs'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    title  = db.Column(db.String(255), nullable=True)
    description = db.Column(db.String(1000), nullable=True)
    picture_url = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=func.now())

    user = db.relationship('User', backref='blogs')

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "description": self.description,
            "picture_url": self.picture_url,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f'<Blogs {self.id}>'

class Follower(db.Model):
    __tablename__ = 'followers'

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    follower_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)

    follower: Mapped['User'] = relationship(
        'User',
        foreign_keys=[follower_id]
    )

    user: Mapped['User'] = relationship(
        'User',
        foreign_keys=[user_id]
    )

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "follower_id": self.follower_id
        }

    def __repr__(self):
        return (f"<Follower user_id={self.user_id}, "
            f"follower_id={self.follower_id}>")