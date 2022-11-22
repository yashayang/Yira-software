from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash

class Comment(db.Model):
  __tablename__ = "comments"

  if environment == "production":
      __table_args__ = {'schema': SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  comment = db.Column(db.String(500), nullable=False)
  issue_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('issues.id')))
  owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
  created_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=db.func.now())
  updated_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=db.func.now())
