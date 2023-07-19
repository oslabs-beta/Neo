import { exec } from 'child_process'
import { promisify } from 'util';
import fs from 'fs'
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

      fs.cp('src/instrumentation.ts', `${newAppPath}/src/instrumentation.ts`, err => {
        if (err) console.log('error while adding Dockerfile: ', err);
      })

      console.log('Added Dockerfile, .dockerignore, and instrumentation for OTel')

    } catch (error) {
      console.error('error in docker add files middleware handler')
      console.error(error)
    }

  },

  BuildAndRun: async ({ appname, newAppPath, dockerFilePath, port, email }: { [key: string]: unknown }): Promise<void> => {

    const name = (email as string).replace('@', '.');

    const dockerSetup: string = `
    docker stop ${name}
    docker rm ${name}
    docker build -f ${dockerFilePath} -t ${appname} ${newAppPath}
    docker run -d -p ${port}:3000 --name ${name} -it ${appname}
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


    console.log('Finished building the image and deploying the container!');
    console.log('Deployed at port ' + port);
  }

}

