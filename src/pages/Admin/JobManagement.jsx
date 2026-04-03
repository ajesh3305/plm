import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Card, CardHeader, CardBody } from '../../components/UI/Card';
import Table from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobName, setJobName] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const qs = await getDocs(collection(db, 'jobs'));
      setJobs(qs.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!jobName.trim()) return;
    try {
      if (editId) {
        await updateDoc(doc(db, 'jobs', editId), { name: jobName });
        setEditId(null);
      } else {
        await addDoc(collection(db, 'jobs'), { name: jobName });
      }
      setJobName('');
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await deleteDoc(doc(db, 'jobs', id));
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { header: 'Job ID', accessor: 'id' },
    { header: 'Job Name', accessor: 'name' },
    {
      header: 'Actions',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button size="sm" onClick={() => {
            setEditId(row.id);
            setJobName(row.name);
          }}>Edit</Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(row.id)}>Delete</Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', margin: 0 }}>Job Management</h1>

      <Card style={{ marginBottom: '1.5rem' }}>
        <CardHeader title={editId ? "Edit Job" : "Add New Job"} />
        <CardBody>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', gap: '1rem', alignItems: window.innerWidth < 768 ? 'stretch' : 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <Input 
                label="Job Name" 
                value={jobName} 
                onChange={e => setJobName(e.target.value)} 
                required 
                placeholder="e.g. Order #1234 - Plastic Cups"
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: window.innerWidth < 768 ? '0' : '1rem' }}>
              {editId && (
                <Button type="button" onClick={() => {
                  setEditId(null);
                  setJobName('');
                }}>Cancel</Button>
              )}
              <Button type="submit">{editId ? "Update Job" : "Add Job"}</Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
        ) : (
          <Table columns={columns} data={jobs} />
        )}
      </Card>
    </div>
  );
};

export default JobManagement;
