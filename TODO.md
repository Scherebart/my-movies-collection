# User scenarios
1. [OK] User can see navbar
 - logo + title
 - user selector
2. [OK] User can properly see tiles with his collection
3. [OK] User can switch between tabs
4. [OK] User can search the movie DB on the SECOND TAB
5. [OK] User can (un)like and see like status of a movie while searching the movie DB
6. [OK] User can unlike a movie while browsing his collection
7. [OK] User can click on a sough movie to see a modal with details on the movie
8. User can register and act on his account only on a successful login 

# Further improvements

## Backend
- Extend current sqlite connection with auto conversions
  - column names case: snake_case <--> camelCase
  - type: text <--> json
- To determine what data to log, use log level configuration instead of env type
- Prepend movie data fetch with caching of fetched OMDB data

## Frontend
- Make an effort to improve the UI responsiveness against different screen types to be *good* at least.
- Make a lazy loading movie image placeholder
- Replace <img v-if...> <img v-else...> with transformed data object for the sake of simpler frontend structure

## Features
- Add infinite scroll to the OMDB search tab
- Add sorting selection to the user's collection tab


