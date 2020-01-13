import React from 'react';
import app from './base';

export const StoreContext = React.createContext({
  getUserInfo: () => {},
  getProjects: () => {},
  getEmployees: () => {},
  getJobs: () => {}
});

export const StoreProvider = ({ children }) => {
  const db = app.firestore();

  const getUserInfo = async (email, org) => {
    const info = await db
      .collection('organizations')
      .doc(org)
      .collection('users')
      .doc(email)
      .get()
      .then(snapshot => {
        return {
          email: snapshot.data().email,
          name: snapshot.data().name,
          role: snapshot.data().role,
          org: org
        };
      });
    return info;
  };

  const getProjects = async org => {
    const info = await db
      .collection('organizations')
      .doc(org)
      .collection('projects')
      .get();
    return info.docs.map(doc => doc.data());
  };

  const getEmployees = async org => {
    const info = await db
      .collection('organizations')
      .doc(org)
      .collection('users')
      .where('role', '==', 'project worker')
      .get();
    return info.docs.map(doc => doc.data());
  };

  const getJobs = async (org, email) => {
    const info = await db
      .collection('organizations')
      .doc(org)
      .collection('projects')
      .where('project_workers', 'array-contains', email)
      .get();
    return info.docs.map(doc => doc.data());
  };

  return (
    <StoreContext.Provider
      value={{
        getUserInfo,
        getProjects,
        getEmployees,
        getJobs
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
