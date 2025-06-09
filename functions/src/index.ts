/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";

const helloWorldFunction =
  onRequest(
    (
      request,
      response,
    ) => {
      response.send("Hello from Firebase!");
    },
  );

export {
  helloWorldFunction as helloWorld,
};
