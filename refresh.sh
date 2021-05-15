#!/bin/sh
# 
# sct_refresh.sh: Create and Refresh a SC Trans playlist
#
# Developed by Lucas Saliés Brum a.k.a. sistematico, <lucas@archlinux.com.br>
# Based on "Dytut" work:
# http://forums.winamp.com/showpost.php?p=1806538&postcount=6
#
# Suggested cronjob: */60 * * * * /bin/sh /home/shoutcast/bin/sct_refresh.sh
# 

# Vars
TRANS_HOME="/home/armendz/radio/autodj"
TRANS_PID=$(pidof sc_trans)
TRANS_FIND=$(which find)
TRANS_KILL=$(which kill)
TRANS_CHOWN=$(which chown)
TRANS_PATH="/home/armendz/radio/autodj/downloadedmuzik"
TRANS_LIST="/home/armendz/radio/autodj/playlists/newmain.lst"
TRANS_USER="armendz"
TRANS_GROUP="armendz"

# DONT CHANGE BELOW
# Create playlist
# $TRANS_FIND $TRANS_PATH -iname "*.mp3" > $TRANS_LIST

# Reload new playlist(try one of above, maybe need root permissions)
#$TRANS_KILL -s USR1 $TRANS_PID
#$TRANS_KILL -USR1 $TRANS_PID
$TRANS_KILL -SIGUSR1 $TRANS_PID

# turn shuffle on/off
# $TRANS_KILL -s USR2 $TRANS_PID

# Change permissions
# $TRANS_CHOWN ${TRANS_USER}:${TRANS_GROUP} $TRANS_LIST
