#!/usr/bin/env bash
# exit on error
set -o errexit

# Change directory into the folder containing manage.py
cd recipeApp

# Now that we are in the correct directory, run the commands
pip install -r requirements.txt
python manage.py migrate