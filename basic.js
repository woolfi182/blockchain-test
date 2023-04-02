
// Old code
connectToDatabase()
  .then((database)  => {
      return getUser(database, 'email@email.com')
      .then(user => {
          return getUserSettings(database, user.id)
          .then(settings => {
              return setRole(database, user.id, "ADMIN")
              .then(success => {
                  return notifyUser(user.id, "USER_ROLE_UPDATED")
                  .then(success => {
                      return notifyAdmins("USER_ROLE_UPDATED")
                  })
              })
          })
      })
  })

// New code
// ex. DB is MongoDB (thru mongodb lib)
// ex. SQS and SNS are from AWS thru aws-sdk
const { MONGO_URL } = process.env;

// implementations
const connectToDatabase = async () => {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  const db = client.db(dbName);
  return db;
}

const getUser = async (db, email) => {
  const collection = db.collection('users');
  return collection.findOne({ email });
}

const getUserSettings = async (db, userId) => {
  const collection = db.collection('user-settings');
  return collection.findOne({ userId });
}

const setRole = async (db, userId, role) => {
  const collection = db.collection('roles');
  return collection.updateOne({ userId }, { $set: { role } });
}

// Notifications thru notification service, so, e.g. AWS.SQS or AWS.SNS direct execution

// let's use sqs
const notifyUser = async (userId, status) => {
  const { AWS_SQS_NOTIFICATION_Q } = process.env;

  switch(status) {
    case "USER_ROLE_UPDATED":{
      const params = {
        MessageAttributes: {
          Title: {
            DataType: "String",
            StringValue: status
          },
          UserId: {
            DataType: "String",
            StringValue: userId
          },
          Type: {
            DataType: "String",
            StringValue: 'NOTIFICATION'
          }
        },
        MessageBody: "User role has been changed",
        QueueUrl: AWS_SQS_NOTIFICATION_Q
      };
      return sqs.sendMessage(params).promise();
    }
    // other cases
    default: {
      throw new Error('Unknown status to process')
    }
  }
}

// Let's use SNS
const notifynotifyAdminsUser = async (status) => {
  const { SNS_ARN } = process.env

  switch(status) {
    case "USER_ROLE_UPDATED":{
      const params = {
        Message: `A role "Admin" has been attached to a new user!`,
        TargetArn: SNS_ARN,
      };
      return sns.publish(params).promise();
    }
    // other cases
    default: {
      throw new Error('Unknown status to process')
    }
  }
}

// Then the basic code could be updated to 
const changeUserRoleToAdmin = async (email) => {
  const database = await connectToDatabase();
  const user = await getUser(database, email);
  const settings = await getUserSettings(database, user.id);
  const roleSetSuccess = await setRole(database, user.id, "ADMIN");
  const notifiedUserSuccess = await notifyUser(user.id, "USER_ROLE_UPDATED");
  return notifyAdmins("USER_ROLE_UPDATED");
}

// async function to execute
changeUserRoleToAdmin('email@email.com');