from app.models import db, Attachment, environment, SCHEMA
from datetime import datetime

def seed_attachments():
    attachment1 = Attachment(
        owner_id = 1,
        issue_id = 2,
        name= "Panda.jpeg",
        url = "https://yiraawsbucket.s3.us-west-1.amazonaws.com/27137209667f48d6a8fd9bab9c87fd23.jpeg",
        created_at= datetime.now(),
        updated_at= datetime.now(),
    )

    db.session.add(attachment1)
    db.session.commit()

def undo_attachments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.attachments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM attachments")

    db.session.commit()
