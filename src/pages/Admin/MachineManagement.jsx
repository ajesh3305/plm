import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Card, CardHeader, CardBody } from '../../components/UI/Card';
import Table from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';

const MachineManagement = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [machineName, setMachineName] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchMachines = async () => {
    setLoading(true);
    try {
      const qs = await getDocs(collection(db, 'machines'));
      setMachines(qs.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!machineName.trim()) return;
    try {
      if (editId) {
        await updateDoc(doc(db, 'machines', editId), { name: machineName });
        setEditId(null);
      } else {
        await addDoc(collection(db, 'machines'), { name: machineName });
      }
      setMachineName('');
      fetchMachines();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this machine?")) return;
    try {
      await deleteDoc(doc(db, 'machines', id));
      fetchMachines();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { header: 'Machine ID', accessor: 'id' },
    { header: 'Machine Name', accessor: 'name' },
    {
      header: 'Actions',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button size="sm" onClick={() => {
            setEditId(row.id);
            setMachineName(row.name);
          }}>Edit</Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(row.id)}>Delete</Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', margin: 0 }}>Machine Management</h1>

      <Card style={{ marginBottom: '1.5rem' }}>
        <CardHeader title={editId ? "Edit Machine" : "Add New Machine"} />
        <CardBody>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', gap: '1rem', alignItems: window.innerWidth < 768 ? 'stretch' : 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <Input
                label="Machine Name"
                value={machineName}
                onChange={e => setMachineName(e.target.value)}
                required
                placeholder="e.g. Extruder A"
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: window.innerWidth < 768 ? '0' : '1rem' }}>
              {editId && (
                <Button type="button" onClick={() => {
                  setEditId(null);
                  setMachineName('');
                }}>Cancel</Button>
              )}
              <Button type="submit">{editId ? "Update Machine" : "Add Machine"}</Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
        ) : (
          <Table columns={columns} data={machines} />
        )}
      </Card>
    </div>
  );
};

export default MachineManagement;
