# Changelog

## Version 0.5.0, released 2026-05-16


### New features

* **trophy-award:** animate award flow as a three-step journey ([206c3f5](https://github.com/HaakonSvane/troji/commit/206c3f5382bbfd020b5c9435a5a13b565004e864))
* **trophy-award:** immersive three-step award journey ([#53](https://github.com/HaakonSvane/troji/issues/53)) ([206c3f5](https://github.com/HaakonSvane/troji/commit/206c3f5382bbfd020b5c9435a5a13b565004e864))


### Documentation improvements

* add nested AGENTS.md context for the most-touched subsystems ([206c3f5](https://github.com/HaakonSvane/troji/commit/206c3f5382bbfd020b5c9435a5a13b565004e864))

## Version 0.4.4, released 2026-05-10


### Bug fixes

* **seeder:** add missing hans user to seed data ([efac6a8](https://github.com/HaakonSvane/troji/commit/efac6a8c2937b5389da47b3996ed59fce62d16e1))

## Version 0.4.3, released 2026-05-10


### Bug fixes

* **trophies:** instant cache update after awarding a trophy ([#47](https://github.com/HaakonSvane/troji/issues/47)) ([4d4c6c3](https://github.com/HaakonSvane/troji/commit/4d4c6c30decc23d0b60189d93e98e76d2c764092))


### Performance improvements

* **backend:** sort games and members by recent activity, add recentActivityCount ([2c8f0e1](https://github.com/HaakonSvane/troji/commit/2c8f0e1d246560d3edbeb826f7dc4ba20499a590))

## Version 0.4.2, released 2026-05-10


### Bug fixes

* **repository:** rename GetUsersByGameIdsAsync to GetUsersByGameIds ([ed632e3](https://github.com/HaakonSvane/troji/commit/ed632e338095158da82ae9ef28d3fee0cf013797))

## Version 0.4.1, released 2026-05-10


### Bug fixes

* **seeder:** remove Console.WriteLine calls from database seeder ([16606f0](https://github.com/HaakonSvane/troji/commit/16606f03e703bff5e5a65467db6023ce6f22c49f))

## Version 0.4.0, released 2026-05-10


### New features

* **group:** redesign detail page around standings and activity ([#43](https://github.com/HaakonSvane/troji/issues/43)) ([6e5ecff](https://github.com/HaakonSvane/troji/commit/6e5ecff39e4adc364c33d8204819e8ee1bf9424d))


### Bug fixes

* prevent self-handouts in open groups ([#42](https://github.com/HaakonSvane/troji/issues/42)) ([abfdc0c](https://github.com/HaakonSvane/troji/commit/abfdc0ce8ef0e8f1e41f73dec4aa464e60465e23))

## Version 0.3.0, released 2026-05-09


### New features

* **backend:** expose /server-info for the version chip ([4991afd](https://github.com/HaakonSvane/troji/commit/4991afd82d24ba28d282a88765ec9c68aacf6a56))

## Version 0.2.1, released 2026-05-09


### Bug fixes

* **groups:** resolve crash and stale auth after joining a group ([#31](https://github.com/HaakonSvane/troji/issues/31)) ([b1408b8](https://github.com/HaakonSvane/troji/commit/b1408b8b151b83f96d7ddcc9ca41397f299d9d7b)), closes [#30](https://github.com/HaakonSvane/troji/issues/30)

## Version 0.2.0, released 2026-05-09


### New features

* **backend:** enforce game emoji uniqueness per group at the DB level ([cd14e3e](https://github.com/HaakonSvane/troji/commit/cd14e3e05090b592c22ec80678954bce25b5b0eb))
* **backend:** enforce unique game emoji per group ([4220e06](https://github.com/HaakonSvane/troji/commit/4220e06e38065951e6e670d6c5454722a8e0f786))
* **backend:** limit users to 5 groups and 5 games per group ([fded79f](https://github.com/HaakonSvane/troji/commit/fded79f6c638c72ec8a374d4755f0161db9a7500))


### Bug fixes

* **backend:** deduplicate existing games before applying unique emoji index ([c676ddc](https://github.com/HaakonSvane/troji/commit/c676ddc656f5732817bb290bfff5fa7cbc346d2a))

## Version 0.1.2, released 2026-05-08


### Bug fixes

* **backend:** use useradd instead of adduser in Dockerfile ([bee63b2](https://github.com/HaakonSvane/troji/commit/bee63b2845cf97c4c122a8b5b6b2454d87b28453))

## Version 0.1.1, released 2026-05-08


### Bug fixes

* remove unecessary file ([2f88c9f](https://github.com/HaakonSvane/troji/commit/2f88c9f15ea02c2ad9d9deeb69f6e6bf5c29f780))

## Version 0.1.0, released 2026-05-08


### New features

* **caddy:** add Caddyfile for HTTPS and security headers configuration ([8447649](https://github.com/HaakonSvane/troji/commit/8447649a70196c1162435208578b0f6cec59af76))
* **db:** auto-apply migrations at startup ([82a7c86](https://github.com/HaakonSvane/troji/commit/82a7c86929b541a285c06895b7f777e6aeae1dcf))
* **docker:** update Dockerfiles to add non-root user and install dependencies ([8447649](https://github.com/HaakonSvane/troji/commit/8447649a70196c1162435208578b0f6cec59af76))
* **groups:** make open the only rule mode across API and UI  - Remove group decision-model choice from create-group flow - Set all new groups to Open rule mode in backend mutations - Simplify trophy requests to immediate award in Open mode - Add migration to normalize existing groups to Open - Update UI labels to show Open as the only available model ([089b382](https://github.com/HaakonSvane/troji/commit/089b382fe4c5db38a88bc978a5b0aa7a5a383a26))
* **registration:** add explicit onboarding flow and stable Relay SSR runtime ([25b421b](https://github.com/HaakonSvane/troji/commit/25b421b1cdef0c9f1e452f32787eeb98db12c02b))


### Bug fixes

* **backend:** throw NoUserException when registered user not found in DB ([d1d22d9](https://github.com/HaakonSvane/troji/commit/d1d22d99a53024b4a17b67b33fa8c823b6496122))
* **db:** make Main async to support await on MigrateAsync ([4f537c0](https://github.com/HaakonSvane/troji/commit/4f537c000004aadbbd5d20064dce18a679923dda))
* **deps:** patch Clerk auth bypass CVE and move shadcn to devDependencies ([4069979](https://github.com/HaakonSvane/troji/commit/406997954b6832458807009f8099ca4d8f968ff4))
* **docker-compose:** format healthcheck command for consistency ([8447649](https://github.com/HaakonSvane/troji/commit/8447649a70196c1162435208578b0f6cec59af76))
* **groups:** eager-load admin user when fetching groups by id ([2dfb13f](https://github.com/HaakonSvane/troji/commit/2dfb13f94b48777a6fce0d29dad6950670c7cb2e))
* resolve audit issues across backend error handling and frontend dead code ([36e41b4](https://github.com/HaakonSvane/troji/commit/36e41b49de64cec7b17af2cda7bb49c05ff44b53))


### Documentation improvements

* add code philosophy to root AGENTS, component directory rules, and fix compose formatting ([e5f10f5](https://github.com/HaakonSvane/troji/commit/e5f10f57885e754e31350ac1570c71ac0ee22a90))
* **plan:** mark Phase 4 and completed Phase 5 items done ([d242ee5](https://github.com/HaakonSvane/troji/commit/d242ee52b4b95ee03b0fc0fcd4ba508cb51c6c4c))

## Version 0.0.2, released 2024-02-04


### Bug fixes

* test fix ([9227beb](https://github.com/HaakonSvane/troji/commit/9227bebb85d68776fcbcc7bf603fdb5f97d6e8d2))

## Version 0.0.1, released 2024-02-04


### Bug fixes

* Initial release ([9227beb](https://github.com/HaakonSvane/troji/commit/9227bebb85d68776fcbcc7bf603fdb5f97d6e8d2))
