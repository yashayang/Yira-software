from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash

class Phase(db.Model):
  __tablename__ = "phases"

  if environment == "production":
      __table_args__ = {'schema': SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  title = db.Column(db.String(100), nullable=False)
  project_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('projects.id')))
  owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
  created_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=db.func.now())
  updated_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=db.func.now())

  #relataionship
  user = db.relationship("User", back_populates="phases")
  project = db.relationship("Project", back_populates="phases")
  issues = db.relationship("Issue", back_populates="phase", cascade="all, delete")

  #instance methods
  def to_dict_all_phase(self):
    return {
      'id': self.id,
      'title': self.title,
      'projectId': self.project_id,
      'ownerId': self.owner_id,
      'createdAt': self.created_at,
      'updatedAt': self.updated_at,
      'Issues': {issue.id: issue.to_dict() for issue in self.issues},
      'Project': self.project.to_dict()
    }

  def to_dict(self):
    return {
      'id': self.id,
      'title': self.title,
      'projectId': self.project_id,
      'ownerId': self.owner_id,
      'createdAt': self.created_at,
      'updatedAt': self.updated_at,
      'Project': self.project.to_dict()
    }
