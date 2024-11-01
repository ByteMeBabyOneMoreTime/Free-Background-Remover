from setuptools import setup, Extension
from Cython.Build import cythonize

extensions = [
    Extension(
        name="remove",
        sources=["remove.pyx"],
    )
]

setup(
    name="remove",
    ext_modules=cythonize("remove.pyx", compiler_directives={'language_level': "3"}),
    options={"build": {"build_base": "cy"}},
    zip_safe=False
)
