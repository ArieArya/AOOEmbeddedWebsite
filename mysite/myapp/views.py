from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

# Create your views here.
def index(request):
    return render(request, 'index.html')

def card1(request):
    return render(request, 'card1.html')

def card2(request):
    return render(request, 'card2.html')

def card3(request):
    return render(request, 'card3.html')

