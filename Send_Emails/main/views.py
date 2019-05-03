from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.urls import reverse
import json

def GetJson(request, backbone_dict = {}): #returns the desired dictionary or one explaining the error depending on if it was correct or not
	if request.method == "POST":
		try:
			print(request.body)
			json_dict = json.loads(request.body.decode('utf-8'))
		except:
			return {"error":"incorrectly formatted request"}
		if not json_dict.keys() == backbone_dict.keys():
			return {"error":"missing parameters in request"}
		return json_dict
	return {"error":"incorrect request method"}


def signin(request):
	if request.method == 'POST':
		login_dict = GetJson(request,backbone_dict = {"username":"","password":""})
		print(login_dict)
		if("error" in login_dict):
			login_dict["status"] = "not ok"
			return JsonResponse(login_dict)
		user = authenticate(username=login_dict["username"], password=login_dict["password"])
		if user:
			if user.is_active:
				login(request, user)
				return JsonResponse({"status":"ok"})
			else:
				return JsonResponse({"error":"disabled account","status":"not ok"})
		else:
			return JsonResponse({"error":"Incorrect login details","status":"not ok"})
		
	return render(request,"main/signin.html")

def signout(request):
	logout(request)
	return HttpResponseRedirect(reverse("main:index"))

def logged_in_or_redirect(view_function):
	def wrapper(*args,**kwargs):
		if not args[0].user.is_authenticated:
			return HttpResponseRedirect(reverse("main:signin"))
		return view_function(*args,**kwargs)
	return wrapper

@logged_in_or_redirect	
def index(request):
	return render(request,"main/index.html")
