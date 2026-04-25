#! /usr/bin/env bash

set -e
set -x

export PYTHONPATH=$PYTHONPATH:.

python -m app.prestart

alembic upgrade head

python -m app.initial_data
