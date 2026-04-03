import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Card, CardHeader, CardBody } from '../../components/UI/Card';
import Table from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select'; 

const OperatorMachineManagement = () => {
  const [operatorMachines, setOperatorMachines] = useState([]);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [operatorName, setOperatorName] = useState('');
  const [selectedMachine, setSelectedMachine] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const qs = await getDocs(collection(db, 'operator_machines'));
      setOperatorMachines(qs.docs.map(d => ({ id: d.id, ...d.data() })));
      
      const machineQs = await getDocs(collection(db, 'machines'));
      setMachines(machineQs.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!operatorName.trim() || !selectedMachine) return;
    try {
      await addDoc(collection(db, 'operator_machines'), { 
        name: operatorName,
        machineName: selectedMachine 
      });
      setOperatorName('');
      setSelectedMachine('');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this operator mapping?")) return;
    try {
      await deleteDoc(doc(db, 'operator_machines', id));
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Operator name', accessor: 'name' },
    { header: 'Machine Name', render: (_, row) => row.machineName || 'None' },
    {
      header: 'Actions',
      render: (_, row) => (
        <Button size="sm" variant="danger" onClick={() => handleDelete(row.id)}>Delete</Button>
      )
    }
  ];

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', margin: 0 }}>Operator Machine Management</h1>

      <Card style={{ marginBottom: '1.5rem' }}>
        <CardHeader title="Add Operator Mapping" />
        <CardBody>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', gap: '1rem', alignItems: window.innerWidth < 768 ? 'stretch' : 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <Input
                label="Operator name"
                value={operatorName}
                onChange={e => setOperatorName(e.target.value)}
                required
                placeholder="e.g. John Doe"
              />
            </div>
            <div style={{ flex: 1 }}>
              <Select
                label="Machine Name"
                value={selectedMachine}
                onChange={e => setSelectedMachine(e.target.value)}
                required
                options={[
                  { label: 'Select Machine...', value: '' },
                  ...machines.map(m => ({ label: m.name, value: m.name }))
                ]}
              />
            </div>
            <div style={{ marginBottom: window.innerWidth < 768 ? '0' : '1rem' }}>
              <Button type="submit">Add Mapping</Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
        ) : (
          <Table columns={columns} data={operatorMachines} />
        )}
      </Card>
    </div>
  );
};

export default OperatorMachineManagement;
