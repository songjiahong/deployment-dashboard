'use client';

import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Play, Trash2, Plus, GitBranch, Clock, CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import type { BitbucketProject, BitbucketRepository, BitbucketDeployment, DeploymentEnvironment } from '@/types/bitbucket';

interface DeploymentByEnv {
  [envName: string]: BitbucketDeployment;
}

interface RepoWithDeployments extends BitbucketRepository {
  deployments: BitbucketDeployment[];
  deploymentsByEnv: DeploymentByEnv;
}

interface ProjectGroup {
  project: BitbucketProject;
  repositories: RepoWithDeployments[];
}

export default function DeploymentDashboard() {
  const { data: session } = useSession();
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');
  const [projects, setProjects] = useState<BitbucketProject[]>([]);
  const [projectGroups, setProjectGroups] = useState<ProjectGroup[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [collapsedProjects, setCollapsedProjects] = useState<Set<string>>(new Set());
  const [selectedRepos, setSelectedRepos] = useState<Map<string, Set<string>>>(new Map());
  const [repoToAddByProject, setRepoToAddByProject] = useState<Map<string, string>>(new Map());
  const [environments, setEnvironments] = useState<DeploymentEnvironment[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshingProjects, setRefreshingProjects] = useState<Set<string>>(new Set());
  const [projectOrder, setProjectOrder] = useState<string[]>([]);
  const draggedProjectRef = useRef<string | null>(null);
  const [dragOverProject, setDragOverProject] = useState<string | null>(null);

  // Helper function to check for auth errors and sign out
  const checkAuthError = useCallback(async (response: Response) => {
    if (response.status === 401) {
      toast.error('Session Expired', {
        description: 'Your Bitbucket token has expired. Signing you out...',
        duration: 3000,
      });
      // Wait a moment for the toast to be visible, then sign out
      setTimeout(() => {
        signOut({ callbackUrl: '/auth/signin' });
      }, 1000);
      return true;
    }
    return false;
  }, []);

  const fetchWorkspaces = useCallback(async () => {
    try {
      const response = await fetch('/api/bitbucket/workspaces');
      
      if (!response.ok) {
        console.error('Workspaces API error:', response.status, response.statusText);
        
        // If unauthorized, show toast and sign out
        if (await checkAuthError(response)) {
          return;
        }
        
        setWorkspaces([]);
        return;
      }
      
      const data = await response.json();
      
      // Validate that data is an array
      if (!Array.isArray(data)) {
        console.error('Workspaces API returned non-array:', data);
        setWorkspaces([]);
        return;
      }
      
      setWorkspaces(data);
      
      if (data.length > 0) {
        // Load workspace from localStorage or use first workspace
        const savedWorkspace = localStorage.getItem('selectedWorkspace');
        
        let workspaceToSelect;
        if (savedWorkspace && data.some((ws: any) => ws.slug === savedWorkspace)) {
          // Use saved workspace if it still exists
          workspaceToSelect = savedWorkspace;
        } else {
          // Use first workspace if no saved workspace
          workspaceToSelect = data[0].slug;
        }
        
        setSelectedWorkspace(workspaceToSelect);
        localStorage.setItem('selectedWorkspace', workspaceToSelect);
      }
    } catch (error) {
      console.error('Failed to fetch workspaces:', error);
    }
  }, [checkAuthError]);

  useEffect(() => {
    if (session) {
      fetchWorkspaces();
    }
  }, [session, fetchWorkspaces]);

  useEffect(() => {
    if (selectedWorkspace) {
      // Save workspace selection to localStorage whenever it changes
      localStorage.setItem('selectedWorkspace', selectedWorkspace);
      fetchProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWorkspace]);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/bitbucket/projects?workspace=${selectedWorkspace}`);
      
      if (await checkAuthError(response)) {
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      setProjects(data);
      
      // Load project order from localStorage or default to alphabetical
      const orderKey = `projectOrder_${selectedWorkspace}`;
      const savedOrder = localStorage.getItem(orderKey);
      const allKeys = data.map((p: BitbucketProject) => p.key);
      let order: string[];
      if (savedOrder) {
        const parsed = JSON.parse(savedOrder);
        // Keep saved order for existing projects, append new ones alphabetically
        const validSaved = parsed.filter((key: string) => allKeys.includes(key));
        const newKeys = allKeys.filter((key: string) => !validSaved.includes(key));
        newKeys.sort((a: string, b: string) => {
          const nameA = data.find((p: BitbucketProject) => p.key === a)?.name || a;
          const nameB = data.find((p: BitbucketProject) => p.key === b)?.name || b;
          return nameA.localeCompare(nameB);
        });
        order = [...validSaved, ...newKeys];
      } else {
        // Default: alphabetical by project name
        order = [...allKeys].sort((a: string, b: string) => {
          const nameA = data.find((p: BitbucketProject) => p.key === a)?.name || a;
          const nameB = data.find((p: BitbucketProject) => p.key === b)?.name || b;
          return nameA.localeCompare(nameB);
        });
      }
      setProjectOrder(order);
      
      // Load selected projects from localStorage or default to all
      const storageKey = `selectedProjects_${selectedWorkspace}`;
      const savedSelection = localStorage.getItem(storageKey);
      
      let projectsToSelect: Set<string>;
      if (savedSelection) {
        const savedKeys = JSON.parse(savedSelection);
        // Filter to only include projects that still exist
        const validKeys = savedKeys.filter((key: string) => 
          data.some((p: BitbucketProject) => p.key === key)
        );
        projectsToSelect = new Set(validKeys);
      } else {
        // Default to all projects if no saved selection
        projectsToSelect = new Set(data.map((p: BitbucketProject) => p.key));
      }
      
      setSelectedProjects(projectsToSelect);
      
      // Load collapsed projects from localStorage
      const collapsedKey = `collapsedProjects_${selectedWorkspace}`;
      const savedCollapsed = localStorage.getItem(collapsedKey);
      if (savedCollapsed) {
        setCollapsedProjects(new Set(JSON.parse(savedCollapsed)));
      }
      
      // Load selected repos from localStorage
      const reposKey = `selectedRepos_${selectedWorkspace}`;
      const savedRepos = localStorage.getItem(reposKey);
      if (savedRepos) {
        const parsed = JSON.parse(savedRepos);
        const reposMap = new Map<string, Set<string>>();
        Object.entries(parsed).forEach(([projectKey, repos]) => {
          reposMap.set(projectKey, new Set(repos as string[]));
        });
        setSelectedRepos(reposMap);
      }
      
      // Turn off loading immediately so progressive updates are visible
      setLoading(false);
      
      // Fetch deployments only for selected projects, in order
      const selectedProjectsList = order
        .filter((key: string) => projectsToSelect.has(key))
        .map((key: string) => data.find((p: BitbucketProject) => p.key === key)!)
        .filter(Boolean);
      await fetchAllDeployments(selectedProjectsList);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWorkspace]);

  const fetchAllDeployments = async (projectsList: BitbucketProject[]) => {
    // Clear existing groups to show fresh data
    setProjectGroups([]);
    let globalEnvironments: DeploymentEnvironment[] = [];

    // Fetch environments from the first repo to get the list of environment names
    for (const project of projectsList) {
      try {
        const reposResponse = await fetch(
          `/api/bitbucket/repositories?workspace=${selectedWorkspace}&projectKey=${project.key}`
        );
        
        if (await checkAuthError(reposResponse)) {
          return;
        }
        
        const repos: BitbucketRepository[] = await reposResponse.json();
        
        if (repos.length > 0 && globalEnvironments.length === 0) {
          const envResponse = await fetch(
            `/api/bitbucket/environments?workspace=${selectedWorkspace}&repoSlug=${repos[0].slug}`
          );
          
          if (await checkAuthError(envResponse)) {
            return;
          }
          
          const envs = await envResponse.json();
          if (Array.isArray(envs) && envs.length > 0) {
            globalEnvironments = envs;
            setEnvironments(envs);
          }
        }
        break;
      } catch (error) {
        console.error('Failed to fetch initial environments:', error);
      }
    }

    // Process each project sequentially and update UI immediately
    for (const project of projectsList) {
      try {
        const reposResponse = await fetch(
          `/api/bitbucket/repositories?workspace=${selectedWorkspace}&projectKey=${project.key}`
        );
        
        if (await checkAuthError(reposResponse)) {
          return;
        }
        
        const repos: BitbucketRepository[] = await reposResponse.json();

        const reposWithDeployments: RepoWithDeployments[] = await Promise.all(
          repos.map(async (repo) => {
            try {
              const [deploymentsResponse, pipelinesResponse, environmentsResponse] = await Promise.all([
                fetch(`/api/bitbucket/deployments?workspace=${selectedWorkspace}&repoSlug=${repo.slug}`),
                fetch(`/api/bitbucket/pipelines?workspace=${selectedWorkspace}&repoSlug=${repo.slug}`),
                fetch(`/api/bitbucket/environments?workspace=${selectedWorkspace}&repoSlug=${repo.slug}`)
              ]);
              
              // Check for auth errors on any of the responses
              if (await checkAuthError(deploymentsResponse) || 
                  await checkAuthError(pipelinesResponse) || 
                  await checkAuthError(environmentsResponse)) {
                return {
                  ...repo,
                  deployments: [],
                  pipelines: [],
                  deploymentsByEnv: {},
                };
              }

              const deployments = await deploymentsResponse.json();
              const pipelines = await pipelinesResponse.json();
              const environments = await environmentsResponse.json();

              const deploymentsArray = Array.isArray(deployments) ? deployments : [];
              const environmentsArray = Array.isArray(environments) ? environments : [];
              
              // Create a map of environment UUID to environment object
              const envMap = new Map<string, DeploymentEnvironment>();
              for (const env of environmentsArray) {
                envMap.set(env.uuid, env);
              }
              
              // Organize deployments by environment UUID
              const deploymentsByEnv: DeploymentByEnv = {};
              for (const deployment of deploymentsArray) {
                const envUuid = deployment.environment?.uuid || '';
                const env = envMap.get(envUuid);
                
                if (env) {
                  const envKey = env.name.toLowerCase();
                  const isProdEnv = envKey.includes('prod');
                  
                  // For prod, only consider successful/completed deployments
                  const statusName = deployment.state?.status?.name?.toUpperCase() || '';
                  const statusType = deployment.state?.status?.type || '';
                  const stateName = deployment.state?.name?.toUpperCase() || '';
                  const isSuccessful = statusName === 'SUCCESSFUL' || 
                                      statusType.includes('successful') ||
                                      stateName === 'COMPLETED';
                  
                  if (isProdEnv && !isSuccessful) {
                    console.debug(`[${repo.slug}] Skipping prod deployment ${deployment.deployable?.name || deployment.uuid}: state=${JSON.stringify(deployment.state)}`);
                    continue; // Skip non-successful deployments for prod
                  }
                  
                  // Keep the latest deployment for each environment based on created_on timestamp
                  const currentTime = new Date(deployment.created_on).getTime();
                  const existingTime = deploymentsByEnv[envKey] ? new Date(deploymentsByEnv[envKey].created_on).getTime() : 0;
                  
                  if (!deploymentsByEnv[envKey] || currentTime > existingTime) {
                    deploymentsByEnv[envKey] = deployment;
                  }
                }
              }
              
              // Fetch commit messages for deployments using commit hash from deployable
              // Use a cache to avoid fetching the same commit hash multiple times
              const commitCache = new Map<string, string>();
              
              for (const envKey in deploymentsByEnv) {
                const deployment = deploymentsByEnv[envKey];
                const commitHash = deployment.deployable?.commit?.hash;
                
                if (commitHash) {
                  try {
                    let commitMessage: string | undefined;
                    
                    // Check cache first
                    if (commitCache.has(commitHash)) {
                      commitMessage = commitCache.get(commitHash);
                    } else {
                      // Fetch the commit message using the commit hash from deployment
                      const commitResponse = await fetch(
                        `/api/bitbucket/commit?workspace=${selectedWorkspace}&repoSlug=${repo.slug}&commitHash=${commitHash}`
                      );
                      
                      if (await checkAuthError(commitResponse)) {
                        return {
                          ...repo,
                          deployments: [],
                          pipelines: [],
                          deploymentsByEnv: {},
                        };
                      }
                      
                      if (commitResponse.ok) {
                        const commitData = await commitResponse.json();
                        if (commitData.message) {
                          commitMessage = commitData.message;
                          // Cache the result
                          commitCache.set(commitHash, commitData.message);
                        }
                      }
                    }
                    
                    // Update deployment with commit info
                    if (commitMessage) {
                      if (!deployment.commit) {
                        deployment.commit = { hash: commitHash, type: 'commit' };
                      }
                      deployment.commit.message = commitMessage;
                      deployment.commit.hash = commitHash;
                    }
                  } catch (error) {
                    console.error(`${repo.slug} - ${envKey}: Failed to fetch commit message:`, error);
                  }
                }
              }

              return {
                ...repo,
                deployments: deploymentsArray,
                pipelines: Array.isArray(pipelines) ? pipelines.slice(0, 5) : [],
                deploymentsByEnv,
              };
            } catch (error) {
              return {
                ...repo,
                deployments: [],
                pipelines: [],
                deploymentsByEnv: {},
              };
            }
          })
        );

        // Update UI immediately as each project finishes loading (with dedup)
        setProjectGroups(prevGroups => {
          const filtered = prevGroups.filter(g => g.project.key !== project.key);
          return [...filtered, { project, repositories: reposWithDeployments }];
        });
      } catch (error) {
        console.error(`Failed to fetch repos for project ${project.key}:`, error);
      }
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Clear existing groups to prevent duplicates
    setProjectGroups([]);
    // Filter to only selected projects, in order
    const selectedProjectsList = projectOrder
      .filter(key => selectedProjects.has(key))
      .map(key => projects.find(p => p.key === key)!)
      .filter(Boolean);
    await fetchAllDeployments(selectedProjectsList);
    setRefreshing(false);
  };

  const toggleProjectCollapse = (projectKey: string) => {
    const newCollapsed = new Set(collapsedProjects);
    if (newCollapsed.has(projectKey)) {
      newCollapsed.delete(projectKey);
    } else {
      newCollapsed.add(projectKey);
    }
    setCollapsedProjects(newCollapsed);
    
    // Save to localStorage
    const storageKey = `collapsedProjects_${selectedWorkspace}`;
    localStorage.setItem(storageKey, JSON.stringify(Array.from(newCollapsed)));
  };

  const fetchSingleProjectDeployments = async (project: BitbucketProject) => {
    try {
      const reposResponse = await fetch(
        `/api/bitbucket/repositories?workspace=${selectedWorkspace}&projectKey=${project.key}`
      );

      if (await checkAuthError(reposResponse)) {
        return;
      }

      const repos: BitbucketRepository[] = await reposResponse.json();

      const reposWithDeployments: RepoWithDeployments[] = await Promise.all(
        repos.map(async (repo) => {
          try {
            const [deploymentsResponse, pipelinesResponse, environmentsResponse] = await Promise.all([
              fetch(`/api/bitbucket/deployments?workspace=${selectedWorkspace}&repoSlug=${repo.slug}`),
              fetch(`/api/bitbucket/pipelines?workspace=${selectedWorkspace}&repoSlug=${repo.slug}`),
              fetch(`/api/bitbucket/environments?workspace=${selectedWorkspace}&repoSlug=${repo.slug}`)
            ]);

            // Check for auth errors on any of the responses
            if (await checkAuthError(deploymentsResponse) ||
                await checkAuthError(pipelinesResponse) ||
                await checkAuthError(environmentsResponse)) {
              return {
                ...repo,
                deployments: [],
                pipelines: [],
                deploymentsByEnv: {},
              };
            }

            const deployments = await deploymentsResponse.json();
            const pipelines = await pipelinesResponse.json();
            const environments = await environmentsResponse.json();

            const deploymentsArray = Array.isArray(deployments) ? deployments : [];
            const environmentsArray = Array.isArray(environments) ? environments : [];

            const envMap = new Map<string, DeploymentEnvironment>();
            for (const env of environmentsArray) {
              envMap.set(env.uuid, env);
            }

            const deploymentsByEnv: DeploymentByEnv = {};
            for (const deployment of deploymentsArray) {
              const envUuid = deployment.environment?.uuid || '';
              const env = envMap.get(envUuid);

              if (env) {
                const envKey = env.name.toLowerCase();
                const isProdEnv = envKey.includes('prod');

                const statusName = deployment.state?.status?.name?.toUpperCase() || '';
                const statusType = deployment.state?.status?.type || '';
                const stateName = deployment.state?.name?.toUpperCase() || '';
                const isSuccessful = statusName === 'SUCCESSFUL' || 
                                    statusType.includes('successful') ||
                                    stateName === 'COMPLETED';

                if (isProdEnv && !isSuccessful) {
                  continue;
                }

                const currentTime = new Date(deployment.created_on).getTime();
                const existingTime = deploymentsByEnv[envKey] ? new Date(deploymentsByEnv[envKey].created_on).getTime() : 0;

                if (!deploymentsByEnv[envKey] || currentTime > existingTime) {
                  deploymentsByEnv[envKey] = deployment;
                }
              }
            }

            const commitCache = new Map<string, string>();

            for (const envKey in deploymentsByEnv) {
              const deployment = deploymentsByEnv[envKey];
              const commitHash = deployment.deployable?.commit?.hash;

              if (commitHash) {
                try {
                  let commitMessage: string | undefined;

                  if (commitCache.has(commitHash)) {
                    commitMessage = commitCache.get(commitHash);
                  } else {
                    const commitResponse = await fetch(
                      `/api/bitbucket/commit?workspace=${selectedWorkspace}&repoSlug=${repo.slug}&commitHash=${commitHash}`
                    );

                    if (await checkAuthError(commitResponse)) {
                      return {
                        ...repo,
                        deployments: [],
                        pipelines: [],
                        deploymentsByEnv: {},
                      };
                    }

                    if (commitResponse.ok) {
                      const commitData = await commitResponse.json();
                      if (commitData.message) {
                        commitMessage = commitData.message;
                        commitCache.set(commitHash, commitData.message);
                      }
                    }
                  }

                  if (commitMessage) {
                    if (!deployment.commit) {
                      deployment.commit = { hash: commitHash, type: 'commit' };
                    }
                    deployment.commit.message = commitMessage;
                    deployment.commit.hash = commitHash;
                  }
                } catch (error) {
                  console.error(`${repo.slug} - ${envKey}: Failed to fetch commit message:`, error);
                }
              }
            }

            return {
              ...repo,
              deployments: deploymentsArray,
              pipelines: Array.isArray(pipelines) ? pipelines.slice(0, 5) : [],
              deploymentsByEnv,
            };
          } catch (error) {
            return {
              ...repo,
              deployments: [],
              pipelines: [],
              deploymentsByEnv: {},
            };
          }
        })
      );

      // Update in-place to preserve order, or append if new
      setProjectGroups(prevGroups => {
        const index = prevGroups.findIndex(g => g.project.key === project.key);
        if (index >= 0) {
          const updated = [...prevGroups];
          updated[index] = { project, repositories: reposWithDeployments };
          return updated;
        }
        return [...prevGroups, { project, repositories: reposWithDeployments }];
      });
    } catch (error) {
      console.error(`Failed to fetch repos for project ${project.key}:`, error);
    }
  };

  const toggleProject = async (projectKey: string) => {
    const newSelected = new Set(selectedProjects);
    const isRemoving = newSelected.has(projectKey);
    
    if (isRemoving) {
      newSelected.delete(projectKey);
      // Just remove from UI, no API calls needed
      setProjectGroups(prevGroups => prevGroups.filter(g => g.project.key !== projectKey));
    } else {
      newSelected.add(projectKey);
      // Only fetch the newly selected project and append it
      const newProject = projects.find(p => p.key === projectKey);
      if (newProject) {
        await fetchSingleProjectDeployments(newProject);
      }
    }
    
    setSelectedProjects(newSelected);
    
    // Save to localStorage
    const storageKey = `selectedProjects_${selectedWorkspace}`;
    localStorage.setItem(storageKey, JSON.stringify(Array.from(newSelected)));
  };

  const toggleRepo = (projectKey: string, repoSlug: string) => {
    const newSelectedRepos = new Map(selectedRepos);
    const projectRepos = newSelectedRepos.get(projectKey) || new Set<string>();
    
    if (projectRepos.has(repoSlug)) {
      projectRepos.delete(repoSlug);
    } else {
      projectRepos.add(repoSlug);
    }
    
    newSelectedRepos.set(projectKey, projectRepos);
    setSelectedRepos(newSelectedRepos);
    
    // Save to localStorage
    const storageKey = `selectedRepos_${selectedWorkspace}`;
    const toSave: Record<string, string[]> = {};
    newSelectedRepos.forEach((repos, key) => {
      toSave[key] = Array.from(repos);
    });
    localStorage.setItem(storageKey, JSON.stringify(toSave));
  };

  // Projects sorted by projectOrder for the top selector
  const sortedProjects = useMemo(() => {
    if (projectOrder.length === 0) return projects;
    return [...projects].sort((a, b) => {
      const indexA = projectOrder.indexOf(a.key);
      const indexB = projectOrder.indexOf(b.key);
      return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
    });
  }, [projects, projectOrder]);

  // Project groups ordered by projectOrder
  const orderedProjectGroups = useMemo(() => {
    if (projectOrder.length === 0) return projectGroups;
    return [...projectGroups].sort((a, b) => {
      const indexA = projectOrder.indexOf(a.project.key);
      const indexB = projectOrder.indexOf(b.project.key);
      return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
    });
  }, [projectGroups, projectOrder]);

  // Drag-and-drop handlers for project reordering
  const handleDragStart = (projectKey: string) => {
    draggedProjectRef.current = projectKey;
  };

  const handleDragOver = (e: React.DragEvent, projectKey: string) => {
    e.preventDefault();
    setDragOverProject(projectKey);
  };

  const handleDragLeave = () => {
    setDragOverProject(null);
  };

  const handleDrop = (targetKey: string) => {
    const draggedKey = draggedProjectRef.current;
    setDragOverProject(null);
    draggedProjectRef.current = null;

    if (!draggedKey || draggedKey === targetKey) return;

    const newOrder = [...projectOrder];
    const draggedIndex = newOrder.indexOf(draggedKey);
    const targetIndex = newOrder.indexOf(targetKey);
    if (draggedIndex === -1 || targetIndex === -1) return;

    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedKey);

    setProjectOrder(newOrder);
    const orderKey = `projectOrder_${selectedWorkspace}`;
    localStorage.setItem(orderKey, JSON.stringify(newOrder));
  };

  const handleDragEnd = () => {
    draggedProjectRef.current = null;
    setDragOverProject(null);
  };

  const openBitbucketDeployments = (workspace: string, repoSlug: string) => {
    const url = `https://bitbucket.org/${workspace}/${repoSlug}/deployments`;
    window.open(url, '_blank');
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    
    if (statusLower.includes('success') || statusLower.includes('completed')) {
      return <Badge variant="success" className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {status}</Badge>;
    } else if (statusLower.includes('fail') || statusLower.includes('error')) {
      return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="w-3 h-3" /> {status}</Badge>;
    } else if (statusLower.includes('progress') || statusLower.includes('running') || statusLower.includes('pending')) {
      return <Badge variant="warning" className="flex items-center gap-1"><Clock className="w-3 h-3" /> {status}</Badge>;
    } else {
      return <Badge variant="outline" className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {status}</Badge>;
    }
  };

  if (!session) {
    return <div className="flex items-center justify-center h-screen">Please sign in to view the dashboard.</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bitbucket Deployment Dashboard</h1>
          <p className="text-muted-foreground">Manage and monitor your deployments</p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing} className="gap-2">
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workspace & Projects</CardTitle>
          <CardDescription>Select workspace and manage projects</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Workspace</label>
            <select
              value={selectedWorkspace}
              onChange={(e) => setSelectedWorkspace(e.target.value)}
              className="w-full p-2 border rounded-md bg-background"
            >
              {workspaces.map((ws) => (
                <option key={ws.uuid} value={ws.slug}>
                  {ws.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Projects <span className="text-xs text-muted-foreground font-normal">(drag to reorder)</span></label>
            <div className="flex flex-wrap gap-2">
              {sortedProjects.map((project) => (
                <Button
                  key={project.uuid}
                  variant={selectedProjects.has(project.key) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleProject(project.key)}
                  draggable
                  onDragStart={() => handleDragStart(project.key)}
                  onDragOver={(e) => handleDragOver(e, project.key)}
                  onDragLeave={handleDragLeave}
                  onDrop={() => handleDrop(project.key)}
                  onDragEnd={handleDragEnd}
                  className={`gap-2 cursor-grab active:cursor-grabbing ${dragOverProject === project.key ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                >
                  {selectedProjects.has(project.key) ? (
                    <Trash2 className="w-3 h-3" />
                  ) : (
                    <Plus className="w-3 h-3" />
                  )}
                  {project.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <RefreshCw className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {orderedProjectGroups.map((group) => {
            const isCollapsed = collapsedProjects.has(group.project.key);
            return (
              <Card key={group.project.uuid}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <GitBranch className="w-5 h-5" />
                        {group.project.name}
                      </CardTitle>
                      <CardDescription>{group.project.description || 'No description'}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        setRefreshingProjects(prev => new Set(prev).add(group.project.key));
                        await fetchSingleProjectDeployments(group.project);
                        setRefreshingProjects(prev => {
                          const next = new Set(prev);
                          next.delete(group.project.key);
                          return next;
                        });
                      }}
                      disabled={refreshingProjects.has(group.project.key)}
                      className="gap-2"
                    >
                      <RefreshCw className={`w-4 h-4 ${refreshingProjects.has(group.project.key) ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleProjectCollapse(group.project.key)}
                      className="gap-2"
                    >
                      {isCollapsed ? (
                        <>
                          <ChevronRight className="w-4 h-4" />
                          Expand
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          Collapse
                        </>
                      )}
                    </Button>
                    </div>
                  </div>
                </CardHeader>
                {!isCollapsed && (
                  <CardContent>
                    {(() => {
                      const projectRepos = selectedRepos.get(group.project.key);
                      // Repos in the set are deselected (unchecked/hidden)
                      const deselectedRepos = group.repositories.filter(repo => 
                        projectRepos && projectRepos.size > 0 && projectRepos.has(repo.slug)
                      );
                      const repoToAdd = repoToAddByProject.get(group.project.key) || '';
                      
                      return (
                        <>
                          {deselectedRepos.length > 0 && (
                            <div className="mb-4 flex items-center gap-2">
                              <label className="text-sm font-medium">Add Repository:</label>
                              <select
                                value={repoToAdd}
                                onChange={(e) => {
                                  const newMap = new Map(repoToAddByProject);
                                  newMap.set(group.project.key, e.target.value);
                                  setRepoToAddByProject(newMap);
                                }}
                                className="p-2 border rounded-md bg-background flex-1"
                              >
                                <option value="">Select a repository...</option>
                                {deselectedRepos.map((repo) => (
                                  <option key={repo.uuid} value={repo.slug}>
                                    {repo.name}
                                  </option>
                                ))}
                              </select>
                              <Button
                                size="sm"
                                onClick={() => {
                                  if (repoToAdd) {
                                    toggleRepo(group.project.key, repoToAdd);
                                    const newMap = new Map(repoToAddByProject);
                                    newMap.set(group.project.key, '');
                                    setRepoToAddByProject(newMap);
                                  }
                                }}
                                disabled={!repoToAdd}
                                className="gap-2"
                              >
                                <Plus className="w-4 h-4" />
                                Add
                              </Button>
                            </div>
                          )}
                        </>
                      );
                    })()}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-3 font-medium">Repository</th>
                            {environments.map((env) => (
                              <th key={env.uuid} className="text-left p-3 font-medium">
                                {env.name}
                              </th>
                            ))}
                            <th className="text-left p-3 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.repositories
                            .filter(repo => {
                              const projectRepos = selectedRepos.get(group.project.key);
                              // If no repos deselected for this project, show all
                              if (!projectRepos || projectRepos.size === 0) return true;
                              // Otherwise hide deselected repos (repos in the set are unchecked/hidden)
                              return !projectRepos.has(repo.slug);
                            })
                            .map((repo) => {
                        // Find test and prod environments
                        const testEnv = environments.find(e => e.name.toLowerCase().includes('test'));
                        const prodEnv = environments.find(e => e.name.toLowerCase().includes('prod'));
                        
                        const testKey = testEnv?.name.toLowerCase();
                        const prodKey = prodEnv?.name.toLowerCase();
                        
                        // Get latest successful deployment for prod
                        const prodDeployment = prodKey ? repo.deploymentsByEnv[prodKey] : undefined;
                        const testDeployment = testKey ? repo.deploymentsByEnv[testKey] : undefined;
                        
                        // Check if test and prod have same pipeline number
                        const testPipelineNum = testDeployment?.deployable?.name || `#${testDeployment?.number}`;
                        const prodPipelineNum = prodDeployment?.deployable?.name || `#${prodDeployment?.number}`;
                        const isProdUpToDate = testPipelineNum === prodPipelineNum;

                        const renderEnvCell = (deployment: BitbucketDeployment | undefined, envName: string, isProd: boolean) => {
                          if (!deployment) {
                            return <span className="text-muted-foreground text-sm">No deployment</span>;
                          }

                          const pipelineNumber = deployment.deployable?.name || `#${deployment.number}`;
                          const commitMessage = deployment.commit?.message || 'No commit message';
                          const commitHash = deployment.commit?.hash?.substring(0, 7) || '';
                          const date = new Date(deployment.created_on).toLocaleDateString();
                          const status = deployment.state?.status?.name || deployment.state?.name || 'Unknown';
                          
                          // For prod, determine background color
                          const bgColor = isProd ? (isProdUpToDate ? 'bg-green-50' : 'bg-yellow-50') : '';
                          
                          // Combine commit hash and message
                          const commitInfo = commitHash ? `${commitHash} ${commitMessage}` : commitMessage;

                          return (
                            <div className={`text-sm space-y-1 p-2 rounded ${bgColor}`}>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(status)}
                              </div>
                              <div className="font-semibold text-xs">
                                {pipelineNumber}
                              </div>
                              <div className="text-xs text-muted-foreground line-clamp-2" title={commitInfo}>
                                {commitInfo}
                              </div>
                              <div className="text-xs text-muted-foreground">{date}</div>
                            </div>
                          );
                        };

                        // Check if repo is selected (checked = visible, unchecked = hidden)
                        const projectRepos = selectedRepos.get(group.project.key);
                        // Repo is checked if it's NOT in the deselected set
                        const isRepoSelected = !projectRepos || projectRepos.size === 0 || !projectRepos.has(repo.slug);
                        
                        return (
                          <tr 
                            key={repo.uuid} 
                            className="border-b hover:bg-muted/50"
                          >
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={isRepoSelected}
                                  onChange={() => toggleRepo(group.project.key, repo.slug)}
                                  className="w-4 h-4 cursor-pointer"
                                />
                                <div>
                                  <div className="font-medium">{repo.name}</div>
                                  <div className="text-sm text-muted-foreground">{repo.slug}</div>
                                </div>
                              </div>
                            </td>
                            {environments.map((env, index) => {
                              const envKey = env.name.toLowerCase();
                              const deployment = repo.deploymentsByEnv[envKey];
                              const isProd = env.name.toLowerCase().includes('prod');
                              return (
                                <td key={env.uuid} className="p-3 align-top">
                                  {renderEnvCell(deployment, env.name, isProd)}
                                </td>
                              );
                            })}
                            <td className="p-3 align-top">
                              {!isProdUpToDate && testDeployment && prodDeployment && (
                                <Button
                                  size="sm"
                                  onClick={() => openBitbucketDeployments(selectedWorkspace, repo.slug)}
                                  className="gap-2"
                                >
                                  <Play className="w-3 h-3" />
                                  Deploy to Prod
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                )}
            </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
