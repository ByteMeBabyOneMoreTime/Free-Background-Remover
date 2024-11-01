# cython: language_level=3
from django.http import HttpResponse
from PIL import Image
import io
from rembg import remove


def rem(image_file):
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