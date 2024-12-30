import { getJobs, getJob, getJobsByCompany, createJob, deleteJob, updateJob, getJobsCount } from './db/jobs.js';
import { getCompany } from './db/companies.js';
import { GraphQLError } from "graphql";

export const resolvers = {
    Query: {
        company: async(_root, { id }) => { 
            const company = await getCompany(id);
            if (!company) {
                throw throwNotFound(`Company not found: ${id}`);
            }
            return company;
        },
        job: async (_root, { id }) => { 
            const job = await getJob(id)
            if (!job) {
                throw throwNotFound(`Job not found: ${id}`);
            }
            return job;
        },
        jobs : async (_root, { limit, offset}) => {
            const items = await getJobs(limit, offset)
            const totalCount = await getJobsCount();
            return {
                items,
                totalCount
            }

        }
    },
    Mutation: {
        createJob: async (_root, { input: { title, description } }, { user }) => {
            if (!user) {
                throw throwUnauthorized('Not authenticated');
            }
            return createJob({companyId: user.companyId, title, description});
    
        },
        deleteJob: async (_root, { id }, { user }) => { 
            if (!user) {
                throw throwUnauthorized('Not authenticated');
            }
            const job = await deleteJob(id, user.companyId);
            if (!job) {
                throw throwNotFound(`Job not found: ${id}`);
            }
            return job;
        },
        updateJob: async (_root, { input: { id, title, description } }, { user }) => {
            if (!user) {
                throw throwUnauthorized('Not authenticated');
            }
            const job = await updateJob({ id, companyId: user.companyId, title, description })
            if (!job) {
                throw throwNotFound(`Job not found: ${id}`);
            }
            return job;
        }

    },
    Company: {
        jobs: (company) => getJobsByCompany(company.id)
    },
    Job: {
        company: (job, _args, { companyLoader }) => {
            return companyLoader.load(job.companyId);
        },
        date: (job) => {
            return toIsoDate(job.createdAt);
        }
    }
}

function throwNotFound(message) {
    return new GraphQLError(message, {
        extensions: { code: 'NOT_FOUND' }
    });
}

function throwUnauthorized(message) {
    return new GraphQLError(message, {
        extensions: { code: 'UNAUTHORIZED' }
    });
}

function toIsoDate(date) {
    return date.slice(0, 'yyyy-mm-dd'.length);
}