#!/bin/env python
#coding:utf-8

import string

# ブラックリストのファイル名
blackList = "./blacklist.cgi"

# blackListの内容は、改行区切りのIPアドレスの羅列。
# REMOTE_ADDRとの一致でチェックされる。
# 例：
# 123.123.123.12
# →123.123.123.12を拒否
#
# ただし、末尾が "." で終わっている行は、前方一致でチェックされる
# 例:
# 123.123.123.
# →123.123.123.*を拒否
#
# "#" で始まる行はコメントとして扱われる。


# 指定されたipがblackListに含まれているかをチェックする。
# return: 含まれている場合はTrue、含まれていない場合はFalse
def check(ip):
	fin = None
	try:
		fin = open(blackList, "r")
		lines = fin.readlines()
		for line in lines:
			line = string.strip(line)
			# 空行は無視
			if len(line) == 0:
				continue
			# コメント行も無視
			if line.startswith("#"):
				continue
			# "."で終わる場合は前方一致チェック
			if line.endswith("."):
				if ip.startswith(line):
					return True
			# それ以外はそのまま一致チェック
			else:
				if ip == line:
					return True
	finally:
		fin.close()
	return False



#end
