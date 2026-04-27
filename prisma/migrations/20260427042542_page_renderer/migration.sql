-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Page" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "renderer" TEXT NOT NULL DEFAULT 'mdx',
    "content" TEXT NOT NULL,
    "liquidSource" TEXT,
    "liquidCss" TEXT,
    "liquidData" TEXT,
    "template" TEXT NOT NULL DEFAULT 'standard',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "publishedAt" DATETIME,
    "showInNav" BOOLEAN NOT NULL DEFAULT false,
    "navOrder" INTEGER NOT NULL DEFAULT 0,
    "coverImage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Page" ("content", "coverImage", "createdAt", "description", "id", "navOrder", "publishedAt", "showInNav", "slug", "status", "template", "title", "updatedAt") SELECT "content", "coverImage", "createdAt", "description", "id", "navOrder", "publishedAt", "showInNav", "slug", "status", "template", "title", "updatedAt" FROM "Page";
DROP TABLE "Page";
ALTER TABLE "new_Page" RENAME TO "Page";
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");
CREATE INDEX "Page_status_slug_idx" ON "Page"("status", "slug");
CREATE INDEX "Page_showInNav_navOrder_idx" ON "Page"("showInNav", "navOrder");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
