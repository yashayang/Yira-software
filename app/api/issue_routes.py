from flask import Blueprint, jsonify, session, request
from flask_login import current_user, login_required
from datetime import datetime
from app.models import Phase, Issue, db
from app.forms import PhaseForm, IssueForm
from .auth_routes import validation_errors_to_error_messages
from werkzeug.datastructures import MultiDict
from app.cache import cache
import logging

# Logging to see if the function is being executed
logging.basicConfig(level=logging.INFO)

issue_routes = Blueprint('issues', __name__)

@issue_routes.route("/<int:issue_id>")
@login_required
@cache.cached(timeout=50)
def get_one_issue(issue_id):
  """
  If the cache decore is applied correctly. This
  log message will be displayed in the terminal
  only once, within a 50 second time frame.
  """
  logging.info(f"Fetching issue {issue_id} from the database...")

  issue = Issue.query.get(issue_id)
  if issue:
    return issue.to_dict(), 200
  else:
    return {"error": "Issue couldn't be found", "statusCode": 404}

# fetch("http://localhost:3000/api/projects/issues/1", {
#   method: 'GET',
#   headers: {
#     'Content-type': 'application/json'
#   }
# })
# .then(res => res.json())
# .then(console.log)


@issue_routes.route("/<int:phase_id>/new", methods=["POST"])
@login_required
def create_issue(phase_id):
  form = IssueForm()
  form['csrf_token'].data = request.cookies['csrf_token']

  # Use `validate_on_submit` method provided by Flask-WTF to handling
  # form submission and validation
  if form.validate_on_submit():
    try:
      new_issue = Issue(
        summary = form.data["summary"],
        description = form.data["description"],
        phase_id = form.data["phase_id"],
        assignee_id = form.data["assignee_id"],
        owner_id = form.data["owner_id"],
        created_at= datetime.now()
      )
      db.session.add(new_issue)
      db.session.commit()

      return new_issue.to_dict(), 201
    except Exception as e:
      db.session.rollback()
      return {'errors': str(e)}, 500
  else:
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

# fetch("http://localhost:3000/api/projects/phases/3/issues", {
#   method: 'POST',
#   body: JSON.stringify({
#    "summary": "new issue",
#    "description": "new description",
#    "phase_id": 3,
#    "owner_id": 2
#   }),
#   headers: {
#     'Content-type': 'application/json'
#   }
# })
# .then(res => res.json())
# .then(console.log)


@issue_routes.route("/<int:issue_id>", methods=["PUT"])
@login_required
def update_issue(issue_id):
  issue = Issue.query.filter(Issue.id == issue_id).first()
  # print("!!!!!!!!!!!!ISSUE_ROUTE issue!!!!!!!!!!!!!!:", issue.to_dict())
  if issue is None:
    return {"errors" : "Issue couldn't be found"}, 404

  json_data = request.get_json()
  formdata = MultiDict(json_data)
  if formdata.get("assignee_id") == "":
      formdata["assignee_id"] = None

  form = IssueForm(formdata=formdata)
  form['csrf_token'].data = request.cookies['csrf_token']

  # Use `validate_on_submit` method provided by Flask-WTF to handling
  # form submission and validation
  if form.validate_on_submit():
    try:
      issue.summary = form.summary.data
      issue.description = form.description.data
      issue.phase_id = form.phase_id.data
      issue.owner_id = form.owner_id.data if form.assignee_id.data != "" else 0
      issue.assignee_id = form.assignee_id.data if form.assignee_id.data != "" else 0
      issue.updated_at = datetime.now()
      db.session.commit()
      return issue.to_dict(), 200
    except Exception as e:
      db.session.rollback()
      return {'errors': str(e)}, 500
  else:
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

# fetch("http://localhost:3000/api/projects/issues/6", {
#   method: 'PUT',
#   body: JSON.stringify({
#    "summary": "edit issue",
#    "description": "edit description",
#    "phase_id": 4,
#    "owner_id": 3
#   }),
#   headers: {
#     'Content-type': 'application/json'
#   }
# })
# .then(res => res.json())
# .then(console.log)

@issue_routes.route("/<int:issue_id>", methods=["DELETE"])
@login_required
def delete_issue(issue_id):
  issue = Issue.query.get(issue_id)
  if current_user.is_admin == True:
    db.session.delete(issue)
    db.session.commit()

    return jsonify({
      "message": "Issue is successfully deleted!",
      "status_code": 200
    }), 200

  else:
    return jsonify({
      "errors": "Unauthorized! You are not the admin of this board!"
    }), 403

# fetch("http://localhost:3000/api/projects/issues/6", {
#   method: 'DELETE',
#   headers: {
#     'Content-type': 'application/json'
#   }
# })
# .then(res => res.json())
# .then(console.log)
