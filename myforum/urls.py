from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.views.static import serve
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api-auth/', include('rest_framework.urls')),

    # Исключение для manifest.json
    re_path(r'^manifest.json$', serve, {'path': 'manifest.json', 'document_root': settings.BASE_DIR / 'public'}),

    # Исключение для favicon.ico (если нужно)
    re_path(r'^favicon.ico$', serve, {'path': 'favicon.ico', 'document_root': settings.BASE_DIR / 'public'}),

    # Все остальные запросы направляются на index.html
    re_path(r'^(?:.*)/?$', TemplateView.as_view(template_name="index.html")),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

