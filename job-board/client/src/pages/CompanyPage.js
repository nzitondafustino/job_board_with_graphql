import { useParams } from 'react-router';
import JobList from '../components/JobList';
import { useCompany } from '../graphql/hooks';


function CompanyPage() {
  const { companyId } = useParams();

  const { company, loading, error }  = useCompany(companyId);

  if (loading) 
    return <p>Loading...</p>
  if (error){
    return <p className='has-text-danger'>Data Unavailable</p>
  }
  return (
    <div>
      <h1 className="title">
        {company.name}
      </h1>
      <div className="box">
        {company.description}
      </div>
      <h1 className="title is-5">
        Jobs at {company.name}
      </h1>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
