import os


def getenv_secure(envname: str) -> str:
    if (const_var := os.getenv(envname)) is not None:
        return str(const_var)
    raise ValueError(f"{envname} is not defineded")


def get_env_secure_bool(envname: str) -> bool:
    if (const_var := os.getenv(envname)) is None:
        raise ValueError(f"{envname} is not defineded")
    if const_var == "True" or const_var == "true":
        return True
    elif const_var == "False" or const_var == "false":
        return False
    else:
        raise ValueError(f"{envname} is not bool value {const_var}")
