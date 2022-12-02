from flask import Blueprint, jsonify, session, request
from flask_login import current_user, login_required
from datetime import datetime
from app.models import Phase, Issue, db
from app.forms import PhaseForm, IssueForm
from .auth_routes import validation_errors_to_error_messages
from app.s3_helpers import (
    upload_file_to_s3, allowed_file, get_unique_filename)

project_routes = Blueprint('projects', __name__)


@project_routes.route("/issues/<int:issue_id>")
@login_required
def get_one_issue(issue_id):
  # print("---GET ONE ISSUE---ISSUE_ID:", issue_id)
  issue = Issue.query.get(issue_id)
  # print("---GET ONE ISSUE---ISSUE:", issue)
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
@login_required
def get_all_phases_issues():
  all_phases = Phase.query.all()
  # phases = [phase.to_dict_all() for phase in all_phases]
  # print("====GETALLPHASESISSUES=====", all_phases)
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
  # print("---CREATE ISSUE---description:", form.data["description"])
  # print("---CREATE ISSUE---SUMMARY:", form.data["summary"])
  # print("---CREATE ISSUE---PHASE_ID:", form.data["phase_id"])
  # print("---CREATE ISSUE---OWNER_ID:", form.data["owner_id"])
  if "image" not in request.files:
      return {"errors": "image required"}, 400

  image = request.files["image"]

  if not allowed_file(image.filename):
      return {"errors": "file type not permitted"}, 400

  image.filename = get_unique_filename(image.filename)

  upload = upload_file_to_s3(image)

  if "url" not in upload:
      # if the dictionary doesn't have a url key
      # it means that there was an error when we tried to upload
      # so we send back that error message
      return upload, 400

  url = upload["url"]
  # flask_login allows us to get the current user from the request
  # new_image = Image(user=current_user, url=url)
  # db.session.add(new_image)
  # db.session.commit()
  # return {"url": url}

  if form.validate_on_submit():
    new_issue = Issue(
      summary = form.data["summary"],
      description = form.data["description"],
      phase_id = form.data["phase_id"],
      owner_id = form.data["owner_id"],
      attachment = url,
      created_at= datetime.now()
    )
    # print("---CREATE ISSUE---new_issue:", new_issue)
    db.session.add(new_issue)
    db.session.commit()

    return new_issue.to_dict(), 201
  else:
    print("---CREATE ISSUE---FORM ERRORS:", form.errors)
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


@project_routes.route("/issues/<int:issue_id>", methods=["PUT"])
@login_required
def update_issue(issue_id):
  form = IssueForm()
  form['csrf_token'].data = request.cookies['csrf_token']

  issue = Issue.query.get(issue_id)
  if issue is None:
    return {"errors" : "Issue couldn't be found"}, 404
  # print("---UPDATE ISSUE---new_issue:", issue)
  # print("---UPDATE ISSUE---phase_id/onwer_id:", form.data['phase_id'], form.data["owner_id"])
  if form.validate_on_submit():
    issue.summary = form.data['summary']
    issue.description = form.data['description']
    issue.phase_id = form.data['phase_id']
    issue.owner_id = form.data["owner_id"]
    issue.updated_at = datetime.now()
    db.session.commit()
    return issue.to_dict(), 200
  else:
    # print("---UPDATE ISSUE---FORM ERRORS:", form.errors)
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

@project_routes.route("/issues/<int:issue_id>", methods=["DELETE"])
@login_required
def delete_issue(issue_id):
  # print("---DELETE ISSUE ROUTE---issue_id:", issue_id)
  issue = Issue.query.get(issue_id)
  # print("---DELETE ISSUE ROUTE---issue:", issue)
  if current_user.is_admin == True:
    db.session.delete(issue)
    db.session.commit()

    return jsonify({
      "message": "Issue is successfully deleted!",
      "status_code": 200
    }), 200

  else:
    # print("---DELETE ISSUE---FORM ERRORS:", form.errors)
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

@project_routes.route("/<int:project_id>/phases", methods=["POST"])
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


@project_routes.route("/phases/<int:phase_id>", methods=["PUT"])
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


@project_routes.route("/phases/<int:phase_id>", methods=["DELETE"])
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

# fetch("http://localhost:3000/api/projects/phases/7", {
#   method: 'DELETE',
#   headers: {
#     'Content-type': 'application/json'
#   }
# })
# .then(res => res.json())
# .then(console.log)
