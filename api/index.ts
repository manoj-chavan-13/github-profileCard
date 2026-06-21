import express from 'express';
import dotenv from 'dotenv';
import impactRoutes from '../src/routes/impact';
import journeyRoutes from '../src/routes/journey';
import badgeRoutes from '../src/routes/badge';
import contributionBugRoutes from '../src/routes/contribution-bug';
import languagesRoutes from '../src/routes/languages';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use('/api/impact', impactRoutes);
app.use('/api/journey', journeyRoutes);
app.use('/api/badge', badgeRoutes);
app.use('/api/contribution-bug', contributionBugRoutes);
app.use('/api/languages', languagesRoutes);

app.get('/', (req, res) => {
  res.redirect('https://github.com/manoj-chavan-13/github-profileCard');
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

export default app;
