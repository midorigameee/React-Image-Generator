import os


def get_allow_origin_list():
    allow_origin_list = ["http://localhost:3000"]

    try:
        origin = os.environ.get('ALLOW_ORIGIN')
        if origin:
            allow_origin_list.append(origin)
        print(f"ALLOW_ORIGIN : {allow_origin_list}")
    except Exception as e:
        print("ALLOW_ORIGIN is not found.")
        print(e)

    return allow_origin_list