import os
from pymongo import MongoClient
from log import log_manager
from contextlib import contextmanager

logger = log_manager.get_logger()

# MongoDBへのアクセスは、必ずPostgreSQL側でトランザクションを開始した後に行うこと。
# この設計ではMongoDBは単一コレクションへの単一ドキュメント操作のみを行うため、
# 原子性はMongoDBの仕様上保証されており、トランザクションは不要とする。

# MongoDB側のエラー発生時には呼び出し元で例外を受け取り、
# PostgreSQLのトランザクションをロールバックする設計であるため、
# このレイヤーではMongoDBのエラーハンドリングを行わない。


class MongoClientWrapper:
    def __init__(self) -> None:

        if (host := os.getenv("MONGO_HOST")) is not None:
            self.host = host
        else:
            raise ValueError("environmental variable MONGO_HOST is not defineded.")

        if (port := os.getenv("MONGO_PORT")) is not None:
            self.port = int(port)
        else:
            raise ValueError("environmental variable MONGO_PORT is not defineded.")

        if (user := os.getenv("MONGO_APP_USER")) is not None:
            self.user = user
        else:
            raise ValueError("environmental variable MONGO_APP_USER is not defineded.")

        if (password := os.getenv("MONGO_APP_PASS")) is not None:
            self.password = password
        else:
            raise ValueError("environmental variable MONGO_APP_PASS is not defineded.")

        if (database := os.getenv("MONGO_DATABASE")) is not None:
            self.database = database
        else:
            raise ValueError("environmental variable MONGO_DATABASE is not defineded.")

        self.client = MongoClient(
            host=self.host, port=self.port, username=self.user, password=self.password
        )
        logger.info("mongodb connected")

    @contextmanager
    def start_session(self):
        # セッションは操作ログとトレースのために使用しており、MongoDBトランザクション制御には用いていない。
        with self.client.start_session() as session:
            logger.info(f"mongodb session is started: {session.session_id}")
            yield session

    def select_collection(self):
        database = self.client[self.database]
        return database["replays"]


mongo = MongoClientWrapper()


class MongoHandler:

    @staticmethod
    def insert_replay(replay_id: str, data: dict):
        with mongo.start_session() as session:
            collection = mongo.select_collection()
            data["_id"] = replay_id
            result = collection.insert_one(data, session=session)

    @staticmethod
    def read_replays(replay_ids: list) -> dict:
        if not replay_ids:
            logger.info("replay_ids is null")
            return {}
        with mongo.start_session() as session:
            replay_ids = [str(rid) for rid in replay_ids]
            collection = mongo.select_collection()
            docs = {
                doc["_id"]: doc
                for doc in collection.find(
                    {"_id": {"$in": replay_ids}}, session=session
                )
            }
            missing_ids = [rid for rid in replay_ids if rid not in docs]
            if missing_ids:
                logger.warning(
                    f"these replay_ids is not found in mongodb: {missing_ids}"
                )

            # ordered_docs = [docs[_id] for _id in replay_ids if _id in docs]
            returning_docs = {}
            for _id in replay_ids:
                if _id in docs:
                    doc = docs[_id].copy()
                    returning_docs[_id] = doc
        return returning_docs

    @staticmethod
    def update_replays(replay_id: str, data: dict):
        # 運用者のみが使用し、システムは使用してはならない
        with mongo.start_session() as session:
            collection = mongo.select_collection()
            result = collection.replace_one(
                {"_id": replay_id}, data, session=session, upsert=False
            )
            if result.matched_count == 0:
                raise ValueError(f"replay_id {replay_id} is not found. Cannot replace.")

    @staticmethod
    def delete_replay(replay_id: str):
        with mongo.start_session() as session:
            collection = mongo.select_collection()
            collection.delete_one({"_id": replay_id})

    @staticmethod
    def select_all_replay_ids() -> list:
        with mongo.start_session() as session:
            collection = mongo.select_collection()
            docs = collection.find({}, {"_id": True})
            return [doc["_id"] for doc in docs]

    @staticmethod
    def delete_replays(replay_ids: list):
        # これはトランザクションを組めてないのに複数件操作していて危険である
        # そのため、バッチ処理で叩く等緊急性が高いわけではない使い方をすること
        # ただしmongodbにはpostgresqlで取得できたリプレイのみを取得しに来る
        with mongo.start_session() as session:
            collection = mongo.select_collection()
            replay_ids = [str(rid) for rid in replay_ids]
            collection.delete_many({"_id": {"$in": replay_ids}})
