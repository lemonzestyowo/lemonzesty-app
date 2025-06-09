/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
// import * as logger from 'firebase-functions/logger'; // Removed as unused

// The 'onRequest' function was marked as unused in your previous linting output.
// To make it a functional HTTP Cloud Function, you need to export it.
// This example exports it as 'helloWorld'.
const helloWorldFunction =
  onRequest(
    (
      request,
      response,
    ) => {
      // logger.info('Hello logs!', {structuredData: true}); // Removed as unused
      response.send("Hello from Firebase!");
    },
  );

export {
  helloWorldFunction as helloWorld,
};

// You can import and use other Genkit flows here if needed
// import { myFlow } from './genkit-sample';
// exports.myFlow = myFlow;
