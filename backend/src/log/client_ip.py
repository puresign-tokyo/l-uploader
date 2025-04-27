import contextvars

client_ip_context = contextvars.ContextVar("client_ip", default="System")
real_client_ip_context = contextvars.ContextVar("real_client_ip", default="System")
