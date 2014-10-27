var mongo = new Mongo();
	db = mongo.getDB("blockchain_realtime"),
	collections = ["dashboard", "exchange-rate"],
	collection = null;

collections.forEach(function(collectionItem, i){
	collection = db[collectionItem];
	collection.find().forEach(function(doc){
		if(typeof doc.date === "number"){
			collection.update(
				{ _id: doc._id }, 
				{ $set: { date: new Date(parseInt(doc.date))} }
			);
		}
	});
})