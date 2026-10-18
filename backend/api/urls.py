from django.urls import path
from .views import api_status, compliance_categories

urlpatterns = [
    path('status/', api_status, name='api_status'),
    path('categories/', compliance_categories, name='compliance_categories'),
]
