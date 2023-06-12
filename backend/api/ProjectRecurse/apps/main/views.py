from django.shortcuts import render

def index(request):
    context = {}
    return render(request, "index.html", context)

def test(request):
    context = {}
    return render(request, "test.html", context)

def reflect(request):
    context = {}
    return render(request, "reflect.html", context)
