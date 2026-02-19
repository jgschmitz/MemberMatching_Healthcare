db.patients.find(
  { "incomingMemberMatchValue.memberGroupID": "1599114" },
  {
    "incomingMemberMatchValue.firstName": 1,
    "incomingMemberMatchValue.lastName": 1,
    "incomingMemberMatchValue.birthDate": 1,
    _id: 0
  }
).pretty()
