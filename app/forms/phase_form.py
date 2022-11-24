from flask_wtf import FlaskForm
from wtforms import StringField TextAreaField
from wtforms.validators import DataRequired, ValidationError, Length


class PhaseForm(FlaskForm):
  title = StringField('title', validators=[DataRequired(), Length(min=6, max=100, message="Tile is required! And it must be between 6 - 100 characters long!")])