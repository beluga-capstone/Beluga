from sqlalchemy import select, or_
from src.util.db import *
from src.util.constants import default_image_ids

def filter_assignments(user, query):
    """
    Applies access control policies to the Assignments query.
    
    - Admins can see all assignments.
    - Professors can see assignments for courses they own.
    - Students can see assignments for courses they are enrolled in.
    - Other roles can have restricted access as defined.
    """
    if user.is_admin():
        return query

    elif user.is_prof():
        # Subquery to get courses taught by the professor
        courses_taught_subq = db.session.query(Course.course_id).filter(
            Course.user_id == user.user_id
        ).subquery()
        courses_taught_select = select(courses_taught_subq.c.course_id)
        
        return query.filter(Assignment.course_id.in_(courses_taught_select))

    elif user.is_student():
        # Subquery to get courses the student is enrolled in
        enrolled_courses_subq = db.session.query(CourseEnrollment.course_id).filter(
            CourseEnrollment.user_id == user.user_id
        ).subquery()
        enrolled_courses_select = select(enrolled_courses_subq.c.course_id)
        
        return query.filter(
            Assignment.course_id.in_(enrolled_courses_select),
            Assignment.is_published.is_(True)
        )
    else:
        return query.filter(False)


def filter_containers(user, query):
    if user.is_admin():
        return query  # Admins can see all containers
    return query.filter(Container.user_id == user.user_id)  # Filter by ownership for non-admins


def filter_images(user, query):
    """
    Applies access control policies to the Images query.
    
    - Admins can see all images.
    - Professors can see images they own.
    - Students can see images for assignments in courses they are enrolled in.
    - Other roles can have restricted access as defined.
    """
    print(default_image_ids)
    if user.is_admin():
        return query

    elif user.is_prof():
        # Professors can see their own images or default images
        return query.filter(
            or_(
                Image.user_id == user.user_id,
                Image.docker_image_id.in_(default_image_ids)
            )
        )

    elif user.is_student():
        # Students can see images related to their courses or default images
        enrolled_courses_subq = db.session.query(CourseEnrollment.course_id).filter(
            CourseEnrollment.user_id == user.user_id
        ).subquery()
        student_relevant_assignments_subq = db.session.query(Assignment.docker_image_id).filter(
            Assignment.course_id.in_(enrolled_courses_subq),
            Assignment.docker_image_id.isnot(None)
        ).subquery()

        return query.filter(
            or_(
                Image.docker_image_id.in_(student_relevant_assignments_subq),
                Image.docker_image_id.in_(default_image_ids)
            )
        )

    else:
        # Default access: only include default images
        return query.filter(Image.docker_image_id.in_(default_image_ids))


def filter_submissions(user, query):
    """
    Applies access control policies to the Submissions query.
    
    - Admins can see all submissions.
    - Professors can see submissions for all assignments in courses they own.
    - Students can see their own submissions.
    - Other roles can have restricted access as defined.
    """
    if user.is_admin():
        return query

    elif user.is_prof():
        # Subquery to get courses taught by the professor
        courses_taught_subq = db.session.query(Course.course_id).filter(
            Course.user_id == user.user_id
        ).subquery()
        courses_taught_select = select(courses_taught_subq.c.course_id)
        
        # Subquery to get assignment IDs for the courses taught
        assignments_subq = db.session.query(Assignment.assignment_id).filter(
            Assignment.course_id.in_(courses_taught_select)
        ).subquery()
        assignments_select = select(assignments_subq.c.assignment_id)
        
        return query.filter(Submission.assignment_id.in_(assignments_select))

    elif user.is_student():
        return query.filter(Submission.user_id == user.user_id)

    else:
        return query.filter(False)


def filter_users(user, query):
    """
    Applies access control policies to the User query.
    
    - Admins can see all users.
    - Professors can see users in their courses
    - Students can only see their own profile.
    - Other roles can have restricted access as defined.
    """
    if user.is_admin():
        return query
    elif user.is_prof():
        # Subquery to get courses taught by the professor
        courses_taught_subq = db.session.query(Course.course_id).filter(
            Course.user_id == user.user_id
        ).subquery()
        courses_taught_select = select(courses_taught_subq.c.course_id)
        
        # Subquery to get user IDs enrolled in those courses
        users_in_courses_subq = db.session.query(CourseEnrollment.user_id).filter(
            CourseEnrollment.course_id.in_(courses_taught_select)
        ).subquery()
        users_in_courses_select = select(users_in_courses_subq.c.user_id)
        
        return query.filter(User.user_id.in_(users_in_courses_select))

    elif user.is_student():
        # Students can only see their own profile
        return query.filter(User.user_id == user.user_id)
    else:
        # No access by default
        return query.filter(False)


def filter_courses(user, query):
    """
    Applies access control policies to the Course query.
    
    - Admins can see all courses.
    - Professors can see courses they own.
    - Students can see courses they are enrolled in.
    - Other roles can have restricted access as defined.
    """
    if user.is_admin():
        return query
    elif user.is_prof():
        return query.filter(Course.user_id == user.user_id)
    elif user.is_student():
        # Subquery to get courses the student is enrolled in
        enrolled_courses_subq = db.session.query(CourseEnrollment.course_id).filter(
            CourseEnrollment.user_id == user.user_id
        ).subquery()
        enrolled_courses_select = select(enrolled_courses_subq.c.course_id)
        
        return query.filter(Course.course_id.in_(enrolled_courses_select))
    else:
        return query.filter(False)
