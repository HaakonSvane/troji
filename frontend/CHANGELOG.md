# Changelog

## [0.2.0](https://github.com/HaakonSvane/troji/compare/frontend-v0.1.0...frontend-v0.2.0) (2026-05-08)


### Features

* **caddy:** add Caddyfile for HTTPS and security headers configuration ([8447649](https://github.com/HaakonSvane/troji/commit/8447649a70196c1162435208578b0f6cec59af76))
* **docker:** update Dockerfiles to add non-root user and install dependencies ([8447649](https://github.com/HaakonSvane/troji/commit/8447649a70196c1162435208578b0f6cec59af76))
* **feedback:** submit in-app feedback as GitHub issues via BFF ([8d4bce7](https://github.com/HaakonSvane/troji/commit/8d4bce7f121dc9ddd23626d2601859a2107cfb17))
* **frontend:** add schema-backed forms and medal badges ([659a654](https://github.com/HaakonSvane/troji/commit/659a654af6165d28e608c090bde1dd91309fa719))
* **frontend:** establish reusable Phase 6 style foundation ([3153519](https://github.com/HaakonSvane/troji/commit/3153519df01e3c8110928da83ec45c3cd119a77d))
* **frontend:** implement phase 5 routes and features  - Landing page: replace starter scaffold with app logo + sign-in/sign-up CTAs - Header: sticky nav with Dashboard/Groups links and Clerk UserButton - Groups list (/groups): render-as-you-fetch with GroupBox fragment cards - Group detail (/groups/:id): sidebar card + tabbed Games/Members/Trophies/Invite view - Create group: DrawerDialog form with name, description, decision model selection - Create game: DrawerDialog form with EmojiPicker, name, description - Group invite: admin generates/regenerates invite code; any member can join via code - Trophy request: nominate a group member for a trophy on any game - Trophy approval: approve pending trophy requests; view awarded trophies per group - DrawerDialog: responsive Dialog (desktop) / Drawer (mobile) reusable wrapper - EmojiPicker: virtualized emoji grid with search using emojilib + @tanstack/react-virtual - Domain components: GroupBox, MemberRow, TrophyAvatar, TrophyStack, GroupSocialCard, GroupGamesTableRow, TrophyApprovalPanel - Fix SSR build: extend relay-ssr Vite plugin to emit stubs for type-only relay-runtime exports (ConcreteRequest, FragmentRefs) ([a50d269](https://github.com/HaakonSvane/troji/commit/a50d269035fb8d6d6e8d930cd432242849f0a847))
* **frontend:** label the current user and surface created games immediately ([379f388](https://github.com/HaakonSvane/troji/commit/379f388039e34c47bd12c2d76e6d8f3fcd0429b7))
* **frontend:** Phase 4 — core architecture (Clerk + Relay + auth routing) ([0c88d7e](https://github.com/HaakonSvane/troji/commit/0c88d7e2d0989f18c0fb00b139bed79cd844f8b1))
* **frontend:** refresh group tabs and move invite/join actions ([9074f91](https://github.com/HaakonSvane/troji/commit/9074f91d627b4e3a4dfc930a8cc5550e0f89f417))
* **frontend:** scaffold Phase 3 — React Router v7, Tailwind v4, shadcn/ui, Relay, Clerk ([34678c3](https://github.com/HaakonSvane/troji/commit/34678c39dd70155cddf7c2b3776c640d5d811ae9))
* **games:** add navigable group game flow ([75c21cc](https://github.com/HaakonSvane/troji/commit/75c21ccacc2b7c7b289d006a20ce0de69b4b20bf))
* **groups:** extract AwardTrophyButton and fill active tab icons ([5fd6b00](https://github.com/HaakonSvane/troji/commit/5fd6b006996f51d853dd312f16395b3f9bc7e544))
* **groups:** make open the only rule mode across API and UI  - Remove group decision-model choice from create-group flow - Set all new groups to Open rule mode in backend mutations - Simplify trophy requests to immediate award in Open mode - Add migration to normalize existing groups to Open - Update UI labels to show Open as the only available model ([089b382](https://github.com/HaakonSvane/troji/commit/089b382fe4c5db38a88bc978a5b0aa7a5a383a26))
* **registration:** add explicit onboarding flow and stable Relay SSR runtime ([25b421b](https://github.com/HaakonSvane/troji/commit/25b421b1cdef0c9f1e452f32787eeb98db12c02b))
* **routing:** redirect signed-in users to dashboard from home, sign-in, and sign-up ([bcbd8c1](https://github.com/HaakonSvane/troji/commit/bcbd8c1f7e3d12e8a3044cd0a62f2d9485e77fed))
* **ui:** add disabled-with-reason popover hints to Button and gate award-trophy actions ([868eb22](https://github.com/HaakonSvane/troji/commit/868eb22987f04261ba9f64c02c72e10507fc0174))


### Bug Fixes

* **deps:** patch Clerk auth bypass CVE and move shadcn to devDependencies ([4069979](https://github.com/HaakonSvane/troji/commit/406997954b6832458807009f8099ca4d8f968ff4))
* **docker-compose:** format healthcheck command for consistency ([8447649](https://github.com/HaakonSvane/troji/commit/8447649a70196c1162435208578b0f6cec59af76))
* **emoji-picker:** remove first-open blank state ([48325db](https://github.com/HaakonSvane/troji/commit/48325db12933cbe75f1898bca01085e583971f6e))
* **emoji-picker:** restore scrolling inside modal forms ([5acff3e](https://github.com/HaakonSvane/troji/commit/5acff3e1589749c131df09ea65a3975269f47e30))
* **forms:** improve emoji picker and redesign game form layout ([d2f6a00](https://github.com/HaakonSvane/troji/commit/d2f6a00750fdd61aeb27d43d63a2a4b19159fb74))
* **frontend:** prevent Safari SSR 504 via Vite server warmup and wider optimizeDeps ([faac806](https://github.com/HaakonSvane/troji/commit/faac806eda401c58d7cc6ff5f5890be6d1fa9ba0))
* **frontend:** resolve runtime crashes on groups routes and hydration mismatch  - Add HydrateFallback to groups and group detail routes to prevent   Relay environment access before provider mounts during SSR hydration - Intercept NoUserError from GraphQL responses and redirect to /register - Suppress hydration warning on html element for next-themes compatibility ([743d260](https://github.com/HaakonSvane/troji/commit/743d2601e53a970ee188b14c84f8dff0ab9e173d))
* **groups:** strip connection filters so mutation updater finds the cached connection ([9a54643](https://github.com/HaakonSvane/troji/commit/9a54643cdda8dc6d0505ecbd757fd8d42fde021c))
* **groups:** update Relay store after group creation so list reflects new group  Use a mutation updater to prepend the newly created group edge into the Groups_groups connection, keeping the groups overview in sync without a refetch. ([4bc042c](https://github.com/HaakonSvane/troji/commit/4bc042c4720ea31145652cf87311a04a54e728ca))
* **layout:** constrain scroll to content area with fixed header ([a811845](https://github.com/HaakonSvane/troji/commit/a811845361b3eaebe5e411cfcc3114479493c05a))
* **mutations:** remove unexpected __typename from optimistic responses ([5d2b878](https://github.com/HaakonSvane/troji/commit/5d2b8785180918f582996c21c0d31b62ab4f9f43))
* resolve audit issues across backend error handling and frontend dead code ([36e41b4](https://github.com/HaakonSvane/troji/commit/36e41b49de64cec7b17af2cda7bb49c05ff44b53))
