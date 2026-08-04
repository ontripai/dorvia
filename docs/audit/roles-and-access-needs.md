# Roles and Access Needs

| Role | Capabilities | Data Visibility | Write Permissions | Lead Access | Verification Permissions |
|---|---|---|---|---|---|
| Visitor | Read public content, submit open forms | Public data only | None | None | None |
| Registered User | Save guides, track service status | Own profile & tickets | Own submitted | None | None |
| Service Customer | Pay invoices, upload secure docs | Own case files | Own case files | None | None |
| Business Owner | Manage 1+ provider profiles | Own provider & leads | Own provider profile | Only assigned leads | None |
| Provider Staff | Reply to leads | Provider leads | Assigned leads | Assigned leads | None |
| Content Editor | Edit guides, update facts | CMS content | CMS content | None | None |
| Fact Checker | Review content accuracy | CMS content | CMS annotations | None | None |
| Verifier | Approve/Reject provider licenses | Provider documents | Provider status | None | Yes |
| Support Agent | Answer customer queries | Tickets & basic user info | Tickets | View all | None |
| Admin | Manage billing, lead routing | All | All | All | Yes |
| Super Admin | System config, role assignment | All | All | All | Yes |

*Note: A single user entity can simultaneously hold Registered User, Service Customer, and Business Owner roles. Conflict restrictions must apply (e.g. Verifiers cannot own business profiles).*
