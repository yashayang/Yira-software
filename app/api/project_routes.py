from flask import Blueprint, jsonify, session, request
from flask_login import current_user, login_required
from app.models import Phase, Issue, db
# from app.forms import PhaseForm, IssueForm

project_routes = Blueprint('projects', __name__)


@project_routes.route("/")
def get_all_phases_issues():
  all_phases = Phase.query.all()
  # phases = [phase.to_dict_all() for phase in all_phases]
  # print("====GETALLPHASESISSUES=====", phases)
  if all_phases is not None:
    return {"AllPhases":[phase.to_dict_all_phase() for phase in all_phases]}, 200

# fetch("http://localhost:3000/api/projects/", {
#   method: 'GET',
#   headers: {
#     'Content-type': 'application/json'
#   }
# })
# .then(res => res.json())
# .then(console.log)
