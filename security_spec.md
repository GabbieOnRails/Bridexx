# Security Specification - Bridexx Planet

## Data Invariants
1. A user can only view and edit their own profile.
2. A user can only view their own orders and notifications.
3. Only admins can create/update products.
4. Only admins can update order statuses and shipping fees.
5. Users can create orders but cannot modify them after creation (except maybe specific fields if needed, but per schema, admin controls most).
6. Admin role is verified via a protected `/admins/` collection.
7. User email must be verified for sensitive operations.

## The "Dirty Dozen" (Attack Scenarios)
1. **Identity Spoofing**: User A attempts to read User B's profile.
2. **Role Escalation**: User attempts to write to the `/admins/` collection.
3. **Ghost Update**: User attempts to update an order's `orderStatus` to 'shipped'.
4. **Price Manipulation**: User attempts to create an order with `productPrice: 0`.
5. **PII Leak**: Unauthenticated user attempts to list all users.
6. **Notification Hijack**: User A attempts to mark User B's notification as read.
7. **Resource Poisoning**: User attempts to create an order with a massive 1MB string as a measurement.
8. **Orphaned Order**: User attempts to create an order with a `userId` that doesn't match their own.
9. **Admin Bypass**: User attempts to delete a product.
10. **State Skipping**: Admin attempts to move order status from 'payment_confirmed' directly to 'shipped' (if logic enforced).
11. **Timestamp Forgery**: User attempts to set `createdAt` to a future date.
12. **Secret Field Injection**: User attempts to add a `isVip` field to their profile which isn't in the schema.

## Rules Draft Strategy
- Use `isValidUser`, `isValidOrder`, etc.
- Check `request.auth.uid` matches `userId`.
- Check `exists(/databases/$(database)/documents/admins/$(request.auth.uid))` for admin actions.
- Use `affectedKeys().hasOnly()` for partial updates.
