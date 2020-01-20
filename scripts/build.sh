#!/bin/bash

# Reset .build directory
rm -rf .build

# Run Next.js build
next build

# Transpile views folder and copy GraphQL files
babel src/views --out-dir .build/views --presets @babel/preset-typescript --extensions '.ts' --copy-files

# Transpile server folder and copy GraphQL files
babel src/server --out-dir .build/server --presets @babel/preset-typescript --extensions '.ts' --copy-files

# Transpile config folder
babel config --out-dir .build/config --presets @babel/preset-typescript --extensions '.ts'

# Transpile utils folder
babel src/utils --out-dir .build/utils --presets @babel/preset-typescript --extensions '.ts'
