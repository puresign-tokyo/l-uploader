#!/usr/local/bin/python
# coding:utf-8
#!C:\Python24\python.exe


###############################################################################
# 黄昏酒場スコアボード
# The Uwabami Breakers Scoreboard
# 
# Author: 
#    待宵 (http://score.royalflare.net/)
# Version:
#    1.00
#
###############################################################################


import os
import sys
import cgi
import time
import string
import functools
import logging
from asyncio import Lock
# import md5
# import datetime

import app.src.ALCOReplay as ALCOReplay
# import rss10
import backend.src.blacklist as blacklist

_lock = Lock()
logging.basicConfig()
logger = logging.getLogger(__name__)

###############################################################################
# 設定
###############################################################################
# マスターパスワード。この値は必ず変更してください。
# _adminPass = "changeme"
# HTMLのfooterに表示する文字列
# 静的ページ（index.html, upload10.html）のfooterは手動で修正してください。
# _htmlFooter = "黄昏酒場スコアボード"
# # 設置アドレス。RSSの生成で使います。
# # index.htmlの存在するディレクトリで指定します。
# # 例：http://example.com/cgi-bin/th10score/
# _address = "http://example.com/cgi-bin/th10score/"

###############################################################################
# その他設定。特に変更の必要はありません。
###############################################################################
# RSSのファイル名
# ""（空白）を指定すると出力されません。
# 例： 
#    # 出力しない場合
#    _rssNew = ""
# 以下、他の出力ファイル(_htmlNew, _htmlScore, _htmlLevel, _htmlLevelChar)も
# 同様に指定可能です。
# _rssNewを変更した場合は、index.htmlの以下の部分も手動で変更してください。
#<link rel="alternate" type="application/rss+xml" title="RSS" href="new10.rdf">
# _rssNew = "newalco.rdf"
# 新着順のhtmlファイル名
_STATIC_HTML_NEW = "newalco.html"
# 総合スコア順のhtmlファイル名
_STATIC_HTML_SCORE = "scorealco.html"
# リプレイファイルのサイズ上限。単位はkb
_MAX_REPLAY_SIZE = 200
# データファイル名
# _dataFileName = "alcodata.cgi"
# Lock用のディレクトリ名
_lockDir = "lockalco"
# リプレイファイルの保存パス
_REPLAY_DIR = "replayalco"
# 一時保存ファイル名
_TEMP_FILE_NAME = os.path.join(_REPLAY_DIR, "tmp.dat")
# lock強制解除までの時間。単位は「秒」
_lockTimeLimit = 600
# RSSの対象件数
# _rssTargetCount = 50
# 登録ログファイルのファイル名
# ""（空白）を指定すると出力されません。
# uploadLog = "alcouploadlog.cgi"
# 処理落ち率の許容値。単位は%。
# この値を超えた処理落ち率のリプレイは、別扱いで順位付けされます。
_DROP_LIMIT = 3.00
# ゲーム本体の現在の最新バージョン番号
# このバージョンより古いリプレイは新規登録できません。
# 既に登録済みの場合は、参考記録として処理落ちリプレイと同様の扱いとなります。
_CURRENT_GAME_VERSION = "1.00a"
#_currentGameVer = "0"
# 新着一覧での1ページの表示件数
_PAGE_LOG = 20


###############################################################################
# html parts
###############################################################################
HTTP_HEAD = "content-type: text/html; charset=utf-8\r\n\r\n"

HTML_HEAD = '''<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ja" lang="ja">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="Content-Style-Type" content="text/css" />
    <link rel="stylesheet" type="text/css" href="./stylealco.css" media="screen,print" title="alco" />
    {page_tag}
    <title>黄昏酒場スコアボード - {page_name}</title>
</head>
<body>

<div class="title">
    <h1><a id="top" name="top">黄昏酒場スコアボード</a></h1>
</div>
<div class="navi">
    <a href="/">Index</a> &gt;&gt; <a href="./">黄昏酒場スコアボード</a> &gt;&gt; {page_name}
</div>
<div class="docbody">
<h2>{page_name}</h2>
'''

# LINK_RSS = '<link rel="alternate" type="application/rss+xml" title="RSS" href="%s">' % _rssNew
# if len(_rssNew) == 0:
#     LINK_RSS = ""

JS_DELETE = '<script type="text/javascript" src="deletealco.js" charset="utf-8"></script>'

HTML_FOOT = '''
</div>
<div class="footer">
</div>
</body>
</html>
'''

NAVI_ABOVE = '''
<div class="pageNavi"><a href="#top">↑Above</a></div>
'''

TABLE_HEAD = '''
<table>
    <colgroup>
        <col class="colRank" />
        <col class="colVer" />
        <col class="colScore" />
        <col class="colDrop" />
        <col class="colDate" />
        <col class="colName" />
        <col class="colComment" />
        <col class="colReplay" />
    </colgroup>
    <tr>
        <th>順位</th>
        <th>Ver</th>
        <th>スコア</th>
        <th>処理落率</th>
        <th>プレイ日付</th>
        <th>名前</th>
        <th>コメント</th>
        <th>リプレイ</th>
    </tr>
'''

TABLE_BODY = '''
    <tr>
        <td>%s</td>
        <td>%s</td>
        <td>%s</td>
        <td>%s%%</td>
        <td>%s</td>
        <td>%s</td>
        <td>%s</td>
        <td>
            <a href="%s">%s</a>
            <a href="./alcoscore.cgi?task=delcheck&amp;id=%s">Del</a>
        </td>
    </tr>
'''

TABLE_BODY_SLOW = '''
    <tr class="slowReplay">
        <td>%s</td>
        <td>%s</td>
        <td>%s</td>
        <td><span class="slowDrop">%s%%</span></td>
        <td>%s</td>
        <td>%s</td>
        <td>%s</td>
        <td>
            <a href="%s">%s</a>
            <a href="./alcoscore.cgi?task=delcheck&amp;id=%s">Del</a>
        </td>
    </tr>
'''

TABLE_BODY_OLDVER = '''
    <tr class="oldReplay">
        <td>%s</td>
        <td><span class="oldVer">%s</span></td>
        <td>%s</td>
        <td>%s%%</td>
        <td>%s</td>
        <td>%s</td>
        <td>%s</td>
        <td>
            <a href="%s">%s</a>
            <a href="./alcoscore.cgi?task=delcheck&amp;id=%s">Del</a>
        </td>
    </tr>
'''

TABLE_FOOT = '''
</table>
'''

###############################################################################
# メッセージ
###############################################################################
MESSAGES = {
    "upload.ok" : "登録が正常に完了しました。",
    "delete.ok" : "削除が正常に完了しました。",
    "name.noinput" : "名前を入力してください。",
    "name.over" : "名前が長すぎます。",
    "replay.noinput" : "リプレイファイルを指定してください。",
    "replay.invalid" : "不正なリプレイファイルです。",
    "replay.over" : "リプレイファイルが大きすぎます。",
    "replay.length.notexist" : "Content-Lengthが読み取れませんでした。別のブラウザで登録を試してください。",
    "replay.version.invalid" : "リプレイのバージョンが古すぎます。",
    "comment.noinput" : "コメントを入力してください。",
    "comment.over" : "コメントが長すぎます。",
    "busy" : "ただいま大変混み合っています。時間をおいて再度登録を実行してください。",
    "passwd.noinput" : "削除キーを入力してください。",
    "passwd.over" : "削除キーが長すぎます。",
    "passwd.missmatch" : "削除キーが一致しません。" ,
    "invalidcall" : "不正な呼び出しです。",
    "back" : "ブラウザの戻るボタンで戻ってください。",
    "nodata" : "登録データがありません。",
    "startDate.invalid" : "開始日時を正しく入力してください。",
    "endDate.invalid" : "終了日時を正しく入力してください。",
    "blacklist" : "貴方のIPからのアクセスは許可されません。Access from your IP address is not permitted."
}





###############################################################################
# funcs
###############################################################################

def get_lock(func):
  @functools.wraps(func)
  def _wrapper(func, *args, **kwargs):
    with _lock:
      return func(*args, **kwargs)
  return _wrapper

def dirLock():
    """ mkdirでLock実行 """
    try:
        os.mkdir(_lockDir)
        return True
    except:
        return False

def doLock():
    """ Lock実行。混んでる場合はすぐにあきらめる
        ただし、_lockDirの作成から_lockTimeLimit秒以上経過していたら、
        強制的にunLock実行後、再度Lockを試みる 
    """
    if not dirLock():
        # 現在時刻
        t = time.time()
        # 更新時刻
        m = os.path.getmtime(_lockDir)
        # 指定秒数以上経過していたら強制的に削除
        if m < (t-_lockTimeLimit):
            # datをバックアップ
            backupDat(t)
            # 強制unLock
            unLock()
            # 再度lockを試みて、結果を返す
            return dirLock()
        else:
            # lockが新しければ常にFalse
            return False
    return True

def backupDat(currentTime):
    """ 強制unLock時にdatをバックアップ """
    fin = None
    fout = None
    try:
        fin = open(_dataFileName, "r")
        fout = open(_dataFileName + "-" + \
            getCurrentTimestampForFilename() + ".cgi", "w")
        fout.write(fin.read())
    finally:
        if fin:
            fin.close()
        if fout:
            fout.close()

def unLock():
    """ Lock解除 """
    os.rmdir(_lockDir)

def saveTemp(request):
    """ アップロードファイルの一時保存
        入力チェックは事前に済ませておくこと。
        return 0:成功 1:サイズオーバー 2:不正なリプレイ
    """
    if not os.path.exists(_replayDir):
        os.mkdir(_replayDir)
    
    fileArg = request["replay"]
    retCode = 0
    try:
        buf = ""
        fout = open(_tempFileName, "wb")
        count = 0
        while(True):
            buf = fileArg.file.read(1024)
            if not buf:
                break
            # 初回はヘッダチェック
            if count == 0:
                if len(buf) <= 4:
                    retCode = 2
                    break
                if not buf[0:4] == "al1r":
                    retCode = 2
                    break
            fout.write(buf)
            count += 1
            if count > _maxReplaySize:
                retCode = 1
                break
        if count == 0:
            retCode = 2
    finally:
        if fout:
            fout.close()
    return retCode

def escapeHtml(s):
    """ htmlエスケープ """
    s = string.replace(s, "\t", "    ")
    s = string.replace(s, "&", "&amp;")
    s = string.replace(s, "\"", "&quot;")
    s = string.replace(s, "<", "&lt;")
    s = string.replace(s, ">", "&gt;")
    s = string.replace(s, "\r", "")
    s = string.replace(s, "\n", "<br />")
    return s

def zeroSup(s):
    """ 10桁になるよう前方を0埋め """
    while len(s) < 10:
        s = "0" + s
    return s

def addComma(s):
    """ スコアの3桁ごとにカンマを追加 """
    index = 1
    slen = len(s)
    ret = ""
    while index <= slen:
        ret = s[slen-index] + ret
        if index % 3 == 0 and index != slen:
            ret = "," + ret
        index += 1
    return ret

def getDigest(passwd):
    """ 指定されたパスワードのhashを取得 """
    return md5.new(passwd).hexdigest()

def getCurrentTimestamp():
    """ 現在時刻のタイムスタンプ取得。 YYYY/MM/DD HH24:MI:SS """
    tm = time.localtime(time.time())
    return time.strftime("%Y/%m/%d %H:%M:%S", tm)

def getCurrentTimestampForFilename():
    """ 現在時刻のタイムスタンプ取得。 YYYYMMDDHH24MISS """
    tm = time.localtime(time.time())
    return time.strftime("%Y%m%d%H%M%S", tm)

# 
def trimNull(s):
    """ 末尾の0x00を削除 """
    while(True):
        if(len(s) > 0):
            if(s[-1] == "\x00"):
                s = s[:-1]
            else:
                break
        else:
            break
    return s

class DataFile:
    """ データファイルを表現するクラス """
    def __init__(self):
        self.dataDict = {}
        self.dataKeys = []
        if os.path.exists(_dataFileName):
            fin = None
            try:
                fin = open(_dataFileName, "r")
                line = None
                while(True):
                    line = fin.readline()
                    if not line:
                        break
                    repInfo = ReplayInfo()
                    repInfo.loadDataInfo(string.strip(line))
                    self.dataDict[repInfo.getDataId()] = repInfo
            finally:
                if fin:
                    fin.close()
        self.dataKeys = self.dataDict.keys()
    
    def keys(self):
        """ dataIdの配列を取得。
            ソート順は直前に呼ばれたsortメソッドの種類に準ずる
        """
        return self.dataKeys
    
    def sortNew(self):
        """ キーを新着順にソート """
        self.dataKeys = self.dataDict.keys()
        self.dataKeys.sort()
        self.dataKeys.reverse()
    
    def sortScore(self):
        """ キーをスコアの高い順にソート """
        self.dataKeys = self.dataDict.keys()
        kk = []
        for key in self.dataKeys:
            kk.append(zeroSup(self.dataDict[key].getScore()) + "\t" + key)
        kk.sort()
        kk.reverse()
        self.dataKeys = []
        for k in kk:
            self.dataKeys.append(string.split(k, "\t")[1])
    
    def getAllData(self):
        """ 全てのデータをReplayInfoの配列で取得
            ソート順は直前に呼ばれたsortメソッドの種類に準ずる
        """
        ret = []
        for key in self.dataKeys:
            ret.append(self.dataDict[key])
        return ret
    
    def getPartData(self):
        """ データをReplayInfoの配列で取得
            ソート順は直前に呼ばれたsortメソッドの種類に準ずる。
        """
        ret = []
        for key in self.dataKeys:
            ret.append(self.dataDict[key])
        return ret
    
    def getNextDataId(self):
        """ 次のIDを取得。形式は10進数値で、10桁の文字列型。 """
        index = 0
        if len(self.dataDict.keys()) == 0:
            return zeroSup("0")
        self.sortNew()
        current = self.dataDict[self.dataKeys[0]].getDataId()
        return zeroSup(str(int(current) + 1))
    
    def add(self, replayInfo):
        """ リプレイを追加 """
        self.dataDict[replayInfo.getDataId()] = replayInfo
    
    def get(self, dataId):
        """ 指定されたIdのリプレイ情報を取得 """
        return self.dataDict[dataId]
    
    def remove(self, dataId):
        """ リプレイを削除 """
        self.dataDict.pop(dataId)
    
    def replace(self):
        """ 現在の内容でデータファイルを更新 """
        fout = None
        try:
            fout = open(_dataFileName + ".tmp.cgi", "w")
            self.sortNew()
            for key in self.dataKeys:
                fout.write(self.dataDict[key].getDataLine() + "\n")
        finally:
            if fout:
                fout.close()
        
        # バックアップ削除
        if os.path.exists(_dataFileName + ".old.cgi"):
            os.remove(_dataFileName + ".old.cgi")
        # 現在のデータファイルを待避
        if os.path.exists(_dataFileName):
            os.rename(_dataFileName, _dataFileName + ".old.cgi")
        # データファイル作成
        os.rename(_dataFileName + ".tmp.cgi", _dataFileName)


class ReplayInfo:
    """ replayを表現するクラス """
    def __init__(self):
        # 10進の連番ID。10桁に0埋めされた文字列型
        self.dataId = ""
        # リプレイファイルのプレイ日付
        self.date = ""
        # リプレイファイルのプレイヤー名
        self.player = ""
        # スコア
        self.score = ""
        # version
        self.version = ""
        # 処理落ち率
        self.drop = ""
        # コメント
        self.comment = ""
        # アップロード日付 yyyy-mm-dd hh24:mi:ss
        self.uploadDate = ""
        # パスワードのdigest
        self.passwd = ""
        # プレイヤーの名前
        self.name = ""
    
    def loadFileInfo(self, filepath):
        """ リプレイファイルから情報を読み取る
            return: 取得に失敗した場合False
        """
        info = ALCOReplay.ALCOReplay_getReplayFileInfo(filepath)
        self.date = escapeHtml(trimNull(info[2]))
        self.player = escapeHtml(trimNull(info[1]))
        self.score = escapeHtml(trimNull(info[4]))
        self.version = escapeHtml(trimNull(info[0]))
        self.drop = escapeHtml(trimNull(info[5]))
        if(len(self.version) > 0):
            return True
        else:
            return False
    
    def loadDataInfo(self, line):
        """ データ行から情報を読み取る """
        info = string.split(line, "\t")
        self.dataId = info[0]
        self.date = info[1]
        self.player = info[2]
        self.score = info[3]
        self.version = info[4]
        self.drop = info[5]
        self.name = info[6]
        self.comment = info[7]
        self.uploadDate = info[8]
        self.passwd = info[9]
    
    def getDataLine(self):
        """ 自身の内容からデータファイルの1行分を生成 """
        buf = "%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s"
        return buf % ( \
            self.dataId, \
            self.date, \
            self.player, \
            self.score, \
            self.version, \
            self.drop, \
            self.name, \
            self.comment, \
            self.uploadDate, \
            self.passwd)
    
    def getRssTitle(self):
        """ 自身の内容からRSSのTitleを生成 """
        return "%s %s %s" % ( \
            self.uploadDate, \
            self.name, \
            addComma(self.score) )
    
    def getRssLink(self):
        """ 自身の内容からRSSのLinkを生成 """
        return "%s%s/%s" % ( \
            _address, \
            _replayDir, \
            self.getReplayFileName())
    
    def getRssDescription(self):
        """ rss用の情報を取得 """
        buf = '''
登録日：%s
名前：%s
スコア：%s
処理落ち率:%s%%
プレイ日付：%s
コメント：%s
'''
        return buf % (\
            self.uploadDate, \
            self.name, \
            addComma(self.score), \
            self.drop, \
            self.date, \
            string.replace(self.comment, "<br />", "\r\n"))
    
    def getReplayFileName(self):
        """ 10進数値からリプレイファイル名を取得
            4桁の16進文字列をIDとし、alco_udxxxx.rpyの形式
        """
        s = hex(int(self.dataId))[2:]
        while( len(s) < 4 ):
            s = "0" + s
        return "alco_ud" + s + ".rpy"
    
    def getDataId(self):
        return self.dataId
    def setDataId(self, dataId):
        self.dataId = dataId
    
    def getDate(self):
        return self.date
    def setDate(self, date):
        self.date = date
    
    def getPlayer(self):
        return self.player
    def setPlayer(self, player):
        self.player = player
    
    def getScore(self):
        return self.score
    def setScore(self, score):
        self.score = score
    
    def getVersion(self):
        return self.version
    def setVersion(self, version):
        self.version = version
    
    def getDrop(self):
        return self.drop
    def setDrop(self, drop):
        self.drop = drop
    
    def getComment(self):
        return self.comment
    def setComment(self, comment):
        self.comment = comment
    
    def getUploadDate(self):
        return self.uploadDate
    def setUploadDate(self, uploadDate):
        self.uploadDate = uploadDate
    
    def getPasswd(self):
        return self.passwd
    def setPasswd(self, passwd):
        self.passwd = passwd
    
    def getName(self):
        return self.name
    def setName(self, name):
        self.name = name

def writeHtml(dataFile):
    """ 表示用HTMLの生成 """
    if len(_htmlNew) > 0:
        writeHtmlNew(dataFile)
    if len(_htmlScore) > 0:
        writeHtmlScore(dataFile)
    if len(_rssNew) > 0:
        writeRSS(dataFile)

def isSlowReplay(replayInfo):
    """ 処理落ちチェック。処理落ち率が_dropLimitを超えている場合はTrue """
    if float(replayInfo.getDrop()) > _dropLimit:
        return True
    else:
        return False

def isOldReplay(replayInfo):
    """ バージョンチェック。バージョンが_currentGameVerより小さい場合はTrue """
    if replayInfo.getVersion() < _currentGameVer:
        return True
    else:
        return False

def writeTableItem(fout, replayInfo, ranking, isSlow=False):
    """ リプレイ1行分のテーブルアイテムを出力 """
    upd = replayInfo.getUploadDate()
    upd = upd[0:string.find(upd, " ")]
    row = TABLE_BODY
    if isSlowReplay(replayInfo):
        row = TABLE_BODY_SLOW
    if isOldReplay(replayInfo):
        row = TABLE_BODY_OLDVER
    fout.write(row % ( \
        ranking, \
        replayInfo.getVersion(), \
        addComma(replayInfo.getScore()), \
        replayInfo.getDrop(), \
        replayInfo.getDate(), \
        replayInfo.getName(), \
        replayInfo.getComment(), \
        _replayDir + "/" + replayInfo.getReplayFileName(), \
        upd, \
        replayInfo.getDataId() \
    ))

def writeRSS(dataFile):
    """ 表示用HTMLの生成 新着順RSS """
    fout = None
    try:
        fout = open(_rssNew + ".tmp", "w")
        rss = rss10.RSS10(\
            _address + _rssNew, \
            "黄昏酒場スコアボード", \
            _address, \
            "黄昏酒場のスコアボードです" \
            )
        
        dataFile.sortNew()
        keys = dataFile.keys()
        
        if len(keys) == 0:
            rss.addLi([\
                _address + _htmlLevelChar, \
                MESSAGES["nodata"],
                _address + _htmlLevelChar, \
                MESSAGES["nodata"] \
                ])
        else:
            itemCount = 0
            for key in keys:
                rep = dataFile.get(key)
                rss.addLi([\
                    rep.getRssLink(), \
                    rep.getRssTitle(),\
                    rep.getRssLink(), \
                    rep.getRssDescription()])
                itemCount += 1
                if itemCount >= _rssTargetCount:
                    break
        fout.write(rss.getRSS())
    finally:
        if fout:
            fout.close()
    if os.path.exists(_rssNew):
        os.remove(_rssNew)
    os.rename(_rssNew + ".tmp", _rssNew)

def writeHtmlNew(dataFile):
    """ 表示用HTMLの生成 新着順一覧 """
    fout = None
    fileNameDef = _htmlNew
    dataFile.sortNew()
    keys = dataFile.keys()
    dataCount = len(keys)
    maxPage = dataCount / _pageLog
    if dataCount % _pageLog != 0:
        maxPage += 1
    if dataCount == 0:
        maxPage = 1
    over10 = False
    if maxPage > 10:
        maxPage = 10
        over10 = True
    # 0をALLとして扱うため、0から開始してmaxPage+1回ループする
    for i in range(maxPage+1):
        # 出力するページのファイル名
        pageFileName = getPageFileName(fileNameDef, i)
        try:
            fout = open(pageFileName + ".tmp", "w")
            fout.write(HTML_HEAD % (LINK_RSS, "新着順一覧", "新着順一覧", "新着順一覧"))
            if len(keys) == 0:
                fout.write("<p>" + MESSAGES["nodata"] + "</p>\n")
            else:
                fout.write(createPagingLinks(i, maxPage, fileNameDef, over10))
                fout.write(TABLE_HEAD)
                index = 0
                for key in keys:
                    if i == 0 or \
                        ((i-1)*_pageLog <= index and index < (i)*_pageLog):
                        rep = dataFile.get(key)
                        writeTableItem(fout, rep, "-")
                    index += 1
                fout.write(TABLE_FOOT)
                fout.write(NAVI_ABOVE)
            fout.write(HTML_FOOT)
        finally:
            if fout:
                fout.close()
        if os.path.exists(pageFileName):
            os.remove(pageFileName)
        os.rename(pageFileName + ".tmp", pageFileName)

def createPagingLinks(pageNo, maxPage, fileNameDef, over10):
    """ ページングリンクを生成して返す。
        pageNoが0の場合はALLと見なす。
    """
    # all出力
    buf = '<div class="pagingLinks">\n'
    if pageNo == 0:
        buf += '<span class="current">[ALL]</span>\n'
    else:
        buf += '<a href="%s">[ALL]</a>\n' % getPageFileName(fileNameDef, 0)
    # 各ページ出力
    for i in range(maxPage):
        if (i+1) == pageNo:
            buf += '<span class="current">[%s]</span>\n' % str(i+1)
        else:
            buf += '<a href="%s">[%s]</a>\n' % (\
                    getPageFileName(fileNameDef, i+1), i+1)
    if over10:
        buf += '<a href="%s">[more...]</a>\n' % getPageFileName(fileNameDef, 0)
    buf += '</div>\n'
    return buf

def getPageFileName(fileNameDef, pageNo):
    """ 指定されたfileNameDefにページ番号を付与する。
        例えばnew10.html, 3 なら、new10-3.htmlの形式で返す。
        pageNoが0の場合は、ALLとみなしてnew10-all.htmlの形式で返す
        pageNoが1の場合は、fileNameDefをそのまま返す。
    """
    if pageNo == 0:
        return fileNameDef[0:-5] + "-all" + ".html"
    elif pageNo == 1:
        return fileNameDef
    else:
        return fileNameDef[0:-5] + "-" + str(pageNo) + ".html"

def writeHtmlScore(dataFile):
    """ 表示用HTMLの生成 スコア順一覧 """
    fout = None
    fileNameDef = _htmlScore
    dataFile.sortScore()
    keys = dataFile.keys()
    dataCount = len(keys)
    maxPage = dataCount / _pageLog
    if dataCount % _pageLog != 0:
        maxPage += 1
    if dataCount == 0:
        maxPage = 1
    over10 = False
    if maxPage > 10:
        maxPage = 10
        over10 = True
    # 0をALLとして扱うため、0から開始してmaxPage+1回ループする
    for i in range(maxPage+1):
        # 出力するページのファイル名
        pageFileName = getPageFileName(fileNameDef, i)
        try:
            fout = open(pageFileName + ".tmp", "w")
            fout.write(HTML_HEAD % (LINK_RSS, "スコア順一覧", "スコア順一覧", "スコア順一覧"))
            
            if len(keys) == 0:
                fout.write("<p>" + MESSAGES["nodata"] + "</p>\n")
            else:
                fout.write(createPagingLinks(i, maxPage, fileNameDef, over10))
                fout.write(TABLE_HEAD)
                index = 0
                # 処理落ちデータ用の待避領域
                drops = []
                for key in keys:
                    rep = dataFile.get(key)
                    if isSlowReplay(rep) or isOldReplay(rep):
                        drops.append(rep)
                        index -= 1
                    else:
                        if i == 0 or \
                            ((i-1)*_pageLog <= index and index < (i)*_pageLog):
                            writeTableItem(fout, rep, index+1)
                    index += 1
                # 処理落ちデータ出力
                for rep in drops:
                    if i == 0 or \
                        ((i-1)*_pageLog <= index and index < (i)*_pageLog):
                        writeTableItem(fout, rep, index+1)
                    index += 1
                fout.write(TABLE_FOOT)
                fout.write(NAVI_ABOVE)
            fout.write(HTML_FOOT)
        finally:
            if fout:
                fout.close()
        if os.path.exists(pageFileName):
            os.remove(pageFileName)
        os.rename(pageFileName + ".tmp", pageFileName)


def inputCheck(request):
    """ パラメータのチェックを実行する。
        エラーがある場合はメッセージを配列に格納して返す
    """
    message = []
    task = ""
    name = ""
    comment = ""
    passwd = ""
    dataId = ""
    year = ""
    month = ""
    day = ""
    drop = ""
    
    # 不正な呼び出し
    if request.has_key("task"):
        task = request["task"].value
    else:
        message.append(MESSAGES["invalidcall"])
        return message
    
    # 新規登録の場合
    if task == "upload":
        # 名前
        if request.has_key("name") and len(request["name"].value) > 0:
            name = request["name"].value
            if len(name) > 50:
                message.append(MESSAGES["name.over"])
        else:
            message.append(MESSAGES["name.noinput"])
        
        # パスワード
        if request.has_key("passwd") and len(request["passwd"].value) > 0:
            passwd = request["passwd"].value
            if len(passwd) > 20:
                message.append(MESSAGES["passwd.over"])
        else:
            message.append(MESSAGES["passwd.noinput"])
        
        # コメント
        if request.has_key("comment") and len(request["comment"].value) > 0:
            comment = request["comment"].value
            if len(comment) > 600:
                message.append(MESSAGES["comment.over"])
        else:
            message.append(MESSAGES["comment.noinput"])
        
        # リプレイファイル
        if request.has_key("replay"):
            item = request["replay"]
            if item.file and len(item.filename) > 0 :
                #ok
                pass
            else:
                message.append(MESSAGES["replay.noinput"])
        else:
            message.append("aaa" +MESSAGES["replay.noinput"])
    # 削除の場合
    elif task == "delete":
        
        if request.has_key("id") and len(request["id"].value) > 0:
            dataId = request["id"].value
        else:
            message.append(MESSAGES["invalidcall"])
            return message
        
        if request.has_key("passwd") and len(request["passwd"].value) > 0:
            passwd = request["passwd"].value
        else:
            message.append(MESSAGES["passwd.noinput"])
    # 削除確認の場合
    elif task == "delcheck":
        if request.has_key("id") and len(request["id"].value) > 0:
            dataId = request["id"].value
        else:
            message.append(MESSAGES["invalidcall"])
            return message
    # 不正な呼び出し
    else:
        message.append(MESSAGES["invalidcall"])
    
    return message

def showErrorAndExit(message):
    """ エラーメッセージを表示して終了 """
    sys.stdout.write(HTTP_HEAD)
    print HTML_HEAD % ("", "入力エラー", "入力エラー", "入力エラー")
    for mes in message:
        print "<p>%s</p>" % mes
    print "<div class=\"pageNavi\">%s</div>" % MESSAGES["back"]
    print HTML_FOOT
    sys.exit(0)

# @get_lock
def doUpload(request):
    """ 新規登録処理 """
    message = []
    
    player = "-"
    name = request["name"].value
    comment = request["comment"].value
    passwd = request["passwd"].value
    
    isLocked = False
    try:
        with _lock:
            # アップロード実行
            retCode = saveTemp(request)
            if retCode == 1:
                # サイズオーバー
                logger.error("invalid request: replay size over.")
                message.append(MESSAGES["replay.over"])
            elif retCode == 2:
                # 不正なリプレイ
                sys.stderr.write("invalid request: invalid replay header.")
                message.append(MESSAGES["replay.invalid"])
            else:
                rep = ReplayInfo()
                # リプレイファイルから情報取得
                if not rep.loadFileInfo(_tempFileName):
                    sys.stderr.write(\
                        "invalid request: can't parse replay info.")
                    # リプレイファイルが不正な場合はエラー
                    message.append(MESSAGES["replay.invalid"])
                elif isOldReplay(rep):
                    # 規定のversionより新しい物のみ許可
                    message.append(MESSAGES["replay.version.invalid"])
                else:
                    # データファイル更新
                    dataFile = DataFile()
                    rep.setDataId(dataFile.getNextDataId())
                    rep.setName(escapeHtml(name))
                    rep.setComment(escapeHtml(comment))
                    rep.setUploadDate(getCurrentTimestamp())
                    rep.setPasswd(getDigest(passwd))
                    rep.setDate(rep.getDate())
                    dataFile.add(rep)
                    dataFile.replace()
                    
                    # replay保存
                    os.rename(\
                        _tempFileName, \
                        os.path.join(_replayDir, rep.getReplayFileName()) )
                    
                    # html生成
                    writeHtml(dataFile)
                    
                    # ログ出力
                    writeLog(rep.getUploadDate(), rep.getName())
        else:
            # 混んでて登録できない
            sys.stderr.write("invalid request: busy. lock file was detected.")
            message.append(MESSAGES["busy"])
    finally:
        if isLocked:
            unLock()
    
    # エラーがある場合はここで終了
    if len(message) > 0:
        showErrorAndExit(message)
    
    # 出力
    sys.stdout.write(HTTP_HEAD)
    cookieTag = '''<script type="text/javascript" charset="utf-8">
    //<!--
    tmp = "alcon=" + escape("%s") + ";";
    tmp += "expires=Tue, 31-Dec-2030 23:59:59; ";
    document.cookie = tmp;
    tmp = "alcop=" + escape("%s") + ";";
    tmp += "expires=Tue, 31-Dec-2030 23:59:59; ";
    document.cookie = tmp;
    -->
</script>
''' % ( string.replace(name, '"', '\\"'), string.replace(passwd, '"', '\\"'))
    cookieDelTag = '''<script type="text/javascript" charset="utf-8">
    //<!--
    tmp = "alcon=deleted;";
    tmp += "expires=Tue, 1-Jan-1980 00:00:00;";
    document.cookie = tmp;
    tmp = "alcop=deleted;";
    tmp += "expires=Tue, 1-Jan-1980 00:00:00;";
    document.cookie = tmp;
    -->
</script>
'''
    if request.has_key("savePass"):
        print HTML_HEAD % (\
            cookieTag, "新規スコア登録", "新規スコア登録", "新規スコア登録")
    else:
        print HTML_HEAD % (\
            cookieDelTag, "新規スコア登録", "新規スコア登録", "新規スコア登録")
    print "<p>" + MESSAGES["upload.ok"] + "</p>"
    print HTML_FOOT

def doDelCheck(request):
    """ 削除情報入力画面 """
    dataId = request["id"].value
    # 結果出力
    sys.stdout.write(HTTP_HEAD)
    print HTML_HEAD % (JS_DELETE, "削除", "削除", "削除")
    rep = ReplayInfo()
    rep.setDataId(dataId)
    fname = rep.getReplayFileName()
    out = '''<form name="fm" action="./alcoscore.cgi" method="post">
<p>%s を削除します。</p>
<p>
<span class="lang-ja">削除キー</span> <span class="lang-en">Delete key</span>：<input type="password" name="passwd" value="" />
<input type="submit" name="sub" value="削除実行 Do delete" / >
<input type="hidden" name="id" value="%s" />
<input type="hidden" name="task" value="delete" />
</p>
</form>
'''
    print out % (fname, dataId)
    print HTML_FOOT

def doDelete(request):
    """ 削除実行 """
    message = []
    dataId = request["id"].value
    passwd = request["passwd"].value
    isLocked = False
    try:
        # lock実行
        isLocked = doLock()
        if isLocked:
            # データファイル読み込み
            dataFile = DataFile()
            keys = dataFile.keys()
            if keys.count(dataId) > 0:
                rep = dataFile.get(dataId)
                # pass check
                if rep.getPasswd() == getDigest(passwd) or \
                        passwd == _adminPass:
                    
                    # replay削除
                    if os.path.exists(os.path.join(\
                        _replayDir, rep.getReplayFileName())):
                        os.remove(\
                            os.path.join(_replayDir, rep.getReplayFileName()))
                    
                    # データファイル更新
                    dataFile.remove(rep.getDataId())
                    dataFile.replace()
                    
                    # html生成
                    writeHtml(dataFile)
                else:
                    # パスワードが一致しない
                    message.append(MESSAGES["passwd.missmatch"])
            else:
                # idが存在しない
                message.append(MESSAGES["invalidcall"])
        else:
            # 混んでて登録できない
            message.append(MESSAGES["busy"])
    finally:
        if isLocked:
            unLock()
    
    # エラーがある場合はここで終了
    if len(message) > 0:
        showErrorAndExit(message)
    
    # 結果出力
    sys.stdout.write(HTTP_HEAD)
    print HTML_HEAD % ("", "削除", "削除", "削除")
    print "<p>%s</p>" % MESSAGES["delete.ok"]
    print HTML_FOOT


def writeLog(timestamp, name):
    """ 登録名とIPをログに書き出す """
    # 不要な場合は出力しない
    if len(uploadLog) == 0:
        return
    fout = None
    try:
        fout = open(uploadLog, "a")
        fout.write("%s\t%s\t%s\n" % \
            (timestamp, name, os.environ.get("REMOTE_ADDR")))
    finally:
        fout.close()


###############################################################################
# main
###############################################################################

# # ms-windows用
# try:
#     import msvcrt
#     msvcrt.setmode(0, os.O_BINARY)
#     msvcrt.setmode(1, os.O_BINARY)
# except ImportError:
#     pass

# blacklist check
ip = os.environ.get("REMOTE_ADDR")
message = []
if blacklist.check(ip):
    message.append(MESSAGES["blacklist"])
    showErrorAndExit(message)

# length check
if os.environ.get("REQUEST_METHOD") == "POST":
    repSize = os.environ.get("CONTENT_LENGTH");
    # content-lengthが無い場合は不許可
    if not repSize:
        message.append(MESSAGES["replay.length.notexist"])
        showErrorAndExit(message)
    # リプレイが大きすぎる場合も不許可
    if _maxReplaySize*1024 < int(repSize):
        message.append(MESSAGES["replay.over"])
        showErrorAndExit(message)


# get form
request = cgi.FieldStorage()

# 入力チェック
message = inputCheck(request)
# エラーがある場合はここで終了
if len(message) > 0:
    showErrorAndExit(message)
else:
    # タスク判別
    task = request["task"].value
    if task == "upload":
        doUpload(request)
    elif task == "delcheck":
        doDelCheck(request)
    elif task == "delete":
        doDelete(request)
    else:
        message.append(MESSAGES["invalidcall"])
        showErrorAndExit(message)
# 終了
sys.exit(0)


# end
