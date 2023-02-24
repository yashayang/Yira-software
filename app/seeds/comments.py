from app.models import db, Comment, environment, SCHEMA
from datetime import datetime

def seed_comments():
  Comment1 = Comment(
    comment='review still error out when I was checking the feature.',
    issue_id=1,
    owner_id=3,
    created_at=datetime.now(),
    updated_at=datetime.now()
  )

  Comment2 = Comment(
    comment='review has error',
    issue_id=1,
    owner_id=2,
    created_at=datetime.now(),
    updated_at=datetime.now()
  )

  Comment3 = Comment(
    comment='I didnt see any attachment',
    issue_id=2,
    owner_id=2,
    created_at=datetime.now(),
    updated_at=datetime.now()
  )

  db.session.add(Comment1)
  db.session.add(Comment2)
  db.session.add(Comment3)
  db.session.commit()

def undo_comments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM comments")

    db.session.commit()
