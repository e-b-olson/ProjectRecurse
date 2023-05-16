"""
WSGI config for SampleJwtProject project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

# TODO: Change the 'SampleJwtProject.settings' to your *own* project settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'SampleJwtProject.settings')

application = get_wsgi_application()
