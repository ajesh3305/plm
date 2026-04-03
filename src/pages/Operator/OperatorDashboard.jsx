import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardBody } from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';

const OperatorDashboard = () => {
  const { currentUser } = useAuth();
  const [mappings, setMappings] = useState([]);
  const [uniqueOperators, setUniqueOperators] = useState([]);
  const [availableMachines, setAvailableMachines] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    shift: 'Day',
    operatorName: '',
    machineName: '',
    jobName: '',
    productionQty: '',
    wasteQty: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mappingsSnap, jobsSnap] = await Promise.all([
          getDocs(collection(db, 'operator_machines')),
          getDocs(collection(db, 'jobs'))
        ]);
        
        const mappingList = mappingsSnap.docs.map(d => d.data());
        setMappings(mappingList);
        
        // Extract unique operator names
        const ops = [...new Set(mappingList.map(m => m.name))].sort();
        setUniqueOperators(ops);
        
        setJobs(jobsSnap.docs.map(d => d.data().name));
      } catch (err) {
        console.error("Error fetching form data dependencies:", err);
      }
    };
    fetchData();
  }, []);

  // Update available machines when operator changes
  useEffect(() => {
    if (formData.operatorName) {
      const machinesForOp = mappings
        .filter(m => m.name === formData.operatorName)
        .map(m => m.machineName)
        .filter(Boolean);
      setAvailableMachines(machinesForOp);
      
      // Reset machine if current selection isn't in new list
      if (!machinesForOp.includes(formData.machineName)) {
        setFormData(prev => ({ ...prev, machineName: '' }));
      }
    } else {
      setAvailableMachines([]);
      setFormData(prev => ({ ...prev, machineName: '' }));
    }
  }, [formData.operatorName, mappings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    try {
      const parsedDate = new Date(formData.date);
      const monthPrefix = `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}`;

      await addDoc(collection(db, 'plant_records'), {
        date: formData.date,
        month: monthPrefix,
        shift: formData.shift,
        operatorId: currentUser.uid,
        operatorName: formData.operatorName, // Use the selected operator name
        machineName: formData.machineName,
        jobName: formData.jobName,
        productionQty: Number(formData.productionQty),
        wasteQty: Number(formData.wasteQty),
        timestamp: new Date()
      });

      setSuccessMsg('Record submitted successfully!');
      setFormData(prev => ({
        ...prev,
        productionQty: '',
        wasteQty: ''
      }));
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      console.error(err);
      alert('Failed to submit record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem', margin: 0 }}>Operator Dashboard</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Enter production records for your shift.</p>

      {successMsg && (
        <div style={{ padding: '1rem', backgroundColor: '#dcfce7', color: '#166534', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontWeight: '500' }}>
          {successMsg}
        </div>
      )}

      <Card className="animate-fade-in">
        <CardHeader title="New Production Record" />
        <CardBody>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div className="responsive-grid responsive-grid-2">
              <Input 
                label="Date" 
                type="date" 
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                required 
              />
              <Select 
                label="Shift" 
                value={formData.shift}
                onChange={e => setFormData({...formData, shift: e.target.value})}
                options={[
                  { label: 'Day (8am to 8pm)', value: 'Day' },
                  { label: 'Night (8pm to 8am)', value: 'Night' }
                ]}
                required
              />
            </div>

            <div className="responsive-grid responsive-grid-2">
              <Select 
                label="Operator Name" 
                value={formData.operatorName}
                onChange={e => setFormData({...formData, operatorName: e.target.value})}
                options={[
                  { label: 'Select Operator...', value: '' },
                  ...uniqueOperators.map(op => ({ label: op, value: op }))
                ]}
                required
              />
              <Select 
                label="Machine" 
                value={formData.machineName}
                onChange={e => setFormData({...formData, machineName: e.target.value})}
                options={[
                  { label: 'Select Machine...', value: '' },
                  ...availableMachines.map(m => ({ label: m, value: m }))
                ]}
                required
                disabled={!formData.operatorName}
              />
            </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <label style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                  Job Name
                </label>
                <input 
                  list="job-suggestions" 
                  value={formData.jobName}
                  onChange={e => setFormData({...formData, jobName: e.target.value})}
                  required
                  placeholder="Type to search jobs..."
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                  }}
                />
                <datalist id="job-suggestions">
                  {jobs.map((job, idx) => (
                    <option key={idx} value={job} />
                  ))}
                </datalist>
              </div>

            <div className="responsive-grid responsive-grid-2" style={{ marginTop: '1rem' }}>
              <Input 
                label="Production Quantity" 
                type="number" 
                min="0"
                step="0.01"
                value={formData.productionQty}
                onChange={e => setFormData({...formData, productionQty: e.target.value})}
                required 
              />
              <Input 
                label="Waste Quantity" 
                type="number" 
                min="0"
                step="0.01"
                value={formData.wasteQty}
                onChange={e => setFormData({...formData, wasteQty: e.target.value})}
                required 
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <Button type="submit" disabled={loading} size="lg">
                {loading ? 'Submitting...' : 'Submit Data'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default OperatorDashboard;
