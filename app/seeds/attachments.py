from app.models import db, Attachment, environment, SCHEMA
from datetime import datetime

def seed_attachments():
    attachment1 = Attachment(
        owner_id = 1,
        issue_id = 2,
        name= "year-1861_256.gif",
        url = "https://yiraawsbucket.s3.us-west-1.amazonaws.com/13c45fdd2f31497d83fe3c2107218797.gif",
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
