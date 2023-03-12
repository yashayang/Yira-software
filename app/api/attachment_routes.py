from flask import Blueprint, jsonify, session, request
from flask_login import current_user, login_required
from datetime import datetime
from app.models import Phase, Issue, db
from app.forms import PhaseForm, IssueForm
from .auth_routes import validation_errors_to_error_messages
from app.s3_helpers import (
    upload_file_to_s3, allowed_file, get_unique_filename)

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

@attachment_routes.route("/<int:issue_id>", methods=["DELETE"])
@login_required
def delete_attachment(issue_id):
  issue = Issue.query.get(issue_id)
  curr_attachment = issue.attachment
  
