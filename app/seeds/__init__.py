from flask.cli import AppGroup
from .users import seed_users, undo_users
from .issues import seed_issues, undo_issues
from .phases import seed_phases, undo_phases
from .projects import seed_projects, undo_projects
from .comments import seed_comments, undo_comments

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        # undo_users()
        seed_users()
        seed_projects()
        seed_phases()
        seed_issues()
        seed_comments()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_projects()
    undo_phases()
    undo_issues()
    undo_comments()
    # Add other undo functions here
