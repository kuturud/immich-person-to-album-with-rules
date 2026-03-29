export interface Config {
  immichServer: string;
  schedule: string;
  users: User[]
}

export interface User {
  apiKey: string;
  personLinks: Link[]
}

export interface Link {
  description?: string;
  /** @deprecated Use personIds instead */
  personId?: string;
  personIds?: string[];
  minCount?: number;
  albumId: string;
  apiKeyShort: string;
}
