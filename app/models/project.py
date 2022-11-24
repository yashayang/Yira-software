from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash

class Project(db.Model):
  __tablename__ = "projects"

  if environment == "production":
      __table_args__ = {'schema': SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(100), nullable=False)
  owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
  created_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=db.func.now())
  updated_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=db.func.now())

  #relationship
  user = db.relationship("User", back_populates="projects")
  phases = db.relationship("Phase", back_populates="project", cascade="all, delete")

  #instance methods
  def to_dict(self):
    return {
      'id': self.id,
      'name': self.name,
      'ownerId': self.owner_id,
      'createdAt': self.created_at,
      'updatedAt': self.updated_at,
    }
