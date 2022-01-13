import logging
import argparse
import json
import sys
from processors.processorDictionary import ProcessorDictionary
from interfaces.interfaceDictionary import InterfaceDictionary
from database import Database

logLevel = logging.INFO


parser = argparse.ArgumentParser(exit_on_error=False)
parser.add_argument("--config", help="name of the config file")
parser.add_argument("-m", help="for nothing")
args = parser.parse_args()

config = {}
with open(args.config, 'r') as configFile:
  config = json.load(configFile)

if (('options' in config) and ('logLevel' in config['options'])):
  logLevel = config['options']['logLevel']

logging.basicConfig(format='[%(levelname)s] %(asctime)s : %(message)s', level=logLevel)

logging.info("*"*100)
logging.info("Begin iteration")
logging.info("*"*100)
logging.info(args)

database = Database(config["database"])
database.initDatabase()
input  = InterfaceDictionary.getInstance().getInterface(config["input"])
output = InterfaceDictionary.getInstance().getInterface(config["output"])
processor = ProcessorDictionary.getInstance().getProcessor(config["processor"], input, output)
processor.setDatabase(database)
processor.execute()

logging.info("*"*100)
logging.info("End iteration")
logging.info("*"*100)
