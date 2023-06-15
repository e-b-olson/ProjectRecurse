"""
ASGI config for ProjectRecurse project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

# TODO: Change the 'ProjectRecurse.settings' to your *own* project settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ProjectRecurse.settings')

application = get_asgi_application()