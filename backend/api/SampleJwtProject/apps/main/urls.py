from django.urls import path

from . import views

# TODO: Change the 'SampleJwtProject' to your *own* project
app_name = 'SampleJwtProject'
urlpatterns = [
    path('', views.index),
    path('test/', views.test),
]