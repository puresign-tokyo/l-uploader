from abc import ABC, abstractmethod

class StageDetail(ABC):
    @abstractmethod
    def convert_to_dict(self) -> dict:
        ...

class ReplayInfo(ABC):
    @abstractmethod
    def convert_to_dict(self) -> dict:
        ...
