from flask_wtf import FlaskForm
from wtforms import StringField, SelectField
from wtforms.validators import DataRequired, Email, ValidationError, Length
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


# def username_exists(form, field):
#     # Checking if username is already in use
#     username = field.data
#     user = User.query.filter(User.username == username).first()
#     if user:
#         raise ValidationError('Username is already in use.')

CHOICES= [False]

class SignUpForm(FlaskForm):
    firstName = StringField('first_name', validators=[DataRequired(), Length(max=40, message="First Name must be fewer than 40 characters")])
    lastName = StringField('last_name', validators=[DataRequired(), Length(max=40, message="Last Name must be fewer than 40 characters")])
    email = StringField('email', validators=[DataRequired(), user_exists, Length(max=255, message="Email must be fewer than 255 characters"), Email()])
    administration = SelectField('is_admin', choices=CHOICES, default=False, validators=[DataRequired()])
    password = StringField('password', validators=[DataRequired()])
