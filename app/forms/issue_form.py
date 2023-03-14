from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, IntegerField
from wtforms.validators import DataRequired, ValidationError, Length


class IssueForm(FlaskForm):
  summary = StringField('summary', validators=[DataRequired(), Length(min=6, max=255, message="Summary must be between 6 - 255 characters long.")])
  description = TextAreaField('description', validators=[Length(max=500, message="Description must be under 500 characters long!")])
  owner_id = IntegerField('owner_id')
  phase_id = IntegerField('phase_id')
  assignee_id = IntegerField('assignee_id')
  # attachment = TextAreaField('Thumbnail')
