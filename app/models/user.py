from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(40), nullable=False)
    last_name = db.Column(db.String(40), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    is_admin = db.Column(db.Boolean(40), nullable=False)
    hashed_password = db.Column(db.String(255), nullable=False)

    #relationship
    issues_owner = db.relationship("Issue", back_populates="owner", cascade="all, delete", primaryjoin="Issue.owner_id==User.id")
    issues_assignee = db.relationship("Issue", back_populates="assignee", cascade="all, delete", primaryjoin="Issue.assignee_id==User.id")
    phases = db.relationship("Phase", back_populates="user", cascade="all, delete")
    projects = db.relationship("Project", back_populates="user", cascade="all, delete")
    comments = db.relationship("Comment", back_populates="user", cascade="all, delete")
    attachments = db.relationship("Attachment", back_populates="user", cascade="all, delete")

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'is_admin': self.is_admin
        }
