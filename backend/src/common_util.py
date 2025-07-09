import os


def getenv_secure(envname: str) -> str:
    if (const_var := os.getenv(envname)) is not None:
        return str(const_var)
    raise ValueError(f"{envname} is not defineded")
