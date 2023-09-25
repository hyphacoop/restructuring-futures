#!/bin/bash
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Copied .env.example to .env"
else
    echo ".env already exists."
fi
