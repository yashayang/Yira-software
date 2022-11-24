from flask import Blueprint, jsonify, session, request
from flask_login import current_user, login_required
from datetime import datetime
from app.models import Phase, Issue, db
from app.forms import PhaseForm, IssueForm
from .auth_routes import validation_errors_to_error_messages

project_routes = Blueprint('projects', __name__)


@project_routes.route("/issues/<int:issue_id>")
@login_required
def get_one_issue(issue_id):
  print("---GET ONE ISSUE---ISSUE_ID:", issue_id)
  issue = Issue.query.get(issue_id)
  print("---GET ONE ISSUE---ISSUE:", issue)
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

@project_routes.route("/")
# @login_required
def get_all_phases_issues():
  all_phases = Phase.query.all()
  # phases = [phase.to_dict_all() for phase in all_phases]
  # print("====GETALLPHASESISSUES=====", phases)
  if all_phases:
    return {"AllPhases":[phase.to_dict_all_phase() for phase in all_phases]}, 200

# fetch("http://localhost:3000/api/projects/", {
#   method: 'GET',
#   headers: {
#     'Content-type': 'application/json'
#   }
# })
# .then(res => res.json())
# .then(console.log)

@project_routes.route("/phases/<int:phase_id>/issues", methods=["POST"])
@login_required
def create_issue(phase_id):
  form = IssueForm()
  form['csrf_token'].data = request.cookies['csrf_token']

  if form.validate_on_submit():
    new_issue = Issue(
      summary = form.data["summary"],
      description = form.data["description"],
      phase_id = phase_id,
      owner_id = form.data["owner_id"],
      created_at= datetime.now()
    )

    db.session.add(new_issue)
    db.session.commit()

    return new_issue.to_dict(), 201
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
