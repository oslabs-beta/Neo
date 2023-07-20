/* 
Docker Controller contains functions for:
  - Add Files: Creating Dockerfile and Docker Ignore in Users App
  - Build and Run: Stopping any previous instance of Docker Container, Creating Image, and Running a Container, and setting a stop terminal command to close and remove the container and image after 15 minutes
*/

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
const execSync = promisify(exec);

export const dockerFuncs = {

  AddFiles: async ({ newAppPath, dockerFilePath }: { [key: string]: unknown }): Promise<void> => {

    try {
      fs.cp('Dockerfile.template', `${dockerFilePath}`, err => {
        if (err) console.log('error while adding Dockerfile: ', err);
      })

      fs.cp('.dockerignore', `${newAppPath}/.dockerignore`, err => {
        if (err) console.log('error while adding Dockerfile: ', err);
      })
      // COPYING THE DEFAULT VERCEL INSTRUMENTATION SCRIPT INTO THE CONTAINER
      // For devs: we were trying to set up OpenTelemetry in the user containers so that we could retreive metrics at a componenet level
      fs.cp('src/instrumentation.ts', `${newAppPath}/src/instrumentation.ts`, err => {
        if (err) console.log('error while adding Dockerfile: ', err);
      })

    } catch (error) {
      console.error('error in docker add files middleware handler');
      console.error(error);
    }

  },

  BuildAndRun: async ({ appname, newAppPath, dockerFilePath, port, email }: { [key: string]: unknown }): Promise<void> => {

    const name = (email as string).replace('@', '.');

    const dockerSetup: string = `
    docker stop ${name}
    docker rm ${name}
    docker build -f ${dockerFilePath} -t ${appname} ${newAppPath}
    docker run -d -p ${port}:3000 --rm --name ${name} -it ${appname} 
    `;

    // Build Docker Image and Run Docker Container on Randomized Port
    try {
      const { stdout, stderr }: { stdout: string, stderr: string } = await execSync(dockerSetup)
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
    } catch (error) {
      console.error('stderr: ' + error);
      throw error;
    }

    // Stop after 15 minutes (900 seconds)
    const dockerStop: string = `sleep 900 && docker stop ${name} && docker rmi ${appname} &`;
    exec(dockerStop, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    })
  }

}

