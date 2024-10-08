// Susila Life
const susilaLifeDbAdmin = require("firebase-admin");
const credentials = require("../../susila-life-test-firebase-adminsdk-3eph5-f70f6ab24a.json");

const susilaLifeFirebaseApp = susilaLifeDbAdmin.initializeApp(
  {
    credential: susilaLifeDbAdmin.credential.cert(credentials),
    projectId: "susila-life-test"
  },
  "first-app"
);
const susilaLifeDB = susilaLifeFirebaseApp.firestore();

// Content Provider
const susilaLifeContentProviderDBAdmin = require("firebase-admin");
const credentialsContentProvider = require("../../content-provider-test1-firebase-adminsdk-qh35i-3f042d0fb5.json");

const susilaLifeContentProviderApp =
  susilaLifeContentProviderDBAdmin.initializeApp(
    {
      credential: susilaLifeContentProviderDBAdmin.credential.cert(
        credentialsContentProvider
      ),
    },
    "Content-Provider-Test2"
  );
const susilaLifeContentProviderDB = susilaLifeContentProviderApp.firestore();

module.exports = {
  // Mobile
  susilaLifeDB,
  susilaLifeFirebaseApp,
  susilaLifeDbAdmin,

  // CPP
  susilaLifeContentProviderDB,
  susilaLifeContentProviderApp,
  susilaLifeContentProviderDBAdmin,
};
