from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.http import JsonResponse
from PIL import Image
import io
from rembg import remove

@csrf_exempt
def remove_background(request, api):
    if request.method == "POST":
        from key.models import Key
        if Key.objects.filter(key=api).exists():   
            image_file = request.FILES.get('image')
            if not image_file:
                return JsonResponse({'error': 'No image uploaded'}, status=400)
            try:
                img = Image.open(image_file)
                # Remove the background
                output_img = remove(img, model='silueta')

                # Save the output image to a BytesIO object
                output_io = io.BytesIO()
                output_img.save(output_io, format='PNG')
                output_io.seek(0)
                response = HttpResponse(output_io, content_type="image/png")
                response['Content-Disposition'] = 'attachment; filename="image_no_bg.png"'
                return response

            except Exception as e:
                return JsonResponse({'error': f'Error processing image: {str(e)}'}, status=500)
        else:
            return JsonResponse({'error': f'Not authorized'}, status=401)
            # import remove
            # return remove.rem(request, api)
    else:
        return JsonResponse({'error': f'GET request forbidden'}, status=500)