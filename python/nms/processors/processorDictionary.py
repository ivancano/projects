from .alertProcessor import AlertProcessor



class ProcessorDictionary(object):
  __instance = None
  __key = object()
  __processors = {}

  @classmethod
  def getInstance(cls):
    """ Static access method. """
    if ProcessorDictionary.__instance == None:
      ProcessorDictionary.__instance = ProcessorDictionary(cls.__key)
    return ProcessorDictionary.__instance
   
  def __init__(self, key):
    """ Virtually private constructor. """
    if key != ProcessorDictionary.__key:
     raise Exception("This class is a Singleton!")
    else:
     self.__processors = {
       "alert"     : (lambda config, input, output : AlertProcessor(config, input, output))
     }

  def getProcessor(self, config, input, output):
    processor = None
    if config["name"] in self.__processors:
      processor = self.__processors[config["name"]](config, input, output)
    return processor