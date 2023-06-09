from django.urls import path

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.views import TokenVerifyView

from .views import AuthTestView, SignInAPIView, SignUpAPIView

app_name = 'auth'
urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='jwt_token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='jwt_token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='jwt_token_verify'),
    path('test/', AuthTestView.as_view(), name='auth_test'),
    path('sign-in/', SignInAPIView.as_view(), name='sign-in'),
    path('sign-up/', SignUpAPIView.as_view(), name='sign-up'),
]