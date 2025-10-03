export interface CreateUserRequest {
	username: string;
	password: string;
	displayName?: string;
}

export interface DbPathRequest {
	path: string;
}

export interface CreateDbRequest {
	folderPath: string;
}

export interface CheckAdRequest {
	username: string;
	password: string;
	domain: string;
	domainController: string;
}
