import pytest
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app


# Test simple de suma
def test_basic_math():
    assert 1 + 1 == 2

# Test de ruta principal
def test_home_page():
    client = app.test_client()
    response = client.get('/')
    assert response.status_code == 200
    assert b"Temporizador Pomodoro" in response.data  # Ajusta según tu texto en Jinja
