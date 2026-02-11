var inbound = db.patients.aggregate([
  { $match: { "incomingMemberMatchValue.identityEmbedding": { $exists: true } } },
  { $sample: { size: 1 } }
]).toArray()[0]

var inboundId = inbound._id
var q = inbound.incomingMemberMatchValue.identityEmbedding

db.patients.aggregate([
  {
    $vectorSearch: {
      index: "default",
      path: "incomingMemberMatchValue.identityEmbedding",
      queryVector: q,
      numCandidates: 10,
      limit: 4
    }
  },
  { $match: { _id: { $ne: inboundId } } },
  { $limit: 3 },
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
