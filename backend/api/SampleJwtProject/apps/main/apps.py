from django.apps import AppConfig


class MainConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    # TODO: Change the 'SampleJwtProject.apps' to your *own* project apps
    name = 'SampleJwtProject.apps.main'
