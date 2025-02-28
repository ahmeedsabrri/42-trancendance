python manage.py makemigrations users chat game 
python manage.py migrate 
python manage.py collectstatic --noinput
python manage.py runserver 0.0.0.0:8000