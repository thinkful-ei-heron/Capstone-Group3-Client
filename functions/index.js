const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp();

registerOwner = functions.https.onCall(async (data, context) => {
  let uid = await data.email;
  const jobDone = await admin
    .auth()
    .createUser({
      uid: uid,
      email: data.email,
      emailVerified: false,
      password: data.password,
      displayName: data.name,
      disabled: false,
    })
    .then(userRecord => {
      let custom = {
        role: 'owner',
        org: data.org,
      };
      return admin
        .auth()
        .setCustomUserClaims(uid, custom)
        .then(() => {
          return `success uid: '${uid}', created within org: '${data.org}', with role; '${custom.role}'`;
        });
    })
    .catch(function(error) {
      console.log('Error creating new user:', error);
    });
  return jobDone;
});

registerProjectManager = functions.https.onCall(async (data, context) => {
  let uid = await data.email;
  const jobDone = await admin
    .auth()
    .createUser({
      uid: uid,
      email: data.email,
      emailVerified: false,
      password: data.password,
      displayName: data.name,
      disabled: false,
    })
    .then(userRecord => {
      let custom = {
        role: 'project manager',
        org: data.org,
      };
      return admin
        .auth()
        .setCustomUserClaims(uid, custom)
        .then(() => {
          return `success uid: '${uid}', created within org: '${data.org}', with role; '${custom.role}'`;
        });
    })
    .catch(function(error) {
      console.log('Error creating new user:', error);
    });
  return jobDone;
});

registerWorker = functions.https.onCall(async (data, context) => {
  let uid = await data.email;
  const jobDone = await admin
    .auth()
    .createUser({
      uid: uid,
      email: data.email,
      emailVerified: false,
      password: data.password,
      displayName: data.name,
      disabled: false,
    })
    .then(userRecord => {
      let custom = {
        role: 'project worker',
        org: data.org,
      };
      return admin
        .auth()
        .setCustomUserClaims(uid, custom)
        .then(() => {
          return `success uid: '${uid}', created within org: '${data.org}', with role; '${custom.role}'`;
        });
    })
    .catch(function(error) {
      console.log('Error creating new user:', error);
    });
  return jobDone;
});

promoteUser = functions.https.onCall(async (data, context) => {
  let uid = await data.email;
  let custom = {
    role: 'project manager',
    org: data.org,
  };
  const jobDone = await admin
    .auth()
    .setCustomUserClaims(uid, custom)
    .then(() => {
      return `success uid: '${uid}', within org: '${data.org}', changed role to '${custom.role}'`;
    })
    .catch(function(error) {
      console.log('Error creating new user:', error);
    });
  return jobDone;
});

module.exports = {
  registerOwner,
  registerProjectManager,
  registerWorker,
  promoteUser,
};
