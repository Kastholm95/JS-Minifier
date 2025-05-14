#!/usr/bin/env python
import os
import sys
import shutil
from datetime import date, timedelta
from subprocess import check_call, CalledProcessError
class JSHandler(object):
	def __init__(self, infile):
		self.infile = infile
		self.outfile = infile.replace(".js",".min.js")
		self.file_to_check = self.outfile
	def esvalidate(self):
		try:
			check_call("esvalidate %s" % self.infile, shell=True)
			print ("esvalidate succeeded")
			return True
		except CalledProcessError as e:
			print("esvalidate failed")
			print(e)
			return False
	def release(self):
		if not os.path.exists("releases"):
			os.makedirs("releases")
		dst = os.path.join("releases", date.today().strftime("%Y-%m-%d") + "-" + self.infile)
		print (dst)
		shutil.copyfile(self.infile, dst)
	def terser(self, outfile=None):
		if outfile is not None:
			self.outfile = outfile
		try:
			check_call("terser %s --compress sequences=true,conditionals=true,booleans=true --mangle --ecma 6 --output %s" % (self.infile, self.outfile), shell=True)
			print ("minification succeeded")
			return True
		except CalledProcessError as e:
			print("minification failed")
			print(e)
			return False
	def node_check(self,file_to_check=None):
		if file_to_check is not None:
			self.file_to_check = file_to_check
		try:
			check_call("node --check %s" % self.file_to_check, shell=True)
			print ("node check succeeded")
			return True
		except CalledProcessError as e:
			print("node check failed")
			print(e)
			return False
	def minify(self, outfile=None):
		if outfile is not None:
			self.outfile = outfile
			self.file_to_check = outfile
		if(self.esvalidate()):
			if(self.terser()):
				if (self.node_check()):
					print("========================================")
					print("%s successfully generated." % self.outfile)
					print("========================================")
					self.release()
if __name__ == '__main__':
	if len(sys.argv) == 2:
		JSHandler(sys.argv[1]).minify()
	elif len(sys.argv) == 3:
		JSHandler(sys.argv[1]).minify(sys.argv[2])
	else:
		print("Usage: minify.py infile [outfile]")