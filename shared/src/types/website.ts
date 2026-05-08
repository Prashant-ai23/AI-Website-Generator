export interface Website {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  userId: string;
  content: Record<string, unknown>;
  theme: string;
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateWebsiteRequest {
  title: string;
  description?: string;
  theme?: string;
  content?: Record<string, unknown>;
}

export interface UpdateWebsiteRequest {
  title?: string;
  description?: string;
  content?: Record<string, unknown>;
  theme?: string;
  isPublished?: boolean;
}

export interface WebsiteResponse {
  website: Website;
  message?: string;
}
