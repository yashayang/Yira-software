import time
from sqlalchemy import event
from sqlalchemy.engine import Engine

def setup_sqlalchemy_event_listeners(engine):
  @event.listens_for(Engine, "before_cursor_execute")
  def before_cursor_execute(conn, cursor, statement, parameters, context, executemany):
    context._query_start_time = time.time()

  @event.listens_for(Engine, "after_cursor_execute")
  def after_cursor_execute(conn, cursor, statement, parameters, context, executemany):
    total = time.time() - context._query_start_time
    if total > 1:
      print(f"Slow Query: {statement}\nParameters: {parameters}\nExecution Time: {total:.3f}")
