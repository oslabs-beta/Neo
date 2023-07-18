import { Pool, PoolClient } from 'pg';

const pg_URI = 'postgres://gymssbhl:nN2Eg1LZKQ-liUJdig1ZIgVNQTJ_5kvc@mahmud.db.elephantsql.com/gymssbhl';

const pool = new Pool({
  connectionString: pg_URI
})

export default async function connectToDatabase() {

  type sqlFuncs = {
    dbClient?: PoolClient,
    dbRelease?: () => void
  }

  const dbFuncs: sqlFuncs = {};

  try {
    const client = await pool.connect();
    console.log('Connected!');

    dbFuncs.dbClient = client; // persists connection through middleware
    dbFuncs.dbRelease = () => client.release(); // ends connection

    return dbFuncs;

  } catch (error) {
    console.log('Error connecting to SQL Database: ', error);
    throw error;
  }
};
