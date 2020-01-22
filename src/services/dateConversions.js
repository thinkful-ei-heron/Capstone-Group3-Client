import * as firebase from 'firebase/app';

const dateConversions = {
  //Convert <input type='date'> format to firestore timestamp
  dateToTimestamp(date) {
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return firebase.firestore.Timestamp.fromDate(new Date(date));
  },

  //Convert firestore timestamp to <input type='date'> format
  TStoFormDate(ts) {
    const date = ts.toDate();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

    return date.toJSON().slice(0, 10);
  },

  //Convert firestore timestamp to display format
  TStoDisplayDate(ts) {
    const date = ts.toDate();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = date.toJSON().slice(8, 10);

    return `${month}/${day}/${year}`;
  }
};

export default dateConversions;
