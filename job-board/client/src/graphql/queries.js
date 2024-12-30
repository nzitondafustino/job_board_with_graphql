
import { ApolloClient, InMemoryCache, gql, createHttpLink, ApolloLink,concat } from '@apollo/client';
import { getAccessToken } from '../lib/auth.js';

const httpLink = createHttpLink({uri: 'http://localhost:9000/graphql'})
const customLink = new ApolloLink((operation, forward) => {
    const token = getAccessToken()
    if (token) 
        operation.setContext({
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
    return forward(operation)
})
export const apolloClient = new ApolloClient({
    link: concat(customLink,httpLink),
    cache: new InMemoryCache()
})

export const getCompanyByIdQuery = gql`
    query Company($id: ID!) {
        company(id: $id) {
            id
            name
            description
            jobs {
                id
                title
                date
                description
            }
        }
    }  
`

const joDetailFragment = gql`
    fragment jobDetails on Job {
        id
        company {
            id
            name
        }
        date
        title
        description
}`

export const getJobByIdQuery = gql`
        query Job($id: ID!) {
            job(id: $id) {
                ...jobDetails
            }
        }
        ${joDetailFragment}`;

export const getJobsQuery = gql`
        query($limit: Int, $offset: Int)  {
            jobs(limit: $limit, offset: $offset) {
                items {
                    id
                    company {
                        id
                        name
                    }
                    date
                    title
                    description
                }
                totalCount
            }
}  
`
export const createJobMutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
    job: createJob(input: $input) {
        ...jobDetails
    }
}
${joDetailFragment}
`