from app.models import db, Issue, environment, SCHEMA

def seed_issues():
  issue1 = Issue(
    summary="FB Ads - Check for review errors",
    description="Bobby has approved the Ad, only need to check for review errors. THX!",
    phase_id=1,
    owner_id=1,
    created_at=datetime.now(),
    updated_at=datetime.now()
  )

  issue2 = Issue(
    summary="Use OpenAI to tech check a AI-written emails feature",
    description="See attachment for details",
    phase_id=1,
    owner_id=1,
    created_at=datetime.now(),
    updated_at=datetime.now()
  )

  issue3 = Issue(
    summary="Use ML to find most popular times of day for our emails to be sent, opened, and replied to",
    phase_id=1,
    owner_id=2,
    created_at=datetime.now(),
    updated_at=datetime.now()
  )

  issue4 = Issue(
    summary="Finalize Scheduled Send QA + Code review",
    description="schedule sent",
    phase_id=1,
    owner_id=3,
    created_at=datetime.now(),
    updated_at=datetime.now()
  )

  issue5 = Issue(
    summary="When looking at a list, sorting by location returns no results.",
    description="Yasha is on this task",
    phase_id=2,
    owner_id=2,
    created_at=datetime.now(),
    updated_at=datetime.now()
  )


  db.session.add(issue1)
  db.session.add(issue2)
  db.session.add(issue3)
  db.session.add(issue4)
  db.session.add(issue5)
  db.session.commit()

def undo_products():
    db.session.execute('TRUNCATE issues RESTART IDENTITY CASCADE;')
    db.session.commit()
