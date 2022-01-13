#!/bin/sh

sleep 2
celery -A tasks worker -B --concurrency=1 --loglevel=info