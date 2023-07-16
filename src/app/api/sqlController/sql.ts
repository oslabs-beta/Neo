// import { Pool, PoolClient } from 'pg';

// const pg_URI = 'postgres://gymssbhl:nN2Eg1LZKQ-liUJdig1ZIgVNQTJ_5kvc@mahmud.db.elephantsql.com/gymssbhl';

// const pool = new Pool({
//   connectionString: pg_URI
// })

// export default async function connectToDatabase() {

//   type sqlFuncs = {
//     dbClient?: PoolClient,
//     dbRelease?: () => void
//   }

//   const dbFuncs: sqlFuncs = {};

//   try {
//     const client = await pool.connect();
//     console.log('Connected!');

//     dbFuncs.dbClient = client; // persists connection through middleware
//     dbFuncs.dbRelease = () => client.release(); // ends connection

//     return dbFuncs;

//   } catch (error) {
//     console.log('Error connecting to SQL Database: ', error);
//     throw error;
//   }
// };

// /* 

// CREATE TABLE Users (
//   user_id SERIAL PRIMARY KEY,  
//   name NVARCHAR(255) NOT NULL,
//   email NVARCHAR(255) NOT NULL,
//   password NVARCHAR(255) NOT NULL,
//   CONSTRAINT userEmail UNIQUE (email)
// );

// CREATE TABLE Account {
//   id SERIAL PRIMARY KEY,
//   user_id INT NOT NULL,
//   type NVARCHAR(255) NOT NULL,
//   provider NVARCHAR(255) NOT NULL,
//   provider_account_id NVARCHAR(255) NOT NULL,
//   refresh_token 
//   access_token
//   FOREIGN KEY (user_id) REFERENCES Users(user_id),
// }

// */