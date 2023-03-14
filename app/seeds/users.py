from app.models import db, User, environment, SCHEMA


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        first_name='yasha', last_name='yang', email='yasha@gmail.com', is_admin=True, password='password')
    fubao = User(
        first_name='fubao', last_name='b', email='fubao@gmail.com', is_admin=False, password='password')
    huahua = User(
        first_name='huahua', last_name='b', email='huahua@gmail.com', is_admin=False, password='password')

    db.session.add(demo)
    db.session.add(fubao)
    db.session.add(huahua)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM users")

    db.session.commit()
