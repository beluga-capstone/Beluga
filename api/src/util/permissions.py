from src.util.policies import filter_assignments, filter_containers, filter_images, filter_submissions

FILTER_POLICIES = {
    'assignments': filter_assignments,
    'containers': filter_containers,
    'images': filter_images,
    'submissions': filter_submissions,
}

def apply_user_filters(user, resource_type, query):
    filter_func = FILTER_POLICIES.get(resource_type)
    if not filter_func:
        raise ValueError(f"No filter policy defined for resource type '{resource_type}'")
    return filter_func(user, query)
