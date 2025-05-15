from abc import ABC, abstractmethod

class BaseParser(ABC):
    
    @abstractmethod
    def parse(self, replay_binaly: bytes):
        pass