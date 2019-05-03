from main import views
from django.urls import path
from django.contrib import admin

app_name="main"
urlpatterns = [
	path("",views.index,name="index"),
	path("signin/",views.signin,name="signin"),
	path("signout/",views.signout,name="signout"),
	path("admin/", admin.site.urls),
]

