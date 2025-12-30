# API Contracts

**Feature Branch**: `001-sheets-attendance-tracker`
**Date**: 2025-12-29

## Status: Not Applicable

This feature uses a **local-first architecture** with no server-side API endpoints. All data operations are performed client-side using Dexie.js (IndexedDB).

### Why No API Contracts?

1. **No network requests**: All CRUD operations happen locally in the browser
2. **No authentication**: No user accounts or server-side sessions
3. **No sync endpoints**: Future sync (Google Drive) will use Dexie Cloud, not custom APIs
4. **Export/import is file-based**: Users download/upload files directly, no API needed

### Data Layer Contracts

Instead of API contracts, this feature defines **data layer contracts** in:

- [`data-model.md`](../data-model.md) - TypeScript interfaces and Dexie schema
- [`../lib/tracker/types.ts`](src/lib/tracker/types.ts) - Runtime types
- [`../lib/tracker/schemas.ts`](src/lib/tracker/schemas.ts) - Zod validation schemas

### Future Considerations

If sync functionality is added later, API contracts would be defined here for:

- `POST /api/tracker/sync` - Push local changes
- `GET /api/tracker/sync` - Pull remote changes
- `POST /api/tracker/backup` - Upload backup to cloud

For now, the architecture remains local-first with no server dependencies.
