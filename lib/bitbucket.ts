import axios from 'axios';
import type {
  BitbucketProject,
  BitbucketRepository,
  BitbucketDeployment,
  DeploymentEnvironment,
  BitbucketPipeline,
  PaginatedResponse,
} from '@/types/bitbucket';

const BITBUCKET_API_BASE = 'https://api.bitbucket.org/2.0';

export class BitbucketClient {
  private accessToken?: string;
  private username?: string;
  private appPassword?: string;

  constructor(accessToken?: string, username?: string, appPassword?: string) {
    this.accessToken = accessToken;
    this.username = username;
    this.appPassword = appPassword;
  }

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    } else if (this.username && this.appPassword) {
      const credentials = Buffer.from(`${this.username}:${this.appPassword}`).toString('base64');
      headers.Authorization = `Basic ${credentials}`;
    }

    return headers;
  }

  private async get<T>(url: string): Promise<T> {
    try {
      const response = await axios.get<T>(url, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      const status = error.status || error.response?.status;
      if (status === 401) {
        const authError = new Error('Unauthorized');
        (authError as any).status = 401;
        throw authError;
      }
      throw error;
    }
  }

  private async post<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await axios.post<T>(url, data, {
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      const status = error.status || error.response?.status;
      if (status === 401) {
        const authError = new Error('Unauthorized');
        (authError as any).status = 401;
        throw authError;
      }
      throw error;
    }
  }

  async getWorkspaces(): Promise<any[]> {
    const response = await this.get<PaginatedResponse<any>>(
      `${BITBUCKET_API_BASE}/workspaces`
    );
    return response.values;
  }

  async getProjects(workspace: string): Promise<BitbucketProject[]> {
    const response = await this.get<PaginatedResponse<BitbucketProject>>(
      `${BITBUCKET_API_BASE}/workspaces/${workspace}/projects`
    );
    return response.values;
  }

  async getRepositories(workspace: string): Promise<BitbucketRepository[]> {
    const response = await this.get<PaginatedResponse<BitbucketRepository>>(
      `${BITBUCKET_API_BASE}/repositories/${workspace}`
    );
    return response.values;
  }

  async getRepositoriesByProject(
    workspace: string,
    projectKey: string
  ): Promise<BitbucketRepository[]> {
    const response = await this.get<PaginatedResponse<BitbucketRepository>>(
      `${BITBUCKET_API_BASE}/repositories/${workspace}?q=project.key="${projectKey}"`
    );
    return response.values;
  }

  async getDeployments(
    workspace: string,
    repoSlug: string
  ): Promise<BitbucketDeployment[]> {
    try {
      // Request more results per page (default is 10, max is 100)
      const response = await this.get<PaginatedResponse<BitbucketDeployment>>(
        `${BITBUCKET_API_BASE}/repositories/${workspace}/${repoSlug}/deployments/?pagelen=100`
      );
      
      let allDeployments = response.values || [];
      
      // If there's a next page, fetch it to get more deployments
      if (response.next && allDeployments.length >= 100) {
        try {
          const nextResponse = await this.get<PaginatedResponse<BitbucketDeployment>>(response.next);
          allDeployments = [...allDeployments, ...(nextResponse.values || [])];
        } catch (error) {
          // Continue with what we have if next page fails
          console.error('Failed to fetch next page of deployments:', error);
        }
      }
      
      return allDeployments;
    } catch (error) {
      console.error('Failed to fetch deployments:', error);
      return [];
    }
  }

  async getDeploymentEnvironments(
    workspace: string,
    repoSlug: string
  ): Promise<DeploymentEnvironment[]> {
    try {
      const response = await this.get<PaginatedResponse<DeploymentEnvironment>>(
        `${BITBUCKET_API_BASE}/repositories/${workspace}/${repoSlug}/environments/`
      );
      return response.values;
    } catch (error) {
      return [];
    }
  }

  async getPipelines(
    workspace: string,
    repoSlug: string,
    branch?: string,
    minDate?: string,
    maxDate?: string
  ): Promise<BitbucketPipeline[]> {
    try {
      const params = new URLSearchParams();
      if (branch) {
        params.append('target.ref_name', branch);
      }
      if (minDate) {
        params.append('target.commit.date', `>=${minDate}`);
      }
      if (maxDate) {
        params.append('target.commit.date', `<=${maxDate}`);
      }
      // Sort by created_on descending to get latest first
      params.append('sort', '-created_on');
      
      const url = `${BITBUCKET_API_BASE}/repositories/${workspace}/${repoSlug}/pipelines/?${params.toString()}`;
      
      // Fetch only first page for performance
      const response = await this.get<PaginatedResponse<BitbucketPipeline>>(url);
      return response.values;
    } catch (error) {
      return [];
    }
  }

  async getPipeline(
    workspace: string,
    repoSlug: string,
    pipelineUuid: string
  ): Promise<BitbucketPipeline | null> {
    try {
      const response = await this.get<BitbucketPipeline>(
        `${BITBUCKET_API_BASE}/repositories/${workspace}/${repoSlug}/pipelines/${pipelineUuid}`
      );
      return response;
    } catch (error) {
      return null;
    }
  }

  async getCommit(
    workspace: string,
    repoSlug: string,
    commitHash: string
  ): Promise<{ message: string } | null> {
    try {
      const response = await this.get<{ message: string }>(
        `${BITBUCKET_API_BASE}/repositories/${workspace}/${repoSlug}/commit/${commitHash}`
      );
      return response;
    } catch (error) {
      return null;
    }
  }

  async triggerPipeline(
    workspace: string,
    repoSlug: string,
    target: {
      ref_type: 'branch' | 'tag';
      ref_name: string;
      type: 'pipeline_ref_target';
    },
    variables?: Array<{ key: string; value: string; secured?: boolean }>
  ): Promise<BitbucketPipeline> {
    const payload: any = {
      target,
    };

    if (variables && variables.length > 0) {
      payload.variables = variables;
    }

    return this.post<BitbucketPipeline>(
      `${BITBUCKET_API_BASE}/repositories/${workspace}/${repoSlug}/pipelines/`,
      payload
    );
  }

  async triggerDeployment(
    workspace: string,
    repoSlug: string,
    environmentUuid: string,
    commitHash?: string
  ): Promise<any> {
    const payload: any = {
      environment: {
        uuid: environmentUuid,
      },
    };

    if (commitHash) {
      payload.commit = {
        hash: commitHash,
      };
    }

    return this.post(
      `${BITBUCKET_API_BASE}/repositories/${workspace}/${repoSlug}/deployments/`,
      payload
    );
  }
}
