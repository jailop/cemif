#!/bin/sh

SERVER=cemif@fiscal.funde.org

rsync -av --delete --exclude=".*" client       $SERVER:cemif/
rsync -av --delete --exclude=".*" res          $SERVER:cemif/
rsync -av --delete --exclude=".*" server       $SERVER:cemif/
rsync -av --delete --exclude=".*" docs         $SERVER:cemif/
rsync -av --delete --exclude=".*" notebooks    $SERVER:cemif/
# rsync -av --delete --exclude=".*" data         $SERVER:cemif/
