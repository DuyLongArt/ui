# Implementation Report: Support Web App Integration

## Overview
Successfully integrated the Support Web App's feedback form with the Java backend for persistence. This allows users to submit feedback which is then stored in the `support_feedback` table.

## Technical Details
- **Backend Stack**: Java, Spring Boot, JPA, Hibernate.
- **Frontend Stack**: React, TanStack Query, Axios.
- **New Tables**: `support_feedback` (in `users` schema).
- **Endpoint**: `POST /api/v1/support/feedback`

## Key Insights
- Used `OnDelete(action = OnDeleteAction.SET_NULL)` for user identity to ensure feedback persists even if a user account is deleted.
- Implemented flexible submission logic that supports both guest and registered users by checking for the `Authorization` header.
- Leveraged existing `JWTService` for seamless identity extraction.

## Files Modified
- `JavaBackend/.../Support/SupportEntity.java` [NEW]
- `JavaBackend/.../Support/SupportDAO.java` [NEW]
- `JavaBackend/.../Support/SupportController.java` [NEW]
- `icegate_web/.../APILayer/userQueries.ts` [MODIFY]
- `icegate_web/.../Public/FeedbackPage.tsx` [MODIFY]
