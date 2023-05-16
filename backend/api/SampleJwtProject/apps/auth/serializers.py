from django.contrib.auth import password_validation
from django.core.exceptions import ObjectDoesNotExist

from rest_framework import serializers

from .models import Account

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'email', 'access_token', 'refresh_token']
        read_only_fields = ['id', 'email', 'access_token', 'refresh_token']

class AccountCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'email', 'password', 'access_token', 'refresh_token']
        read_only_fields = ['access_token', 'refresh_token']
        extra_kwargs = {
            'password': {'write_only': True},
            'access_token': {'required': False},
            'refresh_token': {'required': False},
        }

    def validate_password(self, value):
        try:
            password_validation.validate_password(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError(str(e))
        return value

    def create(self, validated_data):
        try:
            account = Account.objects.get(email=validated_data['email'])
        except ObjectDoesNotExist:
            account = Account.objects.create_account(**validated_data)

        return account