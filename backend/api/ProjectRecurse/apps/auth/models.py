from django.db import models

from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin

#-------------------------------------
# Account Manager
#-------------------------------------

class AccountManager(BaseUserManager):
    
    def create_account(self, email, password=None):
        return self.create_user(email, password)

    def create_user(self, email, password=None):
        if not email:
            raise ValueError("You must provide a valid email address")

        normalized_email = self.normalize_email(email)
        account = self.model(email=normalized_email)

        account.set_password(password)
        account.save(using=self._db)

        return account

    def create_superuser(self, email, password=None):
        account = self.create_account(email, password)

        account.is_admin = True
        account.save(using=self._db)

        return account

    def normalize_email(self, email):
        return super().normalize_email(email).lower()


#-------------------------------------
# Account
#-------------------------------------

class Account(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(verbose_name="email address", max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = AccountManager()

    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.email

    # Required for Django Admin
    @property
    def is_staff(self):
        return self.is_admin

    # TODO: This is not secure or complete!  
    #       Add your own permission verifications here!
    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        return self.is_staff

    # TODO: This is not secure or complete!  
    #       Add your own module permission verifications here!
    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        return self.is_staff

    # Token Management

    @property
    def access_token(self):
        # This is annoying but we can't import this until *after* the AUTH_USER_MODEL
        # is registered
        from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

        refresh = TokenObtainPairSerializer.get_token(self)
        return str(refresh.access_token)

    @property
    def refresh_token(self):
        # This is annoying but we can't import this until *after* the AUTH_USER_MODEL
        # is registered
        from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
        
        refresh = TokenObtainPairSerializer.get_token(self)
        return str(refresh)