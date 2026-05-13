# Project Restructure Tasks

- [ ] Create base `src/` directories (`src/apps/client`, `src/apps/server`, `src/apps/functions`, `src/core`, `src/shared`, `src/lib`).
- [ ] Move `client/` contents to `src/apps/client/`.
- [ ] Move `server/` contents to `src/apps/server/`.
- [ ] Move `functions/` contents to `src/apps/functions/`.
- [ ] Move `shared/` contents to `src/shared/`.
- [ ] Move `script/` to `scripts/`.
- [ ] Consolidate content logic into `src/core/content`.
- [ ] Update `package.json` scripts to reflect new paths.
- [ ] Update `tsconfig.json` paths and includes.
- [ ] Update `vite.config.ts` paths.
- [ ] Update imports in `src/apps/server/` to use new core/shared paths.
- [ ] Update imports in `src/apps/functions/` to use new core/shared paths.
- [ ] Update imports in `src/apps/client/` to use new shared paths.
- [ ] Run build to verify functionality.
- [ ] Run dev server to verify functionality (if applicable/testable).
- [ ] Delete this task file.