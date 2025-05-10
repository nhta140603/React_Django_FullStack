from rest_framework_simplejwt.authentication import JWTAuthentication

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        accessToken = request.COOKIES.get('accessToken')
        if accessToken:
            try:
                validated_token = self.get_validated_token(accessToken)
                return self.get_user(validated_token), validated_token
            except Exception:
                pass
        return super().authenticate(request)