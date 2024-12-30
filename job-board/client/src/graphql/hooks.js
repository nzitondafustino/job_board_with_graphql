import { useMutation, useQuery } from '@apollo/client';
import { getCompanyByIdQuery, getJobByIdQuery, getJobsQuery, createJobMutation } from './queries';


export function useCompany(companyId) {
    const {data, loading, error }  = useQuery(getCompanyByIdQuery,  {
      variables: { id: companyId }
    })
    return { company: data?.company, loading, error: Boolean(error)};
  }

export function useJob(jobId) {
    const { data, loading, error } = useQuery(getJobByIdQuery,
        { variables: { id: jobId } }
    );
    return { job: data?.job, loading, error: Boolean(error) };
  }

export function useJobs(limit, offset) {
    const { data, loading, error } = useQuery(getJobsQuery, { 
            variables: { limit: limit, offset: offset },
            fetchPolicy: 'network-only' 
        }
    );
    return { jobs: data?.jobs, loading, error: Boolean(error) };
  }

export function useCreateJob() {
    const [mutate, { loading }] = useMutation(createJobMutation);

    const createJob = async (title, description) => {
        const { data: {job} } = await mutate({ variables: { input: { title, description } },
            update: (cache, { data }) => {
              cache.writeQuery({
                  query: getJobByIdQuery,
                  variables: { id: data.job.id },
                  data
              })
        }});
        return job;
    }
    return { 
        createJob, 
        loading };
  }
