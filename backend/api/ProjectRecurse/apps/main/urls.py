from django.urls import path

from . import views

# TODO: Change the 'ProjectRecurse' to your *own* project
app_name = 'ProjectRecurse'
urlpatterns = [
    path('', views.index),
    path('test/', views.test),
]

urlpatterns += [
    path('reflect/', views.reflect),
]
