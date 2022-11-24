from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, IntegerField
from wtforms.validators import DataRequired, ValidationError, Length


class IssueForm(FlaskForm):
  summary = StringField('summary', validators=[DataRequired(), Length(min=6, max=255, message="Summary is required! And it must be between 6 - 255 characters long!")])
  description = TextAreaField('description', validators=[Length(max=500, message="Description must be under 500 characters long!")])
  owner_id = IntegerField('owner_id')
