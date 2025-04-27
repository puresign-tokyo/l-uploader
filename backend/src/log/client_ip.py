import contextvars

client_ip_context = contextvars.ContextVar("client_ip", default="System")
