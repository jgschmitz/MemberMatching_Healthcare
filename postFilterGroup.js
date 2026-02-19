var q = inbound.incomingMemberMatchValue.identityEmbedding
var inboundId = inbound._id

db.patients.aggregate([
  {
    $vectorSearch: {
      index: "default",
      path: "incomingMemberMatchValue.identityEmbedding",
      queryVector: q,
      numCandidates: 50,
      limit: 10
    }
  },
  {
    $match: {
      _id: { $ne: inboundId },
      "incomingMemberMatchValue.memberGroupID": "1599114"
    }
  },
  {
    $project: {
      score: { $meta: "vectorSearchScore" },
      firstName: "$incomingMemberMatchValue.firstName",
      lastName: "$incomingMemberMatchValue.lastName",
      birthDate: "$incomingMemberMatchValue.birthDate",
      memberGroupID: "$incomingMemberMatchValue.memberGroupID"
    }
  }
]).toArray()
