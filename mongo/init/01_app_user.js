const dbName  = process.env.MONGO_DATABASE  || "appdb";
const appUser = process.env.MONGO_APP_USER  || "app_user";
const appPass = process.env.MONGO_APP_PASS  || "change_me";

const dbh = db.getSiblingDB(dbName);

dbh.runCommand({
  createRole: "crdRole",
  privileges: [
    { resource: { db: dbName, collection: "replays" }, actions: [ "find" ,"insert", "remove" ] }
  ],
  roles: []
});

dbh.runCommand({
  createUser: appUser,
  pwd: appPass,
  roles: [ { role: "crdRole", db: dbName } ]
});

// 初期化ログ
print("Created/updated user:", appUser, "on DB:", dbName);
printjson(dbh.getUser(appUser));