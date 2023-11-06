import { async } from 'regenerator-runtime'; // allows parcel to convert to es5 and older JS.
import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Telling API it's json format.
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); // times user out after 10 seconds for slow connnections.
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data; // returns promise.
  } catch (err) {
    throw err; // Makes the model.js handle it instead.
  }
};

/*
export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]); // times user out after 10 seconds for slow connnections.
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data; // returns promise.
  } catch (err) {
    throw err; // Makes the model.js handle it instead.
  }
};

// SENDS DATA USING THE FETCH FUNCTION.
export const sendJSON = async function (url, uploadData) {
  try {
    const res = await Promise.race([
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Telling API it's json format.
        },
        body: JSON.stringify(uploadData),
      }),
      timeout(TIMEOUT_SEC),
    ]); // times user out after 10 seconds for slow connnections.

    const data = await res.json(); // Forkify API returns the data we sent.

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data; // returns promise.
  } catch (err) {
    throw err; // Makes the model.js handle it instead.
  }
};
*/
