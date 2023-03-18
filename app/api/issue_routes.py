from flask import Blueprint, jsonify, session, request
from flask_login import current_user, login_required
from datetime import datetime
from app.models import Phase, Issue, db
from app.forms import PhaseForm, IssueForm
from .auth_routes import validation_errors_to_error_messages
from werkzeug.datastructures import MultiDict

issue_routes = Blueprint('issues', __name__)

@issue_routes.route("/<int:issue_id>")
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


@issue_routes.route("/<int:phase_id>/new", methods=["POST"])
@login_required
def create_issue(phase_id):
  form = IssueForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  # print("---CREATE ISSUE---description:", form.data["description"])
  # print("---CREATE ISSUE---SUMMARY:", form.data["summary"])
  # print("---CREATE ISSUE---PHASE_ID:", form.data["phase_id"])
  # print("---CREATE ISSUE---OWNER_ID:", form.data["owner_id"])

    # print("===========create_issue without attachment==============", request.files)
    # print("===========form.data without attachment==============", form.data)
  if form.validate_on_submit():
    # print("==========form.validate_on_submit=====")
    new_issue = Issue(
      summary = form.data["summary"],
      description = form.data["description"],
      phase_id = form.data["phase_id"],
      owner_id = form.data["owner_id"],
      created_at= datetime.now()
    )
    # print("---CREATE ISSUE---new_issue:", new_issue)
    db.session.add(new_issue)
    db.session.commit()

    return new_issue.to_dict(), 201
  else:
    # print("---CREATE ISSUE---FORM ERRORS:", form.errors)
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

  # attachment = request.files["attachment"]

  # if not allowed_file(attachment.filename):
  #     return {"errors": "File type not permitted. Please choose again."}, 400

  # attachment.filename = get_unique_filename(attachment.filename)

  # upload = upload_file_to_s3(attachment)

  # if "url" not in upload:
  #     # if the dictionary doesn't have a url key
  #     # it means that there was an error when we tried to upload
  #     # so we send back that error message
  #     return upload, 400

  # url = upload["url"]
  # # flask_login allows us to get the current user from the request
  # # new_attachment = attachment(user=current_user, url=url)
  # # db.session.add(new_attachment)
  # # db.session.commit()
  # # return {"url": url}
  # # print("---CREATE ISSUE with attachment---before---form.data", form.data)
  # if form.validate_on_submit():
  #   # print("---CREATE ISSUE with attachment---after---form.data", form.data)
  #   new_issue = Issue(
  #     summary = form.data["summary"],
  #     description = form.data["description"],
  #     phase_id = form.data["phase_id"],
  #     owner_id = form.data["owner_id"],
  #     attachment = url,
  #     created_at= datetime.now()
  #   )
  #   # print("---CREATE ISSUE with attachment---new_issue:", new_issue)
  #   db.session.add(new_issue)
  #   db.session.commit()

  #   return new_issue.to_dict(), 201
  # else:
  #   # print("---CREATE ISSUE---FORM ERRORS:", form.errors)
  #   return {'errors': validation_errors_to_error_messages(form.errors)}, 401

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
  print("===========UPDATE ISSUE ENTER!!!!==============")
  issue = Issue.query.filter(Issue.id == issue_id).first()

  if issue is None:
    print('issue- not existing----',issue)
    return {"errors" : "Issue couldn't be found"}, 404

  json_data = request.get_json()
  formdata = MultiDict(json_data)
  if formdata.get("assignee_id") == "":
      formdata["assignee_id"] = None
  print("Form data:", formdata)

  form = IssueForm(formdata=formdata)
  print("Form errors:", form.errors)
  form['csrf_token'].data = request.cookies['csrf_token']
  print("===========UPDATE ISSUE NO attachment==============form.assignee_id", form.assignee_id)

  if form.validate_on_submit():
    print("==========form.validate_on_submit=====")
    issue.summary = form.summary.data
    issue.description = form.description.data
    issue.phase_id = form.phase_id.data
    issue.owner_id = form.owner_id.data if form.assignee_id.data != "" else 0
    issue.assignee_id = form.assignee_id.data if form.assignee_id.data != "" else 0
    issue.updated_at = datetime.now()
    db.session.commit()
    return issue.to_dict(), 200
  else:
    print("---UPDATE ISSUE---FORM ERRORS:", form.errors)
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

  # form = IssueForm()
  # form['csrf_token'].data = request.cookies['csrf_token']

  # print("===========UPDATE ISSUE NO attachment==============form.assignee_id", form.assignee_id)

  # if form.validate_on_submit():
  #   print("==========form.validate_on_submit=====")
  #   issue.summary = form.data["summary"]
  #   issue.description = form.data["description"]
  #   issue.phase_id = form.data["phase_id"]
  #   issue.owner_id = form.data["owner_id"]
  #   issue.assignee_id = form.data["assignee_id"] if form.data["assignee_id"] != "" else None
  #   issue.updated_at = datetime.now()
  #   db.session.commit()
  #   return issue.to_dict(), 200
  # else:
  #   print("---UPDATE ISSUE---FORM ERRORS:", form.errors)
  #   return {'errors': validation_errors_to_error_messages(form.errors)}, 401

  # attachment = request.files["attachment"]

  # if not allowed_file(attachment.filename):
  #   # print("===========UPDATE ISSUE 400 - 1==============", form.errors)
  #   return {"errors": "File type not permitted. Please choose again."}, 400

  # attachment.filename = get_unique_filename(attachment.filename)

  # upload = upload_file_to_s3(attachment)

  # if "url" not in upload:
  #   # print("===========UPDATE ISSUE 400 - 2==============", form.errors)
  #   # return upload, 400
  #   return {"errors": "File type not in upload."}, 400

  # url = upload["url"]

  # # print("---UPDATE ISSUE with attachment---new_issue:", issue)
  # if form.validate_on_submit():
  #   form.populate_obj(issue)
  #   issue.attachment = url
  #   issue.updated_at = datetime.now()
  #   db.session.commit()
  #   return issue.to_dict(), 200
  # else:
  #   # print("---UPDATE ISSUE---FORM ERRORS:", form.errors)
  #   return {'errors': validation_errors_to_error_messages(form.errors)}, 401

  #---------------- OLD version ----------------#
  # form = IssueForm()
  # form['csrf_token'].data = request.cookies['csrf_token']

  # issue = Issue.query.get(issue_id)
  # if issue is None:
  #   return {"errors" : "Issue couldn't be found"}, 404

  # if "attachment" not in request.files:
    # print("===========UPDATE ISSUE with attachment==============", request.files)
    # print("===========form.data with attachment==============", form.data)
    # if form.validate_on_submit():
      # print("==========form.validate_on_submit=====")
    #   issue.summary = form.data['summary']
    #   issue.description = form.data['description']
    #   issue.phase_id = form.data['phase_id']
    #   issue.owner_id = form.data["owner_id"]
    #   issue.updated_at = datetime.now()
    #   db.session.commit()
    #   return issue.to_dict(), 200
    # else:
      # print("---UPDATE ISSUE---FORM ERRORS:", form.errors)
  #     return {'errors': validation_errors_to_error_messages(form.errors)}, 401

  # attachment = request.files["attachment"]

  # if not allowed_file(attachment.filename):
  #     return {"errors": "File type not permitted. Please choose again."}, 400

  # attachment.filename = get_unique_filename(attachment.filename)

  # upload = upload_file_to_s3(attachment)

  # if "url" not in upload:
  #     return upload, 400

  # url = upload["url"]

  # print("---UPDATE ISSUE with attachment---new_issue:", issue)
  # print("---UPDATE ISSUE with attachment---form.data:", form.data)
  # if form.validate_on_submit():
  #   issue.summary = form.data['summary']
  #   issue.description = form.data['description']
  #   issue.phase_id = form.data['phase_id']
  #   issue.owner_id = form.data["owner_id"]
  #   issue.attachment = url
  #   issue.updated_at = datetime.now()
  #   db.session.commit()
  #   return issue.to_dict(), 200
  # else:
    # print("---UPDATE ISSUE---FORM ERRORS:", form.errors)
    # return {'errors': validation_errors_to_error_messages(form.errors)}, 401


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
