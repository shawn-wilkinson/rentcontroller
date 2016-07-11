#!/bin/bash

mongoimport --jsonArray --drop --db $DB --collection apartments --file ../data/apartments.json
mongoimport --jsonArray --drop --db $DB --collection renters --file ../data/renters.json
