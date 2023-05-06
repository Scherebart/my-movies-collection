# Current UI TODO
1. [OK] navbar
 - logo + title
 - user selector
2. [OK] properly display tiles with my collection
3. [OK] make tabs selectable
4. [OK] Add search feature to the SECOND TAB
5. [OK] Add button in the SEARCH to LIKE movie
6. Add button to REMOVE liked movie in the first tab
7. Show LIKED STATUS on the searched movies
8. Show modal with details on clicking searched movie


# Further improvements

## Backend
- Extend current sqlite connection with auto conversions
  - column names case: snake_case <--> camelCase
  - type: text <--> json
- To determine what data to log, use log level configuration instead of env type
- prepend movie data fetch with caching cap

## Frontend
- Make a lazy loading movie image placeholder

