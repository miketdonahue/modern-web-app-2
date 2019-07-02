#!/bin/bash

# Reset .build directory
rm -rf .build

# Run Next.js build
next build

# Transpile server folder and copy GraphQL files
babel server --out-dir .build/server --presets @babel/preset-typescript --extensions '.ts' --copy-files

# Transpile config folder
babel config --out-dir .build/config --presets @babel/preset-typescript --extensions '.ts'

# Transpile utils folder
babel utils --out-dir .build/utils --presets @babel/preset-typescript --extensions '.ts'
