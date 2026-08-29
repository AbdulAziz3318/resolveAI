import cron from 'node-cron';
import {
  processExpiredAssignments,
} from '../services/assignmentService.js';

let job;
let isRunning = false;

async function executeAssignmentAcceptanceJob() {
  if (isRunning) {
    return;
  }

  isRunning = true;

  try {
    const result =
      await processExpiredAssignments();

    if (result.examined > 0) {
      console.log(
        'Assignment expiration job:',
        result,
      );
    }
  } catch (error) {
    console.error(
      'Assignment expiration job failed:',
      error,
    );
  } finally {
    isRunning = false;
  }
}

export function startAssignmentAcceptanceJob() {
  if (job) {
    return job;
  }

  job = cron.schedule(
    '* * * * *',
    executeAssignmentAcceptanceJob,
  );

  executeAssignmentAcceptanceJob();

  return job;
}

export function stopAssignmentAcceptanceJob() {
  if (job) {
    job.stop();
    job = undefined;
  }
}