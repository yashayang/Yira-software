from flask import Blueprint, jsonify, session, request
from flask_login import current_user, login_required
from datetime import datetime
from app.models import Attachment, Issue, db
from app.forms import AttachmentForm
from .auth_routes import validation_errors_to_error_messages
from app.s3_helpers import (
    upload_file_to_s3, allowed_file, get_unique_filename, delete_file_from_s3, download_file_from_s3)

attachment_routes = Blueprint('attachments', __name__)

@attachment_routes.route('/<int:issue_id>')
@login_required
def load_attachments(issue_id):
  attachments = Attachment.query.filter_by(issue_id=issue_id)
  return {"attachments": [attachment.to_dict() for attachment in attachments]}

@attachment_routes.route("/new", methods=["POST"])
@login_required
def upload_attachment():
  form = AttachmentForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  print("-----upload_attachment-----:", request.files)
  if "attachment" not in request.files:
    return {"errors": "file required"}, 400

  attachment = request.files["attachment"]

  if not allowed_file(attachment.filename):
      return {"errors": "File type not permitted. Please choose again."}, 400

  attachment.filename = get_unique_filename(attachment.filename)

  upload = upload_file_to_s3(attachment)

  if "url" not in upload:
    # if the dictionary doesn't have a url key it means that there was an error when we tried to upload so we send back that error message
    return upload, 400

  url = upload["url"]
  print("---CREATE ISSUE with attachment---before---url", url)
  print("---CREATE ISSUE with attachment---before---form.data", form.data)
  if form.validate_on_submit():
    print("---CREATE ISSUE with attachment---after---ENTER!!!!")
    new_attachment = Attachment(
      owner_id=current_user.id,
      issue_id=form.data["issueId"],
      name=form.data["name"],
      url=url,
      created_at = datetime.now()
    )
    print("---CREATE ISSUE with attachment---new_issue:", new_attachment)
    db.session.add(new_attachment)
    db.session.commit()

    return new_attachment.to_dict(), 201
  else:
    # print("---CREATE ISSUE---FORM ERRORS:", form.errors)
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

# fetch("http://localhost:3000/api/attachments/new", {
#   method: 'POST',
#   body: JSON.stringify(attachment = {
#    "owner_id": 1,
#    "issue_id": 1,
#    "name": "TESTER",
#    "url": "https://yiraawsbucket.s3.us-west-1.amazonaws.com/27137209667f48d6a8fd9bab9c87fd23.jpeg"
#   }),
#   headers: {
#     'Content-type': 'application/json'
#   }
# })
# .then(res => res.json())
# .then(console.log)

@attachment_routes.route("/<int:attachment_id>", methods=["PUT"])
@login_required
def update_attachment(attachment_id):
  new_attachment = None
  if "attachment" in request.files:
    new_attachment = request.files["attachment"]
    new_attachment.filename = get_unique_filename(new_attachment.filename)
  attachment = Attachment.query.get(attachment_id)
  url = attachment.url
  if current_user.id == attachment.owner_id:
    form = AttachmentForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
      if new_attachment:
        upload = upload_file_to_s3(new_attachment)
        if "url" not in upload:
            return upload, 400
        deleted = delete_file_from_s3(attachment.url.split(".com/")[1])
        url = upload["url"]
      attachment.task_id = form.data['issueId']
      attachment.name = form.data['name']
      attachment.url = url
      db.session.add(attachment)
      db.session.commit()
      return attachment.to_dict()
    else:
      return {'errors': validation_errors_to_error_messages(form.errors)}, 401
  else:
    return {'errors': ['Sorry, you are not the owner']}


@attachment_routes.route("/delete/<int:attachment_id>", methods=["DELETE"])
@login_required
def delete_attachment(attachment_id):
  attachment = Attachment.query.get(attachment_id)
  if current_user.id == attachment.owner_id:
    if attachment:
      db.session.delete(attachment)
      db.session.commit()
      return {'Message':'Successfully deleted'}
    else:
      return{"Message":'Attachment could not be found'},404
  else:
      return {'errors': ['Sorry, you are not the owner']}

# fetch("http://localhost:3000/api/attachments/6", {
#   method: 'DELETE',
#   headers: {
#     'Content-type': 'application/json'
#   }
# })
# .then(res => res.json())
# .then(console.log)

@attachment_routes.route('/download/<int:attachment_id>')
@login_required
def download_attachment(attachment_id):
  attachment = Attachment.query.get(attachment_id)
  url = attachment.url.split(".com/")[1]
  data = download_file_from_s3(url)
  return {"data": data}

# fetch("http://localhost:3000/api/attachments//10/download", {
#   method: 'GET',
#   headers: {
#     'Content-type': 'application/json'
#   }
# })
# .then(res => res.json())
# .then(console.log)
