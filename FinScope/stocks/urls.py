from django.urls import path
from . import views


urlpatterns = [
    path('hot/', views.hot),
    path('favorites/', views.my_favorites),
    path('detail/<str:name>/', views.detail),
    path('<str:name>/favorite/', views.toggle_favorite),
]
