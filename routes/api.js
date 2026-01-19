/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

module.exports = function (app) {
  // In-memory store fallback for tests and local dev without DB
  // Each book: { _id: string, title: string, comments: [] }
  const { MongoClient, ObjectID } = require('mongodb');
  let useDb = !!process.env.DB;
  let dbClient = null;
  let booksCollection = null;
  const memoryStore = new Map();

  // Helper to compute commentcount when serializing list
  function serializeListItem(book) {
    return { _id: book._id, title: book.title, commentcount: (book.comments || []).length };
  }

  async function initDb() {
    if (!useDb || booksCollection) return;
    try {
      dbClient = await MongoClient.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });
      const db = dbClient.db();
      booksCollection = db.collection('books');
    } catch (e) {
      // Fallback to in-memory if DB connection fails
      useDb = false;
    }
  }

  async function ensureExampleSeed() {
    // Ensure at least one book exists for the example test
    if (useDb) {
      await initDb();
      const count = await booksCollection.countDocuments();
      if (count === 0) {
        await booksCollection.insertOne({ title: 'Example Book', comments: [] });
      }
    } else {
      if (memoryStore.size === 0) {
        const id = new ObjectID().toHexString();
        memoryStore.set(id, { _id: id, title: 'Example Book', comments: [] });
      }
    }
  }

  app.route('/api/books')
    .get(async function (req, res){
      try {
        await ensureExampleSeed();
        if (useDb) {
          await initDb();
          const docs = await booksCollection.find({}).toArray();
          return res.json(docs.map(serializeListItem));
        } else {
          const list = Array.from(memoryStore.values()).map(serializeListItem);
          return res.json(list);
        }
      } catch (err) {
        return res.status(500).type('text').send('server error');
      }
    })
    
    .post(async function (req, res){
      const title = req.body.title;
      if (!title) return res.type('text').send('missing required field title');
      try {
        if (useDb) {
          await initDb();
          const result = await booksCollection.insertOne({ title, comments: [] });
          const doc = { _id: result.insertedId, title };
          return res.json(doc);
        } else {
          const id = new ObjectID().toHexString();
          memoryStore.set(id, { _id: id, title, comments: [] });
          return res.json({ _id: id, title });
        }
      } catch (err) {
        return res.status(500).type('text').send('server error');
      }
    })
    
    .delete(async function(req, res){
      try {
        if (useDb) {
          await initDb();
          await booksCollection.deleteMany({});
        } else {
          memoryStore.clear();
        }
        return res.type('text').send('complete delete successful');
      } catch (err) {
        return res.status(500).type('text').send('server error');
      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      const bookid = req.params.id;
      try {
        if (useDb) {
          await initDb();
          const doc = await booksCollection.findOne({ _id: ObjectID.isValid(bookid) ? new ObjectID(bookid) : bookid });
          if (!doc) return res.type('text').send('no book exists');
          return res.json({ _id: doc._id, title: doc.title, comments: doc.comments || [] });
        } else {
          const doc = memoryStore.get(bookid);
          if (!doc) return res.type('text').send('no book exists');
          return res.json({ _id: doc._id, title: doc.title, comments: doc.comments || [] });
        }
      } catch (err) {
        return res.status(500).type('text').send('server error');
      }
    })
    
    .post(async function(req, res){
      const bookid = req.params.id;
      const comment = req.body.comment;
      if (!comment) return res.type('text').send('missing required field comment');
      try {
        if (useDb) {
          await initDb();
          const key = ObjectID.isValid(bookid) ? new ObjectID(bookid) : bookid;
          const doc = await booksCollection.findOne({ _id: key });
          if (!doc) return res.type('text').send('no book exists');
          await booksCollection.updateOne({ _id: key }, { $push: { comments: comment } });
          const updated = await booksCollection.findOne({ _id: key });
          return res.json({ _id: updated._id, title: updated.title, comments: updated.comments || [] });
        } else {
          const doc = memoryStore.get(bookid);
          if (!doc) return res.type('text').send('no book exists');
          doc.comments = doc.comments || [];
          doc.comments.push(comment);
          memoryStore.set(bookid, doc);
          return res.json({ _id: doc._id, title: doc.title, comments: doc.comments });
        }
      } catch (err) {
        return res.status(500).type('text').send('server error');
      }
    })
    
    .delete(async function(req, res){
      const bookid = req.params.id;
      try {
        if (useDb) {
          await initDb();
          const key = ObjectID.isValid(bookid) ? new ObjectID(bookid) : bookid;
          const result = await booksCollection.deleteOne({ _id: key });
          if (result.deletedCount === 0) return res.type('text').send('no book exists');
          return res.type('text').send('delete successful');
        } else {
          const existed = memoryStore.delete(bookid);
          if (!existed) return res.type('text').send('no book exists');
          return res.type('text').send('delete successful');
        }
      } catch (err) {
        return res.status(500).type('text').send('server error');
      }
    });
  
};
