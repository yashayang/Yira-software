from flask import Blueprint, jsonify, session, request
from flask_login import current_user, login_required
from app.models import Phase, Issue, db
# from app.forms import PhaseForm, IssueForm

project_routes = Blueprint('projects', __name__)


@project_routes.route("/issues/<int:issue_id>")
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

# @project_routes.route("")
