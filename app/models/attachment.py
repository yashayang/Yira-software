from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Attachment(db.Model):
  __tablename__ = 'attachments'

  if environment == "production":
      __table_args__ = {'schema': SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
  issue_id = db.Column(db.Integer,db.ForeignKey(add_prefix_for_prod("issues.id")),nullable=False)
  name = db.Column(db.String(60))
  url = db.Column(db.String(2000))
  created_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=db.func.now())
  updated_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=db.func.now())

  #relationship
  user = db.relationship("User", back_populates="attachments")
  issue = db.relationship("Issue",back_populates="attachments")

  #instance methods
  def to_dict(self):
    return {
      "attachmentId": self.id,
      "ownerId": self.owner_id,
      "issueId": self.issue_id,
      "name": self.name,
      "url": self.url,
      'createdAt': self.created_at,
      'updatedAt': self.updated_at,
    }

  def __repr__(self):
    return f'<Attachment model: id={self.id}, ownerId={self.owner_id}, issueId={self.issue_id}, name={self.name}, url={self.url}, created_at={self.created_at}, updated_at={self.updated_at}>'
