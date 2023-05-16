from django.contrib.auth import authenticate

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import AccountCreateSerializer, AccountSerializer

class AuthTestView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        content = {'message': 'You are authenticated!'}
        return Response(content)

class SignInAPIView(APIView):
    def post(self, request, format=None):
        account = None

        email = request.data.get('email')
        password = request.data.get('password')

        if email and password:
            account = authenticate(request = request, email=email, password=password)

        if account:
            serializer = AccountSerializer(account)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(status=status.HTTP_400_BAD_REQUEST)

class SignUpAPIView(APIView):
    def post(self, request, format=None):
        serializer = AccountCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)