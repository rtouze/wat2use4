#!/usr/bin/env bash
tmux new-session -d -s wat2use4
tmux new-window -n mongodb mongod --dbpath ~/mongodata/db
tmux new-window -n node node server.js
tmux new-window
tmux attach -t wat2use4
