var dob = inbound.incomingMemberMatchValue.birthDate

db.patients.aggregate([
  {
    $vectorSearch: {
      index: "default",
      path: "incomingMemberMatchValue.identityEmbedding",
      queryVector: q,
      numCandidates: 50,
      limit: 20
    }
  },
  {
    $match: {
      _id: { $ne: inboundId },
      "incomingMemberMatchValue.memberGroupID": "1599114",
      "incomingMemberMatchValue.birthDate": dob
    }
  },
  {
    $project: {
      score: { $meta: "vectorSearchScore" },
      firstName: "$incomingMemberMatchValue.firstName",
      lastName: "$incomingMemberMatchValue.lastName",
      birthDate: "$incomingMemberMatchValue.birthDate"
    }
  }
]).toArray()
