"""
ASGI config for SampleJwtProject project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

# TODO: Change the 'SampleJwtProject.settings' to your *own* project settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'SampleJwtProject.settings')

application = get_asgi_application()
