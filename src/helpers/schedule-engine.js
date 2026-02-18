const schedule = require('node-schedule');

function cancelarJobsExistentes() {
  Object.values(schedule.scheduledJobs).forEach(job => {
    job.cancel();
  });

  console.log('[SCHEDULE] Todos os jobs cancelados.');
}

function scheduleOnce(name, date, callback) {

  // evita duplicação
  if (schedule.scheduledJobs[name]) {
    schedule.cancelJob(name);
  }

  console.log('[AGENDADO]', name, date.toString());

  schedule.scheduleJob(name, date, async () => {
    try {
      await callback();
    } catch (err) {
      console.error(`[ERRO][${name}]`, err);
    }
  });
}

function listarJobs() {
  return Object.keys(schedule.scheduledJobs).map(name => {
    const job = schedule.scheduledJobs[name];

    return {
      name,
      nextInvocation: job.nextInvocation()
        ? job.nextInvocation().toDate()
        : null
    };
  });
}

module.exports = {
  cancelarJobsExistentes,
  scheduleOnce,
  listarJobs
};
