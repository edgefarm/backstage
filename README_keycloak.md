# Sync keycloak users with backstage

yarn workspace backend add @janus-idp/backstage-plugin-keycloak-backend

In keycloak, assign the to the client's *service account* roles, the role query-groups, query-users, view-users

	realm-management:manage-users
	realm-management:query-users
	realm-management:query-groups