import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import app from './src/app.js';
import connectDB from './connectDB.js';

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log(`Server is running at port: ${process.env.PORT || 8080}`);
    });
  })
  .catch((err) => {
    console.log('MONGO db connection failed !!!', err);
  });
