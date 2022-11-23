from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash

class Issue(db.Model):
  __tablename__ = "issues"

  if environment == "production":
      __table_args__ = {'schema': SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  summary = db.Column(db.String(255), nullable=False)
  description = db.Column(db.String(500))
  attachment = db.Column(db.String(2000))
  phase_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('phases.id')))
  owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
  created_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=db.func.now())
  updated_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=db.func.now())

  #relationship
  user = db.relationship("User", back_populates="issues")
  phase = db.relationship("Phase", back_populates="issues")
  comments = db.relationship("Comment", back_populates="issue", cascade="all, delete")
