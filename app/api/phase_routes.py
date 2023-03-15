from flask import Blueprint, jsonify, session, request
from flask_login import current_user, login_required
from datetime import datetime
from app.models import Phase, Issue, db
from app.forms import PhaseForm, IssueForm
from .auth_routes import validation_errors_to_error_messages

phase_routes = Blueprint('phases', __name__)


@phase_routes.route("/")
@login_required
def get_all_phases_issues():
  all_phases = Phase.query.all()
  print("=======GET ALL PHASES & ISSUES=======", all_phases)
  if all_phases:
    return {"AllPhases":[phase.to_dict_all_phase() for phase in all_phases]}, 200

# fetch("http://localhost:3000/api/phases/", {
#   method: 'GET',
#   headers: {
#     'Content-type': 'application/json'
#   }
# })
# .then(res => res.json())
# .then(console.log)


@phase_routes.route("/<int:project_id>/new", methods=["POST"])
@login_required
def create_phase(project_id):
  form = PhaseForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  # print("---CREATE PHASE---TITLE:", form.data["title"])
  # print("---CREATE PHASE---PROJECT_ID:", form.data["project_id"])
  if form.validate_on_submit():
    new_phase = Phase(
      title = form.data["title"],
      project_id = project_id,
      owner_id = current_user.id,
      created_at= datetime.now()
    )
    # print("---CREATE PHASE---new_phase:", new_phase)
    db.session.add(new_phase)
    db.session.commit()

    return new_phase.to_dict_all_phase(), 201
  else:
    # print("---CREATE PHASE---FORM ERRORS:", form.errors)
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

# fetch("http://localhost:3000/api/projects/1/phases", {
#   method: 'POST',
#   body: JSON.stringify({
      # "title": "TO DO LIST",
      # "project_id": 1,
      # "owner_id": 1,
#   }),
#   headers: {
#     'Content-type': 'application/json'
#   }
# })
# .then(res => res.json())
# .then(console.log)


@phase_routes.route("/<int:phase_id>", methods=["PUT"])
@login_required
def update_phase(phase_id):
  form = PhaseForm()
  form['csrf_token'].data = request.cookies['csrf_token']

  phase = Phase.query.get(phase_id)
  if phase is None:
    return {"errors" : "Issue couldn't be found"}, 404
  # print("---UPDATE PHASE---new_issue:", phase)
  # print("---UPDATE PHASE---title/phase_id:", phase_id, form.data['phase_id'])
  if form.validate_on_submit():
    phase.title = form.data['title']
    phase.phase_id = phase_id
    phase.owner_id = current_user.id
    phase.updated_at = datetime.now()
    db.session.commit()
    return phase.to_dict_all_phase(), 200
  else:
    # print("---UPDATE PHASE---FORM ERRORS:", form.errors)
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

# fetch("http://localhost:3000/api/projects/phases/7", {
#   method: 'PUT',
#   body: JSON.stringify({
#       "title": "UPDATED PHASE",
#       "project_id": 1,
#       "owner_id": 1,
#   }),
#   headers: {
#     'Content-type': 'application/json'
#   }
# })
# .then(res => res.json())
# .then(console.log)


@phase_routes.route("/<int:phase_id>", methods=["DELETE"])
@login_required
def delete_phase(phase_id):
  # print("---DELETE PHASE ROUTE---phase_id:", phase_id)
  phase = Phase.query.get(phase_id)
  # print("---DELETE PHASE ROUTE---phase:", phase)
  if current_user.is_admin == True:
    db.session.delete(phase)
    db.session.commit()

    return jsonify({
      "message": "Phase is successfully deleted!",
      "status_code": 200
    }), 200

  else:
    # print("---DELETE PHASE---FORM ERRORS:", form.errors)
    return jsonify({
      "errors": "Unauthorized! You are not the admin of this board!"
    }), 403

# fetch("http://localhost:3000/api/phases/4", {
#   method: 'DELETE',
#   headers: {
#     'Content-type': 'application/json'
#   }
# })
# .then(res => res.json())
# .then(console.log)
