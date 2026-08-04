# Comments Admin Security

## Status
PERMANENTLY DISABLED IN PRODUCTION

## Reason
- The previous implementation relied on a client-side environment variable (`NEXT_PUBLIC_ADMIN_PASSWORD`) which was insecure.
- In order to comply with strict security constraints and avoid shipping vulnerable authentication flows, the route `/admin/comments` has been converted to a Server Component that returns `404 Not Found`.
- Supabase Service Roles or external admin tools should be used to moderate comments until a robust server-side RBAC auth system is developed.
