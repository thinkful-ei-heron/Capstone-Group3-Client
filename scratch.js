User => 
{
  id,
  name,
  org: {
    name
    id
  },
  role
}

Project =>
{
  id,
  date_created,
  deadline,
  description,
  name,
  org_id,
  progress,
  project_manager,
  project_workers
}

Job => 
{
  id,
  approval
  date_created
  deadline
  description
  name
  organization
  progress
  project_id
  project_manager
  revision
  status
}

Org => { admin, name }

Employees => [user1,user2,user3]