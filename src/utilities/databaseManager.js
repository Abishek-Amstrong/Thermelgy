import SQLite from 'react-native-sqlite-2';
import {crypto} from './crypto';

const db = SQLite.openDatabase('thermalgy.db', '1.0', '', 1);

const setDatabaseConfiguration = async () => {
  return await db.transaction(async txn => {
    return await txn.executeSql(
      'CREATE TABLE IF NOT EXISTS User(user TEXT)',
      [],
    );
  });
};

const insertUserRecords = async data => {
  console.log('Insert Records Called....!!!******');
  return await db.transaction(async tx => {
    return await tx.executeSql('INSERT INTO User (user) values (:user)', [
      crypto.encrypt(data),
    ]);
  });
};

const deleteUserRecords = async () => {
  return await db.transaction(async tx => {
    return await tx.executeSql('DELETE FROM User');
  });
};

const fetchUserRecords = async () => {
  return await new Promise(async resolve => {
    await db.transaction(async tx => {
      await tx.executeSql('SELECT user FROM User', [], async (txId, res) => {
        let items = [];
        for (let i = 0; i < res.rows.length; ++i) {
          items.push(crypto.decrypt(res.rows.item(i).user));
        }
        return resolve(items);
      });
    });
  });
};

export const DatabaseManager = {
  setDatabaseConfiguration,
  insertUserRecords,
  fetchUserRecords,
  deleteUserRecords,
};
