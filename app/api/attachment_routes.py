from flask import Blueprint, jsonify, session, request
from flask_login import current_user, login_required
from datetime import datetime
from app.models import Phase, Issue, db
from app.forms import PhaseForm, IssueForm
from .auth_routes import validation_errors_to_error_messages
from app.s3_helpers import (
    upload_file_to_s3, allowed_file, get_unique_filename, delete_file_from_s3, download_file_from_s3)

attachment_routes = Blueprint('attachments', __name__)

def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages

@attachment_routes.route("/<int:issue_id>", methods=["PUT"])
@login_required
def delete_attachment(issue_id):
  issue = Issue.query.get(issue_id)
  curr_attachment = issue.attachment
  attachment_name = curr_attachment.split(".com/")[1]
  print("---DELETE ATTACHMENT---curr_attachment:", curr_attachment, type(curr_attachment))
  print("---DELETE ATTACHMENT---attachment_name:", attachment_name)

  form = IssueForm(obj=issue)
  form['csrf_token'].data = request.cookies['csrf_token']

  if current_user.is_admin == True:
    if curr_attachment:
      if form.validate_on_submit():
      # db.session.delete(curr_attachment)
        issue.attachment = None
        issue.updated_at = datetime.now()
        db.session.commit()
        deleted = delete_file_from_s3(attachment_name)
        return {
          "message": "Attachment is successfully deleted!",
          "status_code": 200
        }, 200
      else:
        return {
          "errors": "Attachment could not be found!"
        }, 404

  else:
    return {
      "errors": "Unauthorized! You are not the admin of this board!"
    }, 403

# fetch("http://localhost:3000/api/attachments/6", {
#   method: 'PUT',
#   body: JSON.stringify({
#    "attachment": " "
#   }),
#   headers: {
#     'Content-type': 'application/json'
#   }
# })
# .then(res => res.json())
# .then(console.log)

@attachment_routes.route('/<int:issue_id>/download')
@login_required
def download_attachment(issue_id):
  issue = Issue.query.get(issue_id)
  curr_attachment = issue.attachment
  attachment_name  = curr_attachment.split(".com/")[1]

  data = download_file_from_s3(attachment_name)
  return {"data": data}

# fetch("http://localhost:3000/api/attachments//10/download", {
#   method: 'GET',
#   headers: {
#     'Content-type': 'application/json'
#   }
# })
# .then(res => res.json())
# .then(console.log)
