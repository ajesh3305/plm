import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { CSVLink } from 'react-csv';
import { Card, CardHeader, CardBody } from '../../components/UI/Card';
import Table from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';
import { Download } from 'lucide-react';

const RecordsView = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const getCurrentMonth = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  };

  const [filterMonth, setFilterMonth] = useState(getCurrentMonth());
  const [filterDate, setFilterDate] = useState('');
  const [filterShift, setFilterShift] = useState('');
  const [filterMachine, setFilterMachine] = useState('');

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'plant_records'), orderBy('date', 'desc'));
      const qs = await getDocs(q);
      const data = qs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecords(data);
      setFilteredRecords(data);
    } catch (err) {
      console.error("Error fetching records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    let result = records;
    if (filterMonth) result = result.filter(r => r.date && r.date.startsWith(filterMonth));
    if (filterDate) result = result.filter(r => r.date === filterDate);
    if (filterShift) result = result.filter(r => r.shift === filterShift);
    if (filterMachine) result = result.filter(r => r.machineName.toLowerCase().includes(filterMachine.toLowerCase()));
    setFilteredRecords(result);
  }, [filterMonth, filterDate, filterShift, filterMachine, records]);

  const clearFilters = () => {
    setFilterMonth(getCurrentMonth());
    setFilterDate('');
    setFilterShift('');
    setFilterMachine('');
  };

  const totalProduction = filteredRecords.reduce((sum, r) => sum + (Number(r.productionQty) || 0), 0);
  const totalWaste = filteredRecords.reduce((sum, r) => sum + (Number(r.wasteQty) || 0), 0);

  const columns = [
    { header: 'Date', accessor: 'date' },
    { header: 'Shift', accessor: 'shift' },
    { header: 'Operator', accessor: 'operatorName' },
    { header: 'Machine', accessor: 'machineName' },
    { header: 'Job', accessor: 'jobName' },
    { header: 'Production', accessor: 'productionQty' },
    { header: 'Waste', accessor: 'wasteQty' }
  ];

  const csvHeaders = [
    { label: 'Date', key: 'date' },
    { label: 'Shift', key: 'shift' },
    { label: 'Operator', key: 'operatorName' },
    { label: 'Machine', key: 'machineName' },
    { label: 'Job', key: 'jobName' },
    { label: 'Production Qty', key: 'productionQty' },
    { label: 'Waste Qty', key: 'wasteQty' }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0 }}>Production Records</h1>
        {filteredRecords.length > 0 && (
          <CSVLink 
            data={filteredRecords} 
            headers={csvHeaders} 
            filename={`production-records-${new Date().toISOString().split('T')[0]}.csv`}
            style={{ textDecoration: 'none' }}
          >
            <Button size="sm" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Download size={16} /> Export CSV
            </Button>
          </CSVLink>
        )}
      </div>

      <Card style={{ marginBottom: '1.5rem' }}>
        <CardBody>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'end' }}>
            <Input 
              label="Filter by Month" 
              type="month" 
              value={filterMonth} 
              onChange={e => {
                setFilterMonth(e.target.value);
                setFilterDate('');
              }} 
            />
            <Input 
              label="Specific Date" 
              type="date" 
              value={filterDate} 
              onChange={e => {
                setFilterDate(e.target.value);
                if (e.target.value) setFilterMonth('');
              }} 
            />
            <Select 
              label="Filter by Shift"
              value={filterShift}
              onChange={e => setFilterShift(e.target.value)}
              options={[
                { label: 'All Shifts', value: '' },
                { label: 'Day', value: 'Day' },
                { label: 'Night', value: 'Night' }
              ]}
              placeholder="All Shifts"
            />
            <Input 
              label="Filter by Machine" 
              placeholder="Machine name..."
              value={filterMachine} 
              onChange={e => setFilterMachine(e.target.value)} 
            />
            <div style={{ marginBottom: '1rem' }}>
              <Button variant="secondary" onClick={clearFilters} fullWidth>Clear Filters</Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {!loading && filteredRecords.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <Card style={{ borderLeft: '4px solid var(--success)' }}>
            <CardBody style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Total Production</span>
              <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '0.5rem' }}>{totalProduction.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </CardBody>
          </Card>
          <Card style={{ borderLeft: '4px solid var(--danger)' }}>
            <CardBody style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Total Waste</span>
              <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '0.5rem' }}>{totalWaste.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </CardBody>
          </Card>
        </div>
      )}

      <Card>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading records...</div>
        ) : (
          <Table columns={columns} data={filteredRecords} />
        )}
      </Card>
    </div>
  );
};

export default RecordsView;
