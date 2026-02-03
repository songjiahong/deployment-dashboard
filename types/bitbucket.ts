export interface BitbucketProject {
  uuid: string;
  key: string;
  name: string;
  description?: string;
  is_private: boolean;
  created_on: string;
  updated_on: string;
}

export interface BitbucketRepository {
  uuid: string;
  name: string;
  full_name: string;
  slug: string;
  description?: string;
  is_private: boolean;
  project?: {
    key: string;
    name: string;
  };
  created_on: string;
  updated_on: string;
}

export interface BitbucketDeployment {
  uuid: string;
  key?: string;
  name?: string;
  number: number;
  state: {
    name: string;
    type: string;
    status?: {
      name: string;
      type: string;
    };
  };
  environment?: {
    uuid: string;
    name?: string;
    type?: string;
  };
  release?: {
    name: string;
    url: string;
  };
  commit?: {
    hash: string;
    type: string;
    message?: string;
  };
  deployable?: {
    type: string;
    uuid: string;
    key: string;
    name: string;
    url: string;
    commit?: {
      hash: string;
    };
  };
  created_on: string;
  updated_on?: string;
  completed_on?: string;
}

export interface DeploymentEnvironment {
  uuid: string;
  name: string;
  slug: string;
  type: string;
  environment_type?: {
    name: string;
    type: string;
  };
  category?: {
    name: string;
  };
  rank?: number;
}

export interface BitbucketPipeline {
  uuid: string;
  build_number: number;
  creator: {
    display_name: string;
    uuid: string;
  };
  repository: {
    name: string;
    full_name: string;
  };
  target: {
    type: string;
    ref_name?: string;
    ref_type?: string;
    commit?: {
      hash: string;
    };
  };
  trigger: {
    name: string;
    type: string;
  };
  state: {
    name: string;
    type: string;
    result?: {
      name: string;
      type: string;
    };
  };
  created_on: string;
  completed_on?: string;
}

export interface PaginatedResponse<T> {
  size: number;
  page: number;
  pagelen: number;
  next?: string;
  previous?: string;
  values: T[];
}
