from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def remove_background(request, api):
    if request.method == "POST":
        import remove
        return remove.rem(request, api)
    else:
        return JsonResponse({'error': f'GET request forbidden'}, status=500)