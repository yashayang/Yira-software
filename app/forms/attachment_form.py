from flask_wtf import FlaskForm
from wtforms import StringField, DateField, SubmitField, IntegerField
from wtforms.validators import DataRequired, ValidationError
from app.models import Attachment

def valid_url(form, field):
  url = field.data
  if url and not url.lower().endswith(("pdf", "png", "jpg", "jpeg", "gif", "docx", "xlsx", "ppt", "pptx")):
    raise ValidationError(
      'Invalid file type. Only accept "pdf", "png", "jpg", "jpeg", "gif", "docx", "xlsx", "ppt", "pptx"')


class AttachmentForm(FlaskForm):
  issueId = IntegerField("issueId", validators=[DataRequired()])
  url = StringField("url", validators=[valid_url])
  name = StringField("name",validators=[DataRequired()])
  # submit = SubmitField('Upload')
