from celery import Celery
import subprocess
import json

# Loading configurations
with open('./config/celery.json', 'r') as file:
    config = json.load(file)

app = Celery(config['name'],
             broker=config['broker_url'],
             backend=config['backend_url'])






@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
  for pipeline in config['pipelines']:
    sender.add_periodic_task(pipeline['period'],
                             task.s(pipeline['configFile']),
                             name=pipeline['name'])

@app.task
def task(configFile):
    args = [config['kernel'], "-m", config['app_name'], "--config", configFile]
    subprocess.Popen(args, shell=False)