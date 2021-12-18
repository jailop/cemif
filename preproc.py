#!/usr/bin/python

import os
import sys
import re
from getopt import getopt
from markdown import markdown

ext = '.mkd'
path = './client'
template_path = './res/templates/index.html'
root = ''

build_all = False

template = open(template_path, 'r').read()
template = template.replace('{%root%}', root)

cmd_title = re.compile('^%title')
cmd_date = re.compile('^%date')
cmd_head = re.compile('^%head')
cmd_mkd = re.compile('^%mkd')
cmd_html = re.compile('^%html')

def convert(path):
    print(path)
    reg = {
        'title': '',
        'date': '',
        'head': '',
        'body': '',
        'buf': '',
        'mode': 'html'
    }
    source = open(path, 'r').readlines()
    def proc(new_mode):
        if reg['mode'] == 'mkd':
            reg['body'] += markdown(reg['buf'], extensions=['md_in_html'])
        elif reg['mode'] == 'head':
            reg['head'] += reg['buf']
        elif reg['mode'] == 'html':
            reg['body'] += reg['buf']
        else:
            pass
        reg['buf'] = ''
        reg['mode'] = new_mode 
    for ln in source:
        if ln[0] == '%':
            if cmd_title.match(ln):
                reg['title'] = ln[len(cmd_title.pattern):].strip()
            elif cmd_date.match(ln):
                reg['date'] = ln[len(cmd_date.pattern):].strip()
            elif cmd_head.match(ln):
                proc('head')
            elif cmd_mkd.match(ln):
                proc('mkd')
            elif cmd_html.match(ln):
                proc('html')
            else:
                pass
        else:
            ln = ln\
                .replace('{%root%}', root)\
                .replace(ext, '.html')
            reg['buf'] += ln
    proc('html')
    target = template\
        .replace('{%title%}', reg['title'])\
        .replace('{%date%}', reg['date']) \
        .replace('{%head%}', reg['head']) \
        .replace('{%body%}', reg['body']) 
    open(path.replace(ext, '.html'), 'w').write(target)

def walk(start='.'):
    files = os.listdir(start)
    for f in files:
        path_new = start + '/' + f
        if os.path.isdir(path_new):
            walk(path_new)
        else:
            pos = f.rfind(ext)
            size = len(f)
            if pos > 0 and size - pos == len(ext):
                path_dst = path_new.replace(ext, '.html')
                if not build_all and os.path.exists(path_dst):
                    time_src = os.path.getmtime(path_new)
                    time_dst = os.path.getmtime(path_dst)
                    if time_src > time_dst:
                        convert(path_new)
                else:
                    convert(path_new)

if __name__ == '__main__':
    optlist, args = getopt(sys.argv[1:], 'a')
    for o, a in optlist:
        if o == '-a':
            build_all = True
    walk(path)
