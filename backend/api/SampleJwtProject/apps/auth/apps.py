from django.apps import AppConfig


class AuthConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    # TODO: Change the 'SampleJwtProject.apps' to your *own* project apps
    name = 'SampleJwtProject.apps.auth'
    label = 'accounts'
