# query_utils.py
from sqlalchemy import and_
from src.util.db import db

def apply_filters(model, filters):
    query = db.session.query(model)
    filter_conditions = [getattr(model, field) == value for field, value in filters.items() if hasattr(model, field)]
    if filter_conditions:
        query = query.filter(and_(*filter_conditions))
    return query
