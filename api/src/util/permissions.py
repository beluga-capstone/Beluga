
from src.util.policies import (
    filter_assignments, 
    filter_containers, 
    filter_images, 
    filter_submissions, 
    filter_users,
    filter_courses
)
from src.util.db import *
from src.util.auth import *

FILTER_POLICIES = {
    'assignments': filter_assignments,
    'containers': filter_containers,
    'images': filter_images,
    'submissions': filter_submissions,
    'users': filter_users,
    'courses': filter_courses,
}
from typing import Type, Callable, Optional
from sqlalchemy.orm import Query
from sqlalchemy import inspect
from src.util.db import db, User

def get_filtered_entity(
    user: User,
    entity_cls: Type[db.Model],
    entity_id: str,
    filter_func: Callable[[User, Query], Query],
    pk_attr: Optional[str] = None
) -> Optional[db.Model]:
    """
    Fetch a single entity after applying access control policies.

    :param user: The current user object.
    :param entity_cls: The SQLAlchemy model class.
    :param entity_id: The ID of the entity to fetch.
    :param filter_func: The function to apply access control policies.
    :param pk_attr: The primary key attribute name (optional).
    :return: The entity if accessible, or None.
    """
    mapper = inspect(entity_cls)
    primary_key_cols = mapper.primary_key
    if not primary_key_cols:
        raise ValueError(f"No primary key defined for {entity_cls.__name__}")
    if len(primary_key_cols) != 1:
        raise NotImplementedError("get_filtered_entity currently only supports single-column primary keys")
    primary_key_col = primary_key_cols[0].name if not pk_attr else pk_attr
    
    # Build the query
    query = db.session.query(entity_cls).filter(getattr(entity_cls, primary_key_col) == entity_id)
    
    # Apply the access control filter
    filtered_query = filter_func(user, query)
    
    # Fetch the entity
    entity = filtered_query.first()
    return entity



def apply_user_filters(user, resource_type, query):
    filter_func = FILTER_POLICIES.get(resource_type)
    if not filter_func:
        raise ValueError(f"No filter policy defined for resource type '{resource_type}'")
    return filter_func(user, query)

