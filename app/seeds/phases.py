from app.models import db, Phase, environment, SCHEMA
from datetime import datetime

def seed_phases():
  Phase1 = Phase(
    title="TO DO",
    project_id=1,
    owner_id=1,
    created_at=datetime.now(),
    updated_at=datetime.now()
  )

  Phase2 = Phase(
    title="IN PROGRESS",
    project_id=1,
    owner_id=1,
    created_at=datetime.now(),
    updated_at=datetime.now()
  )

  Phase3 = Phase(
    title="DONE",
    project_id=1,
    owner_id=1,
    created_at=datetime.now(),
    updated_at=datetime.now()
  )

  db.session.add(Phase1)
  db.session.add(Phase2)
  db.session.add(Phase3)
  db.session.commit()

def undo_phases():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.phases RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM phases")

    db.session.commit()
