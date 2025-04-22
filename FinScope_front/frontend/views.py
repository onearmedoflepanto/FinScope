from django.shortcuts import render

# Create your views here.

def index(request):
    return render(request, 'index.html')

def detail(request, name):
    return render(request, 'detail.html', {'name' : name})

def login(request):
    return render(request, 'login.html')

def sign_up(request):
    return render(request, 'sign_up.html')

def mypage(request):
    return render(request, 'mypage.html')

def login_success(request):
    return render(request, 'login-success.html')