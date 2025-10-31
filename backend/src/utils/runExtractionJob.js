import { exec } from "child_process";

export const runExtractionJob = () => {
  exec("node src/extractTextJob.js", (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Extraction job failed: ${error.message}`);
      return;
    }
    if (stderr) console.error(`⚠️ ${stderr}`);
    console.log(`✅ Extraction job: ${stdout}`);
  });
};
