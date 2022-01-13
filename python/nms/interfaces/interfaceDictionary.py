from .sevOne import SevOne, MockSevOne
from .serviceNow import ServiceNow, MockServiceNow


class InterfaceDictionary(object):
  __instance = None
  __key = object()
  __interfaces = {}

  @classmethod
  def getInstance(cls):
    """ Static access method. """
    if InterfaceDictionary.__instance == None:
      InterfaceDictionary.__instance = InterfaceDictionary(cls.__key)
    return InterfaceDictionary.__instance
   
  def __init__(self, key):
    """ Virtually private constructor. """
    if key != InterfaceDictionary.__key:
     raise Exception("This class is a Singleton!")
    else:
     self.__interfaces = {
       "sevOne"          : (lambda config : SevOne(config)),
       "serviceNow"      : (lambda config : ServiceNow(config)),
       "mock-sevOne"     : (lambda config : MockSevOne(config)),
       "mock-serviceNow" : (lambda config : MockServiceNow(config))
     }

  def getInterface(self, config):
    interface = None
    if config["name"] in self.__interfaces:
      interface = self.__interfaces[config["name"]](config)
    return interface