from app.models import db, Phase, environment, SCHEMA
from datetime import datetime

def seed_phases():
  Phase1 = Phase(
    title="SELECTED FOR DEVELOPMENT",
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
    title="PRODUCT CHECK",
    project_id=1,
    owner_id=1,
    created_at=datetime.now(),
    updated_at=datetime.now()
  )

  Phase4 = Phase(
    title="QA CHECK",
    project_id=1,
    owner_id=1,
    created_at=datetime.now(),
    updated_at=datetime.now()
  )

  Phase5 = Phase(
    title="AWAITING DEPLOYMENT",
    project_id=1,
    owner_id=1,
    created_at=datetime.now(),
    updated_at=datetime.now()
  )

  Phase6 = Phase(
    title="DONE",
    project_id=1,
    owner_id=1,
    created_at=datetime.now(),
    updated_at=datetime.now()
  )


  db.session.add(Phase1)
  db.session.add(Phase2)
  db.session.add(Phase3)
  db.session.add(Phase4)
  db.session.add(Phase5)
  db.session.add(Phase6)
  db.session.commit()

def undo_phases():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.phases RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM phases")

    db.session.commit()
