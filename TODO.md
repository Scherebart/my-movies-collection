# Current UI TODO
1. [OK] navbar
 - logo + title
 - user selector
2. [OK] properly display tiles with my collection
3. [OK] make tabs selectable
4. [OK] Add search feature to the SECOND TAB
5. [OK] Add like button on the OMDB tab
6. [OK] Add button to REMOVE liked movie on user's collection tab
8. [OK] Show modal with details on clicking searched movie

# Further improvements

## Backend
- Extend current sqlite connection with auto conversions
  - column names case: snake_case <--> camelCase
  - type: text <--> json
- To determine what data to log, use log level configuration instead of env type
- Prepend movie data fetch with caching of fetched OMDB data

## Frontend
- Make a lazy loading movie image placeholder

## Features
- Add infinite scroll to the OMDB search tab
- Add sorting selection to the user's collection tab
- Replace <img v-if...> <img v-else...> with transformed data object for the sake of simpler frontend structure

