from app.models import db, Project, environment, SCHEMA
from datetime import datetime

def seed_projects():
  project1 = Project(
    name='RD Sprint 23',
    owner_id=1,
    created_at=datetime.now(),
    updated_at=datetime.now()
  )

  db.session.add(project1)
  db.session.commit()

def undo_projects():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.projects RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM projects")

    db.session.commit()
