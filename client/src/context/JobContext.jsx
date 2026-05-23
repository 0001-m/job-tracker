import { createContext, useContext, useState, useCallback } from 'react';
import axios from '../api/axios';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchJobs = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const { data } = await axios.get('/jobs', { params: filters });
      setJobs(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    const { data } = await axios.get('/jobs/stats');
    setStats(data);
  }, []);

  const addJob = async (jobData) => {
    const { data } = await axios.post('/jobs', jobData);
    setJobs(prev => [data, ...prev]); // prepend to list
  };

  const updateJob = async (id, jobData) => {
    const { data } = await axios.put(`/jobs/${id}`, jobData);
    setJobs(prev => prev.map(j => j._id === id ? data : j));
  };

  const deleteJob = async (id) => {
    await axios.delete(`/jobs/${id}`);
    setJobs(prev => prev.filter(j => j._id !== id));
  };

  return (
    <JobContext.Provider value={{ jobs, stats, loading, fetchJobs, fetchStats, addJob, updateJob, deleteJob }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => useContext(JobContext);