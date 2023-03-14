from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash

class Issue(db.Model):
  __tablename__ = "issues"

  if environment == "production":
      __table_args__ = {'schema': SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  summary = db.Column(db.String(255), nullable=False)
  description = db.Column(db.String(500))
  project_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('projects.id')))
  phase_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('phases.id')))
  owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
  assignee_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
  created_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=db.func.now())
  updated_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=db.func.now())

  #relationship
  project = db.relationship("Project", back_populates="issues")
  phase = db.relationship("Phase", back_populates="issues")
  owner = db.relationship("User", back_populates="issues_owner", primaryjoin="Issue.owner_id==User.id")
  assignee = db.relationship("User", back_populates="issues_assignee", primaryjoin="Issue.assignee_id==User.id")
  comments = db.relationship("Comment", back_populates="issue", cascade="all, delete")
  attachments = db.relationship("Attachment", back_populates="issue", cascade="all, delete")

  #instance methods
  def to_dict_all_issues(self):
    return {
      "issueId": self.id,
      "projectId": self.project_id,
      "phaseId": self.phase_id,
      "ownerId": self.owner_id,
      "assigneeId": self.assignee_id,
      "summary": self.summary,
      "description": self.description,
      "createdAt": self.created_at,
      "updatedAt": self.updated_at,
      "Attachment": [attachment.to_dict() for attachment in self.attachments],
      "Owner": self.owner.to_dict(),
      "Assignee": self.assignee.to_dict()
    }

  def to_dict(self):
    return {
      "issueId": self.id,
      "projectId": self.project_id,
      "phaseId": self.phase_id,
      "ownerId": self.owner_id,
      "assigneeId": self.assignee_id,
      "summary": self.summary,
      "description": self.description,
      "createdAt": self.created_at,
      "updatedAt": self.updated_at,
      "Phase": self.phase.to_dict(),
      "Attachment": [attachment.to_dict() for attachment in self.attachments],
      "Comments": [comment.to_dict() for comment in self.comments],
      "Owner": self.owner.to_dict(),
      "Assignee": self.assignee.to_dict()
    }
