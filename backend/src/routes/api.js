router.get('/dashboard-data', async (req, res) => {
  try {
    const data = await // ... your data fetching logic
    console.log('Dashboard data being sent:', data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: error.message });
  }
}); 