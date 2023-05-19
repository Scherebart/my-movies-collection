## The choice of technologies

### Sqlite
Sqlite was chosen after a short research followed by a conclusion, that Sqlite is
- perfectly sufficient to serve well expected user base throughout the early startup period
- simplest to setup
- the backup procedure is most straightforward
- easier for prototyping due to non-strict type enforcement

### better-sqlite3 npm package
The better-sqlite3 was chosen after reading in, that it uses system resources more wisely.
I have learned from that project, that for quick db queries it may be actually more efficient
to do synchronously.

## Project architecture
All code design decisions were made with early startup period in mind.

Basic guidelines I followed while making the decisions:
- refactor into a better architecture incrementally only where it would ease the development right now at **current** stage of development
- forget about the *future gains* of refactors unless the negligence means increasing cost to do it in the future
- Most often small/cheap refactors pinpointing some crucial aspect of the software are pretty much enough for the "housekeeping"

Overall, I intended to make it as good as far it justified the extra effort only.

## For now there is just a stub of user authentication.
The http header `user-id` represents an authentication.
I can now develop all authentication-dependent part of the system *before* developing actual authentication scheme.

I can become any user by adding `user-id` query param in the web address 

## Project setup

1. Run:
```bash
pnpm install
pnpm init-env
```

2. Obtain API key from the omdbapi.com and put it into the `.env` file under `API_KEY_OMDB`

3. Run:
```bash
pnpm migrate:up
pnpm test:migrate:up

# optionally you may fill db with test data for local development
pnpm seed
```

4. Run `pnpm dev` to start dev server. 
You will see a link to local website in the logs.

To run the prod server do:
```bash
pnpm build
pnpm start
```

To run tests do `pnpm test [optional jest filter]`


