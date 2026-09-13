-- CreateEnum
CREATE TYPE "AuthAuditEvent" AS ENUM ('LOGIN_SUCCESS', 'LOGIN_FAILURE', 'LOGOUT', 'SESSION_REVOKED');

-- CreateTable
CREATE TABLE "AuthAudit" (
    "id" TEXT NOT NULL,
    "event" "AuthAuditEvent" NOT NULL,
    "userId" TEXT,
    "identifierHash" TEXT,
    "networkHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthAudit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuthAudit_userId_idx" ON "AuthAudit"("userId");

-- CreateIndex
CREATE INDEX "AuthAudit_event_createdAt_idx" ON "AuthAudit"("event", "createdAt");

-- AddForeignKey
ALTER TABLE "AuthAudit" ADD CONSTRAINT "AuthAudit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
