# Module with helper functions

def move_keys_inside_values(origin_dict):
    """
    =======================================\n
    Move keys inside values of a dictionary
    Example:
    origin_dict = {
        "key1": {"value1": "value1"},
        "key2": {"value2": "value2"}
    }
    result = [
        {"key": "key1", "value1": "value1"},
        {"key": "key2", "value2": "value2"}
    \n=======================================
    """
    
    transform_dict = []
    for key, values in origin_dict.items():
        new_object = {"key": key, **values}
        transform_dict.append(new_object)

    return transform_dict