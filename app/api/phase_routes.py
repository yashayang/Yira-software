from flask import Blueprint, jsonify, session, request, g
from flask_login import current_user, login_required
from datetime import datetime
from app.models import Phase, Issue, db
from app.forms import PhaseForm, IssueForm
from .auth_routes import validation_errors_to_error_messages
from app.cache import cache
import logging
from time import time

# Logging to see if the function is being executed
logging.basicConfig(level=logging.INFO)

phase_routes = Blueprint('phases', __name__)


# Measurement of time taken for executing get_all_phases_issues
# @phase_routes.before_request
# def start_timer():
#     g.start_time = time()

@phase_routes.route("/")
@login_required
@cache.cached(timeout=50)
def get_all_phases_issues():
  """
  If the cache decore is applied correctly. This
  log message will be displayed in the terminal
  only once, within a 50 second time frame.
  """
  logging.info(f"Fetching all_phases_issues from the database")

  all_phases = Phase.query.all()
  if all_phases:
    return {"AllPhases":[phase.to_dict_all_phase() for phase in all_phases]}, 200

# Measurement of time taken for executing get_all_phases_issues
# @phase_routes.after_request
# def log_request(response):
#     elapsed_time = time() - g.start_time
#     logging.info(f"Request to {request.path} took {elapsed_time:.4f} seconds")
#     return response

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

  # Use `validate_on_submit` method provided by Flask-WTF to handling
  # form submission and validation
  if form.validate_on_submit():
    try:
      new_phase = Phase(
        title = form.data["title"],
        project_id = project_id,
        owner_id = current_user.id,
        created_at= datetime.now()
      )

      db.session.add(new_phase)
      db.session.commit()

      return new_phase.to_dict_all_phase(), 201
    except Exception as e:
      db.sesssion.rollback()
      return {'errors': str(e)}, 500
  else:
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

  # Use `validate_on_submit` method provided by Flask-WTF to handling
  # form submission and validation
  if form.validate_on_submit():
    try:
      phase.title = form.data['title']
      phase.phase_id = phase_id
      phase.owner_id = current_user.id
      phase.updated_at = datetime.now()
      db.session.commit()
      return phase.to_dict_all_phase(), 200
    except Exception as e:
      db.session.rollback()
      return {'errors': str(e)}, 500
  else:
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
  phase = Phase.query.get(phase_id)

  if current_user.is_admin == True:
    db.session.delete(phase)
    db.session.commit()

    return jsonify({
      "message": "Phase is successfully deleted!",
      "status_code": 200
    }), 200

  else:
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
