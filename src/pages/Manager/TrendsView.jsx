import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { Card, CardHeader, CardBody } from '../../components/UI/Card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TrendsView = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'plant_records'), orderBy('date', 'asc'));
        const qs = await getDocs(q);
        const records = qs.docs.map(doc => doc.data());
        
        // Aggregate by date
        const aggregated = records.reduce((acc, curr) => {
          if (!acc[curr.date]) {
            acc[curr.date] = { date: curr.date, production: 0, waste: 0 };
          }
          acc[curr.date].production += curr.productionQty;
          acc[curr.date].waste += curr.wasteQty;
          return acc;
        }, {});
        
        setData(Object.values(aggregated));
      } catch (err) {
        console.error("Error fetching aggregated data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading charts...</div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', margin: 0 }}>Production Trends</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        <Card>
          <CardHeader title="Daily Production Output" subtitle="Total production across all machines" />
          <CardBody>
            <div style={{ height: '400px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="date" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip wrapperStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="production" name="Production Qty" stroke="var(--brand-primary)" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Production vs Waste" subtitle="Daily comparison" />
          <CardBody>
            <div style={{ height: '400px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="date" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip wrapperStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }} />
                  <Legend />
                  <Bar dataKey="production" name="Production Qty" fill="var(--success)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="waste" name="Waste Qty" fill="var(--danger)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default TrendsView;
