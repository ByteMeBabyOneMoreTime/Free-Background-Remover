import io
from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_POST
from PIL import Image
from rembg import remove
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@require_POST
def remove_background(request, api):
    from key.models import Key 
    if Key.objects.filter(key=api).exists():   
        image_file = request.FILES.get('image')
        if not image_file:
            return JsonResponse({'error': 'No image uploaded'}, status=400)

        try:
            # Open the uploaded image
            img = Image.open(image_file)
            
            # Remove the background
            output_img = remove(img)

            # Save the output image to a BytesIO object
            output_io = io.BytesIO()
            output_img.save(output_io, format='PNG')
            output_io.seek(0)

            # Return the image as a response
            response = HttpResponse(output_io, content_type="image/png")
            response['Content-Disposition'] = 'attachment; filename="image_no_bg.png"'
            return response

        except Exception as e:
            return JsonResponse({'error': f'Error processing image: {str(e)}'}, status=500)
    else:
        return JsonResponse({'error': f'Not authorized'}, status=401)