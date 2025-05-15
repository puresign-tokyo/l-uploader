from abc import ABC, abstractmethod

class StageDetails(ABC):
    @abstractmethod
    def convert_to_dict(self):
        pass

class ReplayInfo(ABC):
    @abstractmethod
    def convert_to_dict(self):
        pass
