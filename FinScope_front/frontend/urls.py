from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('detail/<str:name>', views.detail),
    path('mypage/', views.mypage),
    path('login/', views.login),
    path('sign_up/', views.sign_up),
    path('login-success/', views.login_success),
]
