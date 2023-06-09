from django.test import TestCase
from django.shortcuts import reverse

from .models import Account

class AuthViewTests(TestCase):
    email = "test_account@test.com"
    password = "someLongPasswordWithRandomNumbersLike32523InIt++"
    test_account = None

    def setUp(self):
        self.test_account = Account.objects.create_account(email=self.email, password=self.password)

    #--------------------------------------------------------------
    # /sign-up
    #--------------------------------------------------------------
    def test_sign_up_with_new_account(self):
        # given
        data = {"email":"test@test.com", "password":"328tyohg94h"}
        url = reverse('auth:sign-up')

        # when
        response = self.client.post(url, data=data)

        # then
        self.assertEqual(response.status_code, 201)

    def test_sign_up_with_new_account_responds_with_token(self):
        # Step 1 - create account
        data = {"email":"test@test.com", "password":"328tyohg94h"}
        url = reverse('auth:sign-up')

        response = self.client.post(url, data=data)

        self.assertEqual(response.status_code, 201)

        # Step 2 - test token
        access_token = response.data['access_token']
        url = reverse('auth:auth_test')

        response = self.client.get(
            url, 
            data=data,
            content_type='application/json',
            **{'HTTP_AUTHORIZATION': f'Bearer {access_token}'}
        )

        self.assertEqual(response.status_code, 200)

    def test_sign_up_with_exising_account(self):
        data = {"email":self.email, "password":"328tyohg94h"}
        url = reverse('auth:sign-up')

        response = self.client.post(url, data=data)

        self.assertEqual(response.status_code, 400)

    def test_sign_up_with_bad_email(self):
        # given
        data = {"email":"test@test", "password":"328tyohg94h"}
        url = reverse('auth:sign-up')

        # when
        response = self.client.post(url, data=data)

        # then
        self.assertEqual(response.status_code, 400)

    def test_sign_up_with_no_email(self):
        # given
        data = {"password":"328tyohg94h"}
        url = reverse('auth:sign-up')

        # when
        response = self.client.post(url, data=data)

        # then
        self.assertEqual(response.status_code, 400)

    def test_sign_up_with_bad_password(self):
        # given
        data = {"email":"test@test.com", "password":"123"}
        url = reverse('auth:sign-up')

        # when
        response = self.client.post(url, data=data)

        # then
        self.assertEqual(response.status_code, 400)

    def test_sign_up_with_empty_password(self):
        # given
        data = {"email":"test@test.com", "password":""}
        url = reverse('auth:sign-up')

        # when
        response = self.client.post(url, data=data)

        # then
        self.assertEqual(response.status_code, 400)

    def test_sign_up_with_no_password(self):
        # given
        data = {"email":"test@test.com"}
        url = reverse('auth:sign-up')

        # when
        response = self.client.post(url, data=data)

        # then
        self.assertEqual(response.status_code, 400)

    #--------------------------------------------------------------
    # /sign-in
    #--------------------------------------------------------------

    def test_sign_in_with_exising_account(self):
        data = {"email":self.email, "password":self.password}
        url = reverse('auth:sign-in')

        response = self.client.post(url, data=data)

        self.assertEqual(response.status_code, 200)

    def test_sign_in_with_existing_account_responds_with_token(self):
        # Step 1 - sign-in
        data = {"email":self.email, "password":self.password}
        url = reverse('auth:sign-in')

        response = self.client.post(url, data=data)

        self.assertEqual(response.status_code, 200)

        # Step 2 - test token
        access_token = response.data['access_token']
        url = reverse('auth:auth_test')

        response = self.client.get(
            url, 
            data=data,
            content_type='application/json',
            **{'HTTP_AUTHORIZATION': f'Bearer {access_token}'}
        )

        self.assertEqual(response.status_code, 200)

    def test_sign_in_without_existing_account(self):
        data = {"email":"bar@foo.com", "password":"328tyohg94h"}
        url = reverse('auth:sign-in')

        response = self.client.post(url, data=data)

        self.assertEqual(response.status_code, 400)

    def test_sign_in_with_bad_password(self):
        data = {"email":self.email, "password":self.password.lower()}
        url = reverse('auth:sign-in')

        response = self.client.post(url, data=data)

        self.assertEqual(response.status_code, 400)

    def test_sign_in_with_empty_password(self):
        data = {"email":self.email, "password":""}
        url = reverse('auth:sign-in')

        response = self.client.post(url, data=data)

        self.assertEqual(response.status_code, 400)

    def test_sign_in_with_no_password(self):
        data = {"email":self.email}
        url = reverse('auth:sign-in')

        response = self.client.post(url, data=data)

        self.assertEqual(response.status_code, 400)

    def test_sign_in_with_bad_email(self):
        data = {"email":self.email[:-1], "password":self.password}
        url = reverse('auth:sign-in')

        response = self.client.post(url, data=data)

        self.assertEqual(response.status_code, 400)

    def test_sign_in_with_empty_email(self):
        data = {"email":"", "password":self.password}
        url = reverse('auth:sign-in')

        response = self.client.post(url, data=data)

        self.assertEqual(response.status_code, 400)

    def test_sign_in_with_no_email(self):
        data = {"password":self.password}
        url = reverse('auth:sign-in')

        response = self.client.post(url, data=data)

        self.assertEqual(response.status_code, 400)

    def test_sign_in_with_no_password_and_no_email(self):
        data = {}
        url = reverse('auth:sign-in')

        response = self.client.post(url, data=data)

        self.assertEqual(response.status_code, 400)

    #--------------------------------------------------------------
    # /test
    #--------------------------------------------------------------
    def test_auth_test_with_good_token(self):
        data = {}
        good_token = self.test_account.access_token
        url = reverse('auth:auth_test')

        response = self.client.get(
            url, 
            data=data,
            content_type='application/json',
            **{'HTTP_AUTHORIZATION': f'Bearer {good_token}'}
        )

        self.assertEqual(response.status_code, 200)

    def test_auth_test_with_no_token(self):
        data = {}
        url = reverse('auth:auth_test')

        response = self.client.get(url, data=data)

        self.assertEqual(response.status_code, 401)

    def test_auth_test_with_bad_token(self):
        data = {}
        bad_token = "hdofuahsfoaushasouhg"
        url = reverse('auth:auth_test')

        response = self.client.get(
            url, 
            data=data,
            content_type='application/json',
            **{'HTTP_AUTHORIZATION': f'Bearer {bad_token}'}
        )

        self.assertEqual(response.status_code, 401)

