import JobList from '../components/JobList';
import PaginationBar from '../components/PaginationBar';
import { useJobs } from '../graphql/hooks.js';
import { useState } from 'react';

const JOBS_PER_PAGE = 10;

function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { jobs, loading, error } 
        = useJobs(JOBS_PER_PAGE, (currentPage - 1) * JOBS_PER_PAGE);
  if (loading) 
    return <p>Loading...</p>
  if (error){
    return <p className='has-text-danger'>Data Unavailable</p>
  }
  const totalPages = Math.ceil(jobs.totalCount / JOBS_PER_PAGE);
  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      <PaginationBar currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      <JobList jobs={jobs.items} />
    </div>
  );
}

export default HomePage;
