from src.util.db import *

def filter_assignments(user, query):
    # needs courses to work
    # if user.is_admin():
    #     return query  # Admins can see all assignments

    # elif user.is_prof():
    #     # Professors can see assignments for courses they own
    #     courses_taught = db.session.query(Course.course_id).filter(Course.user_id == user.user_id).subquery()
    #     return query.filter(Assignment.course_id.in_(courses_taught))

    # elif user.is_student():
    #     # Students can see assignments for courses they are enrolled in
    #     enrolled_courses = db.session.query(CourseEnrollment.course_id).filter(
    #         CourseEnrollment.user_id == user.user_id
    #     ).subquery()
    #     return query.filter(Assignment.course_id.in_(enrolled_courses))

    # else:
    #     # No access by default
    #     return query.filter(False)
    return query


def filter_containers(user, query):
    if user.is_admin():
        return query  # Admins can see all containers
    return query.filter(Container.user_id == user.user_id)  # Filter by ownership for non-admins

def filter_images(user, query):
    # needs courses to work
    # if user.is_admin():
    #     return query  # Admins can see all images

    # elif user.is_prof():
    #     # Professors can see images for assignments in courses they own
    #     courses_taught = db.session.query(Course.course_id).filter(Course.user_id == user.user_id).subquery()
    #     relevant_assignments = db.session.query(Assignment.docker_image_id).filter(
    #         Assignment.course_id.in_(courses_taught)
    #     ).subquery()
    #     return query.filter(Image.docker_image_id.in_(relevant_assignments))

    # elif user.is_student():
    #     # Students can see images for assignments in courses they are enrolled in
    #     enrolled_courses = db.session.query(CourseEnrollment.course_id).filter(
    #         CourseEnrollment.user_id == user.user_id
    #     ).subquery()
    #     relevant_assignments = db.session.query(Assignment.docker_image_id).filter(
    #         Assignment.course_id.in_(enrolled_courses)
    #     ).subquery()
    #     return query.filter(Image.docker_image_id.in_(relevant_assignments))

    # else:
    #     # No access by default
    #     return query.filter(False)
    return query

def filter_submissions(user, query):
    # needs courses to work
    # if user.is_admin():
    #     return query  # Admins can see all submissions

    # elif user.is_prof():
    #     # Professors can see submissions for all assignments in courses they own
    #     courses_taught = db.session.query(Course.course_id).filter(Course.user_id == user.user_id).subquery()
    #     return query.filter(Submission.assignment_id.in_(
    #         db.session.query(Assignment.assignment_id).filter(Assignment.course_id.in_(courses_taught)).subquery()
    #     ))

    # elif user.is_student():
    #     # Students can see their own submissions, but still allow broad search capability
    #     return query.filter(Submission.user_id == user.user_id)

    # else:
    #     # No access by default
    #     return query.filter(False)
    return query

