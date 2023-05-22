import { Connection, Request } from 'tedious';
import { config } from 'dotenv';

// Load Azure database connection configuration from .env file
config();

describe('Azure Database Test', () => {
  let connection;

  before(() => {
    // Set up Azure database connection
    connection = new Connection({
      server: process.env.AZURE_DB_SERVER,
      authentication: {
        type: 'default',
        options: {
          userName: process.env.AZURE_DB_USERNAME,
          password: process.env.AZURE_DB_PASSWORD,
        },
      },
      options: {
        encrypt: true,
        database: process.env.AZURE_DB_NAME,
      },
    });

    // Connect to Azure database
    connection.connect();
  });

  it('should fetch data from Azure database', (done) => {
    // Create a SQL query
    const sqlQuery = 'SELECT * FROM [SalesLT].[Address]';

    // Execute the query
    const request = new Request(sqlQuery, (error, rowCount, rows) => {
      // Assert the result or perform further validation
      expect(error).to.be.null;
      expect(rowCount).to.be.greaterThan(0);
      expect(rows.length).to.be.greaterThan(0);
      
      // Print the fetched data to the 
      rows.forEach((row) => {
        console.log(row);
      });

      done();
    });

    // Execute the request
    connection.execSql(request);
  });

  after(() => {
    // Close the Azure database connection
    connection.close();
  });
});


/*
Note From Monika - 
We need to include the following Dependency to the package file - 
    "dotenv": "^10.0.0"
    "tedious": "^14.0.0"
We already have the login creds on process.env file
*/    