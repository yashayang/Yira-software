from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, IntegerField
from wtforms.validators import DataRequired, ValidationError, Length


class PhaseForm(FlaskForm):
  title = StringField('title', validators=[DataRequired(), Length(min=4, max=50, message="Title must be between 4 - 50 characters long!")])
  project_id = IntegerField('ptoject_id')
  owner_id = IntegerField('owner_id')
