from app.models import db, Issue, environment, SCHEMA
from datetime import datetime

def seed_issues():
  issue1 = Issue(
    summary="Yira Software is a web application inspired by the Jira Software.",
    project_id=1,
    phase_id=1,
    owner_id=1,
    assignee_id=2,
    created_at=datetime.now(),
    updated_at=datetime.now()
  )

  issue2 = Issue(
    summary="This is the 1st interation of Yira.",
    description="See attachment for details",
    project_id=1,
    phase_id=1,
    owner_id=1,
    assignee_id=3,
    created_at=datetime.now(),
    updated_at=datetime.now()
  )

  issue3 = Issue(
    summary="1st interation including full CRUD of Projects, Phases, Issues, Issue Attachments.",
    project_id=1,
    phase_id=1,
    owner_id=2,
    assignee_id=1,
    created_at=datetime.now(),
    updated_at=datetime.now()
  )

  issue4 = Issue(
    summary="The attachment is using AWS S3 for file uploading, doc-viewer npm package for previewing files.",
    description="schedule sent",
    project_id=1,
    phase_id=1,
    owner_id=3,
    assignee_id=1,
    created_at=datetime.now(),
    updated_at=datetime.now()
  )


  db.session.add(issue1)
  db.session.add(issue2)
  db.session.add(issue3)
  db.session.add(issue4)
  db.session.commit()

def undo_issues():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.issues RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM issues")

    db.session.commit()
