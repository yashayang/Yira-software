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

  #instance methods
  def to_dict_all_issues(self):
    return {
      "issueId":self.id,
      "summary": self.summary,
      "phaseId": self.phase_id,
      "ownerId": self.owner_id,
      'createdAt': self.created_at,
      'updatedAt': self.updated_at,
      'user': self.user.to_dict()
    }

  def to_dict(self):
    return {
      "issueId":self.id,
      "summary": self.summary,
      "phaseId": self.phase_id,
      "ownerId": self.owner_id,
      'createdAt': self.created_at,
      'updatedAt': self.updated_at,
      'Phase': self.phase.to_dict(),
      'User': self.user.to_dict(),
      'Comments': [comment.to_dict() for comment in self.comments]
    }
