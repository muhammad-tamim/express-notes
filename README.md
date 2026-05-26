<h1 align="center">Express.js Notes</h1>

- [Setup:](#setup)
- [Introduction:](#introduction)
  - [How a api code works:](#how-a-api-code-works)
  - [Difference Between req.body, req.params and req.query:](#difference-between-reqbody-reqparams-and-reqquery)
  - [Routing:](#routing)
    - [Route parameters:](#route-parameters)
    - [Query Parameters:](#query-parameters)
  - [Difference Between req.body, req.params and req.query:](#difference-between-reqbody-reqparams-and-reqquery-1)
  - [Middleware:](#middleware)
  - [Sending Response:](#sending-response)
  - [Router:](#router)
  - [Route chaining:](#route-chaining)
  - [Serving static files:](#serving-static-files)
- [Express + MongoDB + JS:](#express--mongodb--js)
  - [setup:](#setup-1)
  - [Example 1:](#example-1)
  - [Example 2:](#example-2)
- [Express + MongoDB + TS:](#express--mongodb--ts)
  - [Setup:](#setup-2)
  - [Example 1:](#example-1-1)
- [Express + MongoDB + TS + Zod:](#express--mongodb--ts--zod)
  - [Setup:](#setup-3)
  - [Example 1:](#example-1-2)
- [Express + MongoDB + TS + Zod (Modeller Pattern):](#express--mongodb--ts--zod-modeller-pattern)
  - [Setup:](#setup-4)
  - [Example 1:](#example-1-3)
  - [Example 2:](#example-2-1)
- [Express + Mongoose + JS:](#express--mongoose--js)
  - [Setup:](#setup-5)
  - [Example 1:](#example-1-4)
- [Express + PostgreSQL + TS:](#express--postgresql--ts)
  - [Setup:](#setup-6)
  - [Example 1:](#example-1-5)
- [Express + PostgreSQL + TS (Modular pattern):](#express--postgresql--ts-modular-pattern)
  - [Setup:](#setup-7)
  - [Example 1:](#example-1-6)
  - [Example 2:](#example-2-2)
- [Express + PostgreSQL + Prisma + Ts:](#express--postgresql--prisma--ts)
  - [Setup:](#setup-8)
  - [Example 1:](#example-1-7)
- [Express + PostgreSQL + Prisma + Ts (Modular Pattern):](#express--postgresql--prisma--ts-modular-pattern)
  - [Setup:](#setup-9)
  - [Example 1:](#example-1-8)


# Setup:

**Setup:** 
```js
npm init -y
```
```js
npm install express
```

```js
const express = require("express");
const app = express();
const port = 3000;

// Home route
app.get("/", (req, res) => {
  res.send("Hello Express!");
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
```

# Introduction:
Express.js is a minimal, flexible and fast web framework for Node.js. It makes building APIs and web servers much easier than using the raw http module.

## How a api code works:

```js
// express
app.post('/users', async (req, res) => {
    const user = req.body;
    const result = await usersCollection.insertOne(user);
    res.send(result); 
});
```

here,
- `app.post('/users'.......)`: 
  - `app` is a variable that contains express object (const app = express()).
  - `.post()` is a methods of the app object
  - `'/users'` is a endPoint(URL path). When the client sends a POST request to /users, this code runs.

- `async/await`: 
  - `async` marks the function as asynchronous so you can use await inside it.
  - `await` works same like .then(), it's pause the async function until the promise if resolved.
  
- `(req, res) => {...}`: this is a anonymous arrow function that contains two parameters: 
  - req = request object containing data from the client (req.body, req.params, req.query)
  - res = response object used to send data back to the client (res.json(), res.send(), res.status())

so we can do the same things using .then():

```js
app.post('/users', (req, res) => {
    const user = req.body;
    usersCollection.insertOne(user)
    .then(result => res.send(result))
});

```

**Note:**

In the frontend we need two .then(), because fetch() returns a response object, and you must convert it using .json() before using in the your code.

```js
fetch('api')
.then(res => res.json())
.then(data => console.log(data))
```

But in mongodb methods are already return js object when their promises resolve. So inside express we don't need to use res.json(), we can directly send the object using res.send().


## Difference Between req.body, req.params and req.query:

- req.body → used when we need requested body info:

Frontend:

```js
fetch('http://localhost:3000/users', {
  method: 'POST',
  headers: { 
    'content-type': 'application/json' 
  },
  body: JSON.stringify({ name: "Tamim", email: "a@a.com" })
})
```

Backend: 

```js
app.post('/users', async (req, res) => {
    const newUser = req.body;
    console.log(newUser) // { name: "Tamim", email: "a@a.com" }
    const result = await usersCollection.insertOne(newUser);
    res.send(result); 
});
```

- req.params → used when we need requested url dynamic url path:

```js
app.get('/users/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await usersCollection.findOne(query);
    res.send(result);
});
```

- req.query → used when we need requested url part after ?

```js
app.get('/users', async (req, res) => {
    const page = parseInt(req.query.page); // http://localhost:3000/users?page=${page}
    const limit = 5;
    const skip = (page - 1) * limit;

    const result = await usersCollection
        .find()
        .skip(skip)
        .limit(limit)
        .toArray();

    res.send(result);
});
```

## Routing:

```js
// GET request
app.get('/users', (req, res) => {
    res.send('Get all users');
});

// POST request
app.post('/users', (req, res) => {
    res.send('Create a new user');
});

// PUT request
app.put('/users/:id', (req, res) => {
    res.send(`Update user ${req.params.id}`);
});

// DELETE request
app.delete('/users/:id', (req, res) => {
    res.send(`Delete user ${req.params.id}`);
});
```

### Route parameters:
Access dynamic values form the url:

```js
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`User ID: ${userId}`);
});

// Multiple parameters
app.get('/posts/:year/:month', (req, res) => {
    res.json({
        year: req.params.year,
        month: req.params.month
    });
});
```

### Query Parameters: 
Access query strings from the URL:

```js
// URL: /search?term=express&limit=10
app.get('/search', (req, res) => {
    const term = req.query.term;
    const limit = req.query.limit;
    res.json({ term, limit });
});
```

## Difference Between req.body, req.params and req.query:
- req.body → used when we need requested body info:

Frontend:

```
fetch('http://localhost:3000/users', {
  method: 'POST',
  headers: { 
    'content-type': 'application/json' 
  },
  body: JSON.stringify({ name: "Tamim", email: "a@a.com" })
})
```

Backend:

```
app.post('/users', async (req, res) => {
    const newUser = req.body;
    console.log(newUser) // { name: "Tamim", email: "a@a.com" }
    const result = await usersCollection.insertOne(newUser);
    res.send(result); 
});
```

- req.params → used when we need requested url dynamic url path:

Frontend: 

```
const userId = "65f1a2b3c4d5e6f7a8b9c0d1";

fetch(`http://localhost:3000/users/${userId}`)
  .then(res => res.json())
  .then(data => console.log(data));
```

Backend:

```
app.get('/users/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await usersCollection.findOne(query);
    res.send(result);
});
```

- req.query → used when we need requested url part after ?

Frontend: 

```
const page = 2;

fetch(`http://localhost:3000/users?page=${page}`)
  .then(res => res.json())
  .then(data => console.log(data));
```

Backend: 

```
app.get('/users', async (req, res) => {
    const page = parseInt(req.query.page); 
    const limit = 5;
    const skip = (page - 1) * limit;

    const result = await usersCollection
        .find()
        .skip(skip)
        .limit(limit)
        .toArray();

    res.send(result);
});
```

## Middleware: 

Middleware is a function that runs between the request and the response. It have access to the request and response objects and can modify them or end the request-response cycle.

```js
const express = require('express');
const app = express();
const PORT = 3000;

// Built-in middleware for parsing JSON
app.use(express.json());


// application lavel middleware
app.use((req, res, next) => {
    console.log(`form custom middleware: ${req.method} ${req.url}`);
    next(); // Pass control to the next middleware
});

// route specific Middleware 
const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (token === 'secret-token') {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
};


app.get('/protected', authenticate, (req, res) => {
    res.send('This is protected content');
});

// Route that triggers an error
app.get('/error', (req, res, next) => {
    const err = new Error('Something went wrong!');
    next(err); // Pass error to error-handling middleware
});

// wildcard middleware (for unmatched routes)
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// error handling middleware
// Use it to catch errors thrown in routes or middleware.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: err.message 
  });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```

Note: When the client sends this:

```js
{
  "name": "Tamim",
  "age": 20
}
```

You can access it in Express like:

```js
req.body.name
req.body.age
```
Without express.json(), req.body will always be undefined.

## Sending Response: 
Express provides several ways to send responses:

```js
  res.send('Plain text response');
  
  // Send JSON
  res.json({ message: 'JSON response' });
  
  // Send with status code
  res.status(404).send('Not found');
  
  // Redirect
  res.redirect('/another-page');
  
  // Send file
  res.sendFile(__dirname + '/index.html');
```

## Router:
Organize routes using Express Router:

routes/users.js:
```js
const express = require('express');
const router = express.Router(); 

// GET /api/users
router.get('/', (req, res) => {
  res.send('Get all users');
});

// GET /api/users/:id
router.get('/:id', (req, res) => {
  res.send(`Get user ${req.params.id}`);
});

module.exports = router;
```

index.js: 
```js
const express = require('express');
const app = express();
const PORT = 3000;

// import the router
const userRoutes = require('./routes/users');

// mount the router with a prefix
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

## Route chaining: 

```js
// Route chaining for /users
app.route('/users')
  .get((req, res) => {
    // GET /users - fetch all users
    res.send('Get all users');
  })
  .post((req, res) => {
    // POST /users - create a new user
    const newUser = req.body;
    res.send(`User created: ${JSON.stringify(newUser)}`);
  })
  .put((req, res) => {
    // PUT /users - update all users (just an example)
    res.send('Update all users');
  });

// Route chaining for /users/:id
app.route('/users/:id')
  .get((req, res) => {
    res.send(`Get user with ID ${req.params.id}`);
  })
  .put((req, res) => {
    res.send(`Update user with ID ${req.params.id}`);
  })
  .delete((req, res) => {
    res.send(`Delete user with ID ${req.params.id}`);
  });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
```

## Serving static files: 

Express provides a built-in middleware called express.static to serve static files like (html, css, js, images etc).

```js
public/
    ├── index.html
    └── images/
        └── logo.png

http://localhost:3000/index.html
http://localhost:3000/images/logo.png
```

```js
const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
```



# Express + MongoDB + JS:

## setup:

- **step 1:** 

```bash
npm init -y
npm i express mongodb nodemon cors dotenv
```

Note: 
- nodemon automatically restarts the server whenever we make code changes.
- cors allows cross-origin requests, useful when frontend and backend run on different ports or domains.
- dotenv lets us store sensitive data (like MongoDB URI or passwords) in a .env file and access them using process.env, keeping our project secure and preventing secrets from going to GitHub.


**step 2:** 

- `"start": "node index.js"`: Many deployment platforms (like Render, Vercel, Railway, Heroku) automatically look for this script and They use this command to run your server., if we don't include it, deployment will fail because the platform doesn't know hot to start your app.

- `"dev": "nodemon index.js",`: here nodemon is not installed globally, so we can run it directly from the terminal using: `nodemon index.js`. thats why we set nodemon into the script and when we write `npm run dev` nodemon will works.

```js
{
  "name": "server",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs",
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^5.1.0",
    "mongodb": "^7.0.0",
    "nodemon": "^3.1.11"
  }
}
```

**step 3:** 

```js
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 3000

const app = express()
app.use(cors({
    origin: ['http://localhost:5173', 'add other frontend urls'],
    credentials: true
})) // use cors middleware
app.use(express.json()) // use express middleware


const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {

    // const database = client.db("usersDB")
    // const usersCollection = database.collection('users')
    const usersCollection = client.db("usersDB").collection('users')


    /*
    
    ALl CRUD Operation here  
    
    */

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
```
Note: Middleware in Express is a function that runs between the request and the response. It can modify the request, check something, or run some logic before sending the final response.



## Example 1:

Backend:

```js
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 3000

const app = express()
app.use(cors({
    origin: ['http://localhost:5173', 'add other frontend urls'],
    credentials: true
})) // use cors middleware
app.use(express.json()) // use express middleware


const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {

    const notesCollection = client.db("crudDB").collection('notes')


    // create new note
    app.post('/notes', async (req, res) => {
        const note = req.body;
        const result = await notesCollection.insertOne(note);
        res.send(result);
    });


    // GET all notes
    app.get('/notes', async (req, res) => {
        const notes = await notesCollection.find({}).toArray();
        res.send(notes);
    });

    // GET a single note
    app.get('/notes/:id', async (req, res) => {
        const id = req.params.id
        const filter = { _id: new ObjectId(id) }
        const result = await notesCollection.findOne(filter);
        res.send(result);
    });


    // PATCH - partial update
    app.patch('/notes/:id', async (req, res) => {
        const id = req.params.id
        const filter = { _id: new ObjectId(id) }
        const updateData = req.body;
        const updateDoc = {
            $set: {
                name: updateData.name,
                description: updateData.description
            }
        }

        const result = await notesCollection.updateOne(filter, updatedDoc);
        res.send(result);
    });

    // PUT - full replace
    app.put('/notes/:id', async (req, res) => {
        const id = req.params.id
        const filter = { _id: new ObjectId(id) }
        const updateData = req.body;
        const options = { upsert: true }

        const result = await notesCollection.replaceOne(filter, updateData, options);
        res.send(result);
    });


    // DELETE
    app.delete('/notes/:id', async (req, res) => {
       const id = req.params.id
        const filter = {_id: new ObjectId(id)}
        const result = await notesCollection.deleteOne(filter);
        res.send(result);
    });


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
```

Frontend V1 with fetch:

```jsx
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { Link } from 'react-router';

const App = () => {

  const [notes, setNotes] = useState()
  const [singleNotes, setSingleNotes] = useState(null)
  const [patchData, setPatchData] = useState(null)
  const [putData, setPutData] = useState(null)

  const [viewDetailsDialog, setViewDetailsDialog] = useState(false)
  const [patchDialog, setPatchDialog] = useState(false)
  const [putDialog, setPutDialog] = useState(false)
  const [id, setId] = useState()

  // send data to db
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value
    const description = e.target.description.value
    const singleNoteObj = { name, description }

    fetch('http://localhost:3000/notes',
      {
        method: "POST",
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(singleNoteObj)
      })
      .then(res => res.json())
      .then(data => {
        if (data.insertedId) {
          toast.success("Note Added")
          e.target.reset()
          console.log(data)
          singleNoteObj._id = data.insertedId
          setNotes([...notes, singleNoteObj])
        }
      })
  }


  // get all data form db
  useEffect(() => {
    fetch('http://localhost:3000/notes')
      .then(res => res.json())
      .then(data => setNotes(data))
  }, [])


  // get single data form db
  useEffect(() => {
    if (!id) return
    fetch(`http://localhost:3000/notes/${id}`)
      .then(res => res.json())
      .then(data => setSingleNotes(data))
  }, [id])


  // update selected object partial data
  const handlePatchUpdate = (e) => {
    e.preventDefault();
    const name = e.target.name.value
    const description = e.target.description.value
    const patchObj = { name, description }

    fetch(`http://localhost:3000/notes/${id}`,
      {
        method: "PATCH",
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(patchObj)
      })
      .then(res => res.json())
      .then(data => {
        if (data.modifiedCount) {
          toast.success("Note Updated(PATCH)")
          console.log(data)

          const updatedNotes = notes.map((note) => note._id === id ? { ...note, ...patchObj } : note)

          setNotes(updatedNotes)
          setPatchDialog(false)
        }
      })
  }


  // replace selected object full data
  const handlePutUpdate = (e) => {
    e.preventDefault();
    const name = e.target.name.value
    const description = e.target.description.value
    const putObj = { name, description }

    fetch(`http://localhost:3000/notes/${id}`,
      {
        method: "PUT",
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(putObj)
      })
      .then(res => res.json())
      .then(data => {
        if (data.modifiedCount) {
          toast.success("Note Updated(PATCH)")
          console.log(data)

          const updatedNotes = notes.map((note) => note._id === id ? { ...note, ...putObj } : note)

          setNotes(updatedNotes)
          setPutDialog(false)
        }
      })
  }


  // delete data form db
  const handleDelete = (id) => {
    fetch(`http://localhost:3000/notes/${id}`, {
      method: "DELETE",
    })
      .then(res => res.json())
      .then(data => {
        if (data.deletedCount) {
          console.log(data)
          toast.success("Note Deleted")

          const remainingNotes = notes.filter((note) => note._id !== id)
          setNotes(remainingNotes)
        }
      })
  }
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Notes CRUD UI</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input type="text" name="name" placeholder="Name" className="input w-full" />
        <input type="text" name="description" placeholder="Description" className="input w-full" />
        <input type="submit" value="Submit" className='btn w-full btn-primary' />
      </form>

      {/* Notes */}
      <div className="overflow-x-auto">
        <table className="table w-full table-zebra">
          <tbody>
            {notes?.map((note) => (
              <tr key={note._id}>
                <td>{note._id}</td>
                <td>{note.name}</td>
                <td>{note.description}</td>
                <td className="space-x-2">
                  {/* <Link to={`view-details/${note._id}`}><button className="btn btn-sm btn-accent">View Details</button></Link> */}
                  <button className="btn btn-sm btn-accent" onClick={() => {
                    setViewDetailsDialog(true)
                    setId(note._id)
                  }}>View Details</button>
                  <button className="btn btn-sm btn-warning" onClick={() => {
                    setPatchDialog(true)
                    setId(note._id)
                    setPatchData({ name: note.name, description: note.description })
                  }}>PATCH Update</button>
                  <button className="btn btn-sm btn-secondary" onClick={() => {
                    setPutDialog(true)
                    setId(note._id)
                    setPutData({ name: note.name, description: note.description })
                  }}>PUT Replace</button>
                  <button onClick={() => handleDelete(note._id)} className="btn btn-sm btn-error">DELETE</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* view details dialog */}
      <Dialog open={viewDetailsDialog} onClose={() => setViewDetailsDialog(false)} className="relative z-50">
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
            <p>id: {singleNotes?._id}</p>
            <p>Name: {singleNotes?.name}</p>
            <p>Name: {singleNotes?.description}</p>
            <div className="flex gap-4">
              <button onClick={() => setViewDetailsDialog(false)} className='btn bg-error'>Cancel</button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* patch dialog */}
      <Dialog open={patchDialog} onClose={() => setPatchDialog(false)} className="relative z-50">
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
            <DialogTitle className="font-bold">PATCH Update</DialogTitle>

            <form onSubmit={handlePatchUpdate} className="mb-6 space-y-4">
              <input type="text" name="name" value={patchData?.name} onChange={(e) => setPatchData({ ...patchData, name: e.target.value })} className="input w-full" />
              <input type="text" name="description" value={patchData?.description} onChange={(e) => setPatchData({ ...patchData, description: e.target.value })} className="input w-full" />
              <input type="submit" value="Submit" className='btn w-full btn-primary' />
            </form>
          </DialogPanel>
        </div>
      </Dialog>

      {/* put dialog */}
      <Dialog open={putDialog} onClose={() => setPutDialog(false)} className="relative z-50">
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
            <DialogTitle className="font-bold">PUT Replace</DialogTitle>
            <form onSubmit={handlePutUpdate} className="mb-6 space-y-4">
              <input type="text" name="name" value={putData?.name} onChange={(e) => setPutData({ ...putData, name: e.target.value })} className="input w-full" />
              <input type="text" name="description" value={putData?.description} onChange={(e) => setPutData({ ...putData, description: e.target.value })} className="input w-full" />
              <input type="submit" value="Submit" className='btn w-full btn-primary' />
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}

export default App;
```

Frontend V2 with axios:

```js
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const App = () => {

  const [notes, setNotes] = useState([])
  const [singleNotes, setSingleNotes] = useState(null) // or useState({})
  const [id, setId] = useState()

  // send data to db
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value
    const description = e.target.description.value
    const singleNoteObj = { name, description }

    axios.post('http://localhost:3000/notes', singleNoteObj)
      .then(data => {
        if (data.data.insertedId) {
          toast.success("Note Added")
          e.target.dataet()
          console.log(data.data)
          singleNoteObj._id = data.data.insertedId
          setNotes([...notes, singleNoteObj])
        }
      });
  }


  // get all data form db
  useEffect(() => {
    axios.get('http://localhost:3000/notes')
      .then(data => setNotes(data.data))
  }, [])


  // get single data form db
  useEffect(() => {
    if (!id) return;
    axios.get(`http://localhost:3000/notes/${id}`)
      .then(data => setSingleNotes(data.data))
  }, [id])


  // update selected object partial data
  const handlePatchUpdate = (e) => {
    e.preventDefault();
    const name = e.target.name.value
    const description = e.target.description.value
    const patchObj = { name, description }

    axios.patch(`http://localhost:3000/notes/${id}`, patchObj)
      .then(data => {
        if (data.data.modifiedCount) {
          toast.success("Note Updated(PATCH)")
          console.log(data.data)

          const updatedNotes = notes.map((note) => note._id === id ? { ...note, ...patchObj } : note)

          setNotes(updatedNotes)

          setSingleNotes(prev => ({ ...prev, ...patchObj }));
        }
      })
  }

  // replace selected object full data
  const handlePutUpdate = (e) => {
    e.preventDefault();
    const name = e.target.name.value
    const description = e.target.description.value
    const putObj = { name, description }

    axios.put(`http://localhost:3000/notes/${id}`, putObj)
      .then(data => {
        if (data.data.modifiedCount) {
          toast.success("Note Updated(PUT)")
          console.log(data.data)

          const updatedNotes = notes.map((note) => note._id === id ? { ...note, ...putObj } : note)

          setNotes(updatedNotes)

          setSingleNotes({ _id: id, ...putObj });
        }
      })
  }

  // delete data form db
  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/notes/${id}`)
      .then(data => {
        if (data.data.deletedCount) {
          console.log(data.data)
          toast.success("Note Deleted")

          const remainingNotes = notes.filter((note) => note._id !== id)
          setNotes(remainingNotes)
        }
      })
  }
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Notes CRUD UI</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input type="text" name="name" placeholder="Name" className="input w-full" />
        <input type="text" name="description" placeholder="Description" className="input w-full" />
        <input type="submit" value="Submit" className='btn w-full btn-primary' />
      </form>

      {/* Notes */}
      <div className='space-y-4'>
        {notes?.map((note) => (
          <div key={note._id} className='flex items-center gap-2'>

            <p>{note._id}</p>
            <p>{note.name}</p>
            <p>{note.description}</p>

            <button className="btn" onClick={() => {
              document.getElementById('my_modal_1').showModal()
              setId(note._id)
            }}>View Details</button>

            <button className="btn" onClick={() => {
              document.getElementById('my_modal_2').showModal()
              setId(note._id)
            }}>PATCH Update</button>

            <button className="btn" onClick={() => {
              document.getElementById('my_modal_3').showModal()
              setId(note._id)
            }}>PUT Replace</button>

            <button className="btn" onClick={() => { handleDelete(note._id) }}>DELETE</button>

          </div>
        ))}
      </div>

      {/* view details modal */}
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <p>id: {singleNotes?._id}</p>
          <p>Name: {singleNotes?.name}</p>
          <p>Name: {singleNotes?.description}</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* patch modal */}
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <form onSubmit={handlePatchUpdate} className="mb-6 space-y-4">
            <input type="text" name="name" defaultValue={singleNotes?.name} className="input w-full" />
            <input type="text" name="description" defaultValue={singleNotes?.description} className="input w-full" />
            <input type="submit" value="Submit" className='btn w-full btn-primary' />
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* put modal */}
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form onSubmit={handlePutUpdate} className="mb-6 space-y-4">
            <input type="text" name="name" defaultValue={singleNotes?.name} className="input w-full" />
            <input type="text" name="description" defaultValue={singleNotes?.description} className="input w-full" />
            <input type="submit" value="Submit" className='btn w-full btn-primary' />
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

    </div>
  );
}

export default App;
```

Frontend V3 with axios + tanstack query: 

```js
import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function App() {
  const queryClient = useQueryClient();
  const [id, setId] = useState(null);

  // -----------------------------
  // Queries
  // -----------------------------

  // Get all notes
  // const {data: notes = [], ........} we can set default value of notes to empty array 
  // to avoid error before data loads, is optional because we used isLoading check below for this case
  const { data: notes, isLoading, isError, error } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const data = await axios.get("http://localhost:3000/notes");
      return data.data;
    },
  });

  // Get single note
  const { data: singleNotes } = useQuery({
    queryKey: ["note", id],
    queryFn: async () => {
      const data = await axios.get(`http://localhost:3000/notes/${id}`);
      return data.data;
    },
    enabled: !!id, // only fetch if id exists
  });

  // -----------------------------
  // Mutations
  // -----------------------------

  // Create Note
  const createNoteMutation = useMutation({
    mutationFn: async (newNote) => axios.post("http://localhost:3000/notes", newNote),
    onSuccess: () => {
      toast.success("Note Added");
      queryClient.invalidateQueries(["notes"]); // refetch all notes
    },
  });

  // PATCH Note
  const patchNoteMutation = useMutation({
    mutationFn: async ({ id, patchObj }) =>
      axios.patch(`http://localhost:3000/notes/${id}`, patchObj),
    onSuccess: () => {
      toast.success("Note Updated (PATCH)");
      queryClient.invalidateQueries(["notes"]);
      queryClient.invalidateQueries(["note", id]);
    },
  });

  // PUT Note
  const putNoteMutation = useMutation({
    mutationFn: async ({ id, putObj }) =>
      axios.put(`http://localhost:3000/notes/${id}`, putObj),
    onSuccess: () => {
      toast.success("Note Updated (PUT)");
      queryClient.invalidateQueries(["notes"]);
      queryClient.invalidateQueries(["note", id]);
    },
  });

  // DELETE Note
  const deleteNoteMutation = useMutation({
    mutationFn: async (id) => axios.delete(`http://localhost:3000/notes/${id}`),
    onSuccess: () => {
      toast.success("Note Deleted");
      queryClient.invalidateQueries(["notes"]);
    },
  });

  // -----------------------------
  // Handlers
  // -----------------------------

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const description = e.target.description.value;
    createNoteMutation.mutate({ name, description });
    e.target.reset();
  };

  const handlePatchUpdate = (e) => {
    e.preventDefault();
    const patchObj = {
      name: e.target.name.value,
      description: e.target.description.value,
    };
    patchNoteMutation.mutate({ id, patchObj });
  };

  const handlePutUpdate = (e) => {
    e.preventDefault();
    const putObj = {
      name: e.target.name.value,
      description: e.target.description.value,
    };
    putNoteMutation.mutate({ id, putObj });
  };

  const handleDelete = (id) => {
    deleteNoteMutation.mutate(id);
  };

  if (isLoading) {
    return <h2 className="text-center text-5xl">Loading......</h2>;
  }

  if (isError) {
    return <h2 className="text-red-500">Error: {error.message}</h2>
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Notes CRUD UI (React Query)</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input type="text" name="name" placeholder="Name" className="input w-full" />
        <input
          type="text"
          name="description"
          placeholder="Description"
          className="input w-full"
        />
        <input type="submit" value="Submit" className="btn w-full btn-primary" />
      </form>

      {/* Notes List */}
      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note._id} className="flex items-center gap-2">
            <p>{note._id}</p>
            <p>{note.name}</p>
            <p>{note.description}</p>

            <button
              className="btn"
              onClick={() => {
                setId(note._id);
                document.getElementById("my_modal_1").showModal();
              }}
            >
              View Details
            </button>

            <button
              className="btn"
              onClick={() => {
                setId(note._id);
                document.getElementById("my_modal_2").showModal();
              }}
            >
              PATCH Update
            </button>

            <button
              className="btn"
              onClick={() => {
                setId(note._id);
                document.getElementById("my_modal_3").showModal();
              }}
            >
              PUT Replace
            </button>

            <button className="btn" onClick={() => handleDelete(note._id)}>
              DELETE
            </button>
          </div>
        ))}
      </div>

      {/* View Modal */}
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <p>id: {singleNotes?._id}</p>
          <p>Name: {singleNotes?.name}</p>
          <p>Description: {singleNotes?.description}</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* PATCH Modal */}
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <form onSubmit={handlePatchUpdate} className="mb-6 space-y-4">
            <input type="text" name="name" defaultValue={singleNotes?.name} className="input w-full" />
            <input type="text" name="description" defaultValue={singleNotes?.description} className="input w-full" />
            <input type="submit" value="Submit" className="btn w-full btn-primary" />
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* PUT Modal */}
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form onSubmit={handlePutUpdate} className="mb-6 space-y-4">
            <input type="text" name="name" defaultValue={singleNotes?.name} className="input w-full" />
            <input type="text" name="description" defaultValue={singleNotes?.description} className="input w-full" />
            <input type="submit" value="Submit" className="btn w-full btn-primary" />
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

export default App;
```

![image](./assets/images/crud-operation1.png)

## Example 2:

Backend:

```js
const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 3000

const app = express()
app.use(cors()) // use cors middleware
app.use(express.json()) // use express middleware


const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {

    const usersCollection = client.db("userdb").collection('users')

    app.post('/users', async (req, res) => {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.send(result);
    });

    app.get('/users', async (req, res) => {
        const cursor = usersCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    app.get('/users/:id', async (req, res) => {
        const id = req.params.id
        const filter = { _id: new ObjectId(id) }
        const result = await usersCollection.findOne(filter)
        res.send(result)
    })

    app.Patch('/users/:id', async (req, res) => {
        const id = req.params.id
        const filter = { _id: new ObjectId(id) }
        const updatedData = req.body

        const updateDoc = {
            $set: {
                name: updatedData.name,
                email: updatedData.email
            }
        }

        const result = await usersCollection.updateOne(filter, updateDoc)
        res.send(result)
    })

    app.delete('/users/:id', async (req, res) => {
        const id = req.params.id
        const query = { _id: new ObjectId(id) }
        const result = await usersCollection.deleteOne(query)
        res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
```

Frontend: 

```jsx
// main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router';
import MainLayout from './layout/MainLayout';
import App from './App';
import UserDetails from './components/UserDetails';
import UpdateUser from './components/UpdateUser';


const router = createBrowserRouter([
  {
    path: '/',
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: App
      },
      {
        path: '/userDetails/:id',
        Component: UserDetails,
        loader: ({ params }) => fetch(`http://localhost:3000/users/${params.id}`),
        hydrateFallbackElement: <p>Loading..........</p>
      },
      {
        path: '/updateUser/:id',
        Component: UpdateUser,
        loader: ({ params }) => fetch(`http://localhost:3000/users/${params.id}`),
        hydrateFallbackElement: <p>Loading..........</p>
      },
    ]
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)
```

```jsx
import React from 'react';
import { Outlet } from 'react-router';

const MainLayout = () => {
    return (
        <div>
            <Outlet></Outlet>
        </div>
    );
};

export default MainLayout;
```

```jsx
import React from 'react';
import Users from './components/Users';

const usersPromise = fetch('http://localhost:3000/users').then(res => res.json())

const App = () => {
    return (
        <div>
            <Users usersPromise={usersPromise}></Users>
        </div>
    );
};

export default App;
```

```jsx
import React from 'react';
import { useState } from 'react';
import { use } from 'react';
import { Link } from 'react-router';

const Users = ({ usersPromise }) => {

    const initialUsers = use(usersPromise)
    const [users, setUsers] = useState(initialUsers)

    const handleSubmit = (e) => {
        e.preventDefault()
        const name = e.target.name.value
        const email = e.target.email.value
        const newUser = { name, email }

        fetch('http://localhost:3000/users', {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(newUser)
        })
            .then(res => res.json())
            .then(data => {
                if (data.insertedId) {
                    newUser._id = data.insertedId
                    const newUsers = [...users, newUser]
                    setUsers(newUsers)

                    alert("User Added Successfully")
                    console.log(data)
                    e.target.reset()
                }
            })
    }


    const handleDelete = (id) => {
        fetch(`http://localhost:3000/users/${id}`, {
            method: "DELETE",
        })
            .then(res => res.json())
            .then(data => {
                if (data.deletedCount) {
                    const remainingUsers = users.filter((user) => user._id !== id)
                    setUsers(remainingUsers)

                    alert("User deleted successfully")
                    console.log(data)
                }
            })
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" className='input' /><br />
                <input type="email" name="email" className='input' /><br />
                <input type="submit" value="Summit" className='btn' />
            </form>

            {/* view users */}
            <div>
                {users.map((user) =>
                    <p key={user._id}>
                        {user.name} | {user.email}
                        <button onClick={() => handleDelete(user._id)} className='btn btn-xs'>X</button>
                        <Link to={`/userDetails/${user._id}`} className='btn btn-xs'>Details</Link>
                        <Link to={`/updateUser/${user._id}`} className='btn btn-xs'>Update</Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Users;
```

```jsx
import React from 'react';
import { useLoaderData } from 'react-router';

const UserDetails = () => {
    const user = useLoaderData()
    console.log(user)
    return (
        <div>
            <p>{user.name}</p>
            <p>{user.email}</p>
        </div>
    );
};

export default UserDetails;
```

```jsx
import React from 'react';
import { useLoaderData } from 'react-router';

const UpdateUser = () => {
    const user = useLoaderData()

    const handleUpdate = e => {
        e.preventDefault()
        const name = e.target.name.value
        const email = e.target.email.value
        const updatedUser = { name, email }

        fetch(`http://localhost:3000/users/${user._id}`, {
            method: "PUT",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
        })
            .then(res => res.json())
            .then(data => {
                if (data.modifiedCount) {
                    alert("User updated Successfully")
                    console.log(data)
                }
            })

    }

    return (
        <form onSubmit={handleUpdate}>
            <input type="text" name="name" className='input' defaultValue={user.name} /><br />
            <input type="email" name="email" className='input' defaultValue={user.email} /><br />
            <input type="submit" value="Summit" className='btn' />
        </form>
    );
};

export default UpdateUser;
```

![image](./assets/images/crud-operation1.png)

# Express + MongoDB + TS:
## Setup: 

```bash
npm init -y
npm i express mongodb dotenv cors
npm i -D typescript tsx @types/node @types/express @types/mongodb @types/cors 
npx tsc --init
```


```json
{
  "compilerOptions": {
    "rootDir": "./",  
    "outDir": "./dist", 
    "module": "nodenext",
    "target": "esnext",
    "lib": [
      "esnext"
    ],
    "types": [
      "node"
    ],
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "strict": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true,
  }
}
```

package.json:
```json
{
  "name": "zod-backeidn",
  "version": "1.0.0",
  "description": "",
  "main": "index.ts",
  "scripts": {
    "dev": "tsx watch index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "devDependencies": {
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.6",
    "@types/mongodb": "^4.0.6",
    "@types/node": "^25.5.0",
    "cors": "^2.8.6",
    "dotenv": "^17.3.1",
    "express": "^5.2.1",
    "mongodb": "^7.1.1",
    "tsx": "^4.21.0",
    "typescript": "^6.0.2",
    "zod": "^4.3.6"
  }
}
```

## Example 1:

```ts
// index.ts

import express from 'express'
import cors from 'cors'
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()

const port = process.env.PORT || 3000

const app = express()

app.use(cors({
    origin: ['http://localhost:5173', 'add other frontend urls'],
    credentials: true
})) // use cors middleware
app.use(express.json()) // use express middleware


const client = new MongoClient(process.env.MONGODB_URI as string, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {

    const notesCollection = client.db("notesDB").collection('notes')

    // create note
    app.post('/note', async (req, res) => {
        try {
            const note = req.body;
            const result = await notesCollection.insertOne(note);
            return res.status(201).send({
                success: true,
                message: "Note created successfully",
                data: result
            })
        }
        catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: "Failed to create note",
            })
        }
    })

    // GET all notes
    app.get('/notes', async (req, res) => {
        try {
            const result = await notesCollection.find({}).toArray();
            return res.status(200).send({
                success: true,
                message: "Notes retrieved successfully",
                data: result
            })
        }
        catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: "Failed to retrieve notes",
            })
        }
    })

    // GET a single note
    app.get('/note/:id', async (req, res) => {
        try {
            const id = req.params.id

            if (!ObjectId.isValid(id)) {
                return res.status(400).send({
                    success: false,
                    message: "Invalid note id",
                });
            }

            const filter = { _id: new ObjectId(id) }
            const result = await notesCollection.findOne(filter);

            if (!result) {
                return res.status(404).send({
                    success: false,
                    message: "Note not found",
                });
            }

            return res.status(200).send({
                success: true,
                message: "Note retrieved successfully",
                data: result
            })
        }
        catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: "Failed to retrieve note",
            })
        }
    })


    //  partial update a note   
    app.patch('/note/:id', async (req, res) => {
        try {
            const id = req.params.id

            if (!ObjectId.isValid(id)) {
                return res.status(400).send({
                    success: false,
                    message: "Invalid note id",
                });
            }

            const filter = { _id: new ObjectId(id) }
            const updateData = req.body;
            const updateDoc = {
                $set: {
                    name: updateData.name,
                    description: updateData.description
                }
            }
            const result = await notesCollection.updateOne(filter, updateDoc);

            if (result.matchedCount === 0) {
                return res.status(404).send({
                    success: false,
                    message: "Note not found",
                });
            }

            return res.status(200).send({
                success: true,
                message: "Note updated successfully",
                data: result
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: "Failed to update note",
            })
        }
    })

    // DELETE a note
    app.delete('/note/:id', async (req, res) => {
        try {
            const id = req.params.id

            if (!ObjectId.isValid(id)) {
                return res.status(400).send({
                    success: false,
                    message: "Invalid note id",
                })
            }

            const filter = { _id: new ObjectId(id) }
            const result = await notesCollection.deleteOne(filter);

            if (result.deletedCount === 0) {
                return res.status(404).send({
                    success: false,
                    message: "Note not found",
                });
            }

            return res.status(200).send({
                success: true,
                message: "Note deleted successfully",
                data: result
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: "Failed to delete note",
            })
        }

    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
}
run().catch(console.dir);


app.get('/', (req, res) => {
    return res.status(200).send({
        success: true,
        message: "Server is running"
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
```

```js
// .env: 
MONGODB_URI=mongodb://localhost:27017/
```

# Express + MongoDB + TS + Zod:

## Setup: 

```bash
npm init -y
npm i express mongodb cors dotenv zod
npm i -D typescript tsx @types/node @types/express @types/mongodb @types/cors 
npx tsc --init
```

```json
// tsconfig.json 
{
  "compilerOptions": {
    "rootDir": "./",  
    "outDir": "./dist", 
    "module": "nodenext",
    "target": "esnext",
    "lib": [
      "esnext"
    ],
    "types": [
      "node"
    ],
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "strict": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true,
  }
}
```

```json
// package.json:
{
  "name": "zod-backeidn",
  "version": "1.0.0",
  "description": "",
  "main": "index.ts",
  "scripts": {
    "dev": "tsx watch index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "devDependencies": {
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.6",
    "@types/mongodb": "^4.0.6",
    "@types/node": "^25.5.0",
    "cors": "^2.8.6",
    "dotenv": "^17.3.1",
    "express": "^5.2.1",
    "mongodb": "^7.1.1",
    "tsx": "^4.21.0",
    "typescript": "^6.0.2",
    "zod": "^4.3.6"
  }
}
```

## Example 1: 

```ts
// note.validation.ts
import z from "zod";

export const createNoteSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().min(5, "Description must be at least 5 characters"),
});

export const updateNoteSchema = createNoteSchema.partial();
```

```ts
// index.ts

import express from 'express'
import cors from 'cors'
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()
import { createNoteSchema, updateNoteSchema } from './note.validation'

const port = process.env.PORT || 3000

const app = express()

app.use(cors({
    origin: ['http://localhost:5173', 'add other frontend urls'],
    credentials: true
})) // use cors middleware
app.use(express.json())

const client = new MongoClient(process.env.MONGODB_URI as string, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {

    const notesCollection = client.db("notesDB").collection('notes')

    // Create Note
    app.post('/note', async (req, res) => {
        try {
            const data = req.body
            const validation = createNoteSchema.safeParse(data);

            if (!validation.success) {
                return res.status(400).send({
                    success: false,
                    message: "Validation failed",
                    errors: validation.error.flatten()
                });
            }

            const result = await notesCollection.insertOne(validation.data);

            return res.status(201).send({
                success: true,
                message: "Note created successfully",
                data: result
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: "Failed to create note",
            });
        }
    });

    // Get All Notes
    app.get('/notes', async (req, res) => {
        try {
            const result = await notesCollection.find({}).toArray();

            return res.status(200).send({
                success: true,
                message: "Notes fetched successfully",
                data: result
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: "Failed to fetch notes",
            });
        }
    });

    // Get Single Note
    app.get('/note/:id', async (req, res) => {
        try {
            const id = req.params.id

            if (!ObjectId.isValid(id)) {
                return res.status(400).send({
                    success: false,
                    message: "Invalid note id",
                });
            }

            const filter = { _id: new ObjectId(id) }

            const result = await notesCollection.findOne(filter);

            if (!result) {
                return res.status(404).send({
                    success: false,
                    message: "Note not found",
                });
            }

            return res.status(200).send({
                success: true,
                message: "Note fetched successfully",
                data: result
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: "Failed to fetch note",
            });
        }
    });

    // Update Note
    app.patch('/note/:id', async (req, res) => {
        try {
            const data = req.body
            const validation = updateNoteSchema.safeParse(data);

            if (!validation.success) {
                return res.status(400).send({
                    success: false,
                    message: "Validation failed",
                    errors: validation.error.flatten()
                });
            }

            const id = req.params.id;

            if (!ObjectId.isValid(id)) {
                return res.status(400).send({
                    success: false,
                    message: "Invalid note id",
                });
            }

            const filter = { _id: new ObjectId(id) }

            const updateData = validation.data
            /*
             const updateDoc = {
                 $set: {
                     name: updatedData.name,
                     description: updatedData.description
                 }
             }
            */
            // since we already have zod update schema so we can use below
            const updateDoc = {
                $set: updateData
            }

            const result = await notesCollection.updateOne(filter, updateDoc);

            if (result.matchedCount === 0) {
                return res.status(404).send({
                    success: false,
                    message: "Note not found",
                });
            }

            return res.status(200).send({
                success: true,
                message: "Note updated successfully",
                data: result
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: "Failed to update note",
            });
        }
    });

    // Delete Note
    app.delete('/note/:id', async (req, res) => {
        try {
            const id = req.params.id

            if (!ObjectId.isValid(id)) {
                return res.status(400).send({
                    success: false,
                    message: "Invalid note id",
                });
            }

            const filter = { _id: new ObjectId(id) }

            const result = await notesCollection.deleteOne(filter);

            if (result.deletedCount === 0) {
                return res.status(404).send({
                    success: false,
                    message: "Note not found",
                });
            }

            return res.status(200).send({
                success: true,
                message: "Note deleted successfully",
                data: result
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: "Failed to delete note",
            });
        }
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
}

run().catch(console.dir);

app.get('/', (req, res) => {
    return res.status(200).send({
        success: true,
        message: "Server is running",
    });
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
```

# Express + MongoDB + TS + Zod (Modeller Pattern):

## Setup: 

```bash
npm init -y
npm i express mongodb cors zod dotenv
npm i -D typescript tsx @types/node @types/express @types/mongodb @types/cors 
npx tsc --init
```

```json
// tsconfig.json:
{
  "compilerOptions": {
    "rootDir": "./src", 
    "outDir": "./dist", 
    "module": "nodenext",
    "target": "esnext",
    "lib": ["esnext"],
    "types": ["node"],
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "strict": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true,
  }
}
```

```json
// package.json:
{
  "name": "server",
  "version": "1.0.0",
  "description": "",
  "main": "./src/server.ts",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "dependencies": {
    "cors": "^2.8.6",
    "dotenv": "^17.2.3",
    "express": "^5.2.1",
    "mongodb": "^7.0.0",
    "zod": "^4.3.6"
  },
  "devDependencies": {
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.6",
    "@types/mongodb": "^4.0.6",
    "tsx": "^4.21.0",
    "typescript": "^5.9.3"
  }
}
```




Note: For modular architecture follow this golder rule: 
```
Zod Validation
  ⬇️
Types
  ⬇️
Service
  ⬇️
Controller
  ⬇️
Route
  ⬇️
app
  ⬇️
server
```

## Example 1: 

```
src/
│
├── app.ts
├── server.ts
│
├── config/
│   ├── db.ts
│   └── env.ts
│
├── modules/
│   └── notes/
│       ├── notes.route.ts
│       ├── notes.controller.ts
│       ├── notes.service.ts
│       ├── notes.validation.ts
│       └── notes.types.ts
│
├── middlewares/
│   └── validate.ts
│
└── utils/
    └── 
```

```ts
// notes.validation.ts
import { z } from 'zod'

export const createNoteSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1)
})

export const updateNoteSchema = createNoteSchema.partial()
```

```ts
// notes.types.ts
export interface Note {
    name: string
    description: string
}
```


```js
// notes.service.ts
import { ObjectId } from 'mongodb'
import { client } from '../config/db.js'
import { Note } from './notes.types.js'


const notesCollection = client.db('crudDB').collection<Note>('notes')

export const NotesService = {
    create(note: Note) {
        return notesCollection.insertOne(note)
    },

    findAll() {
        return notesCollection.find().toArray()
    },

    findOne(id: string) {
        return notesCollection.findOne({ _id: new ObjectId(id) })
    },

    update(id: string, data: Partial<Note>) {
        return notesCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: data }
        )
    },

    replace(id: string, data: Note) {
        return notesCollection.replaceOne(
            { _id: new ObjectId(id) },
            data,
            { upsert: true }
        )
    },

    delete(id: string) {
        return notesCollection.deleteOne({ _id: new ObjectId(id) })
    }
}
```

```ts
// notes.controller.ts
import { Request, Response } from 'express'
import { NotesService } from './notes.service.js'

export const createNote = async (req: Request, res: Response) => {
    const result = await NotesService.create(req.body)
    res.status(201).json(result)
}

export const getNotes = async (_req: Request, res: Response) => {
    const notes = await NotesService.findAll()
    res.json(notes)
}

export const getNote = async (req: Request, res: Response) => {
    const note = await NotesService.findOne(req.params.id as string)
    res.json(note)
}

export const updateNote = async (req: Request, res: Response) => {
    const result = await NotesService.update(req.params.id as string, req.body)
    res.json(result)
}

export const replaceNote = async (req: Request, res: Response) => {
    const result = await NotesService.replace(req.params.id as string, req.body)
    res.json(result)
}

export const deleteNote = async (req: Request, res: Response) => {
    const result = await NotesService.delete(req.params.id as string)
    res.json(result)
}
```

```ts
// notes.route.ts
import { Router } from 'express'
import { createNote, getNotes, getNote, updateNote, replaceNote, deleteNote } from './notes.controller.js'
import { validate } from '../middlewares/validate.js'
import { createNoteSchema, updateNoteSchema } from './notes.validation.js'

const router = Router()

router.post('/', validate(createNoteSchema), createNote)
router.get('/', getNotes)
router.get('/:id', getNote)
router.patch('/:id', validate(updateNoteSchema), updateNote)
router.put('/:id', validate(createNoteSchema), replaceNote)
router.delete('/:id', deleteNote)

export default router

export const notesRoutes = router
```

```js
// app.ts
import express from 'express'
import cors from 'cors'
import { notesRoutes } from './notes/notes.route.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/notes', notesRoutes)

app.get('/', (_req, res) => {
    res.send('Hello World!')
})

export default app
```

```js
// server.ts
import app from './app.js'
import { connectDB } from './config/db.js'
import { env } from './config/env.js'

async function bootstrap() {
    await connectDB()

    app.listen(env.PORT, () => {
        console.log(`Server running on port ${env.PORT}`)
    })
}

bootstrap()
```

```js
// db.ts
import { MongoClient, ServerApiVersion } from 'mongodb'
import dotenv from 'dotenv'
import { env } from './env.js'

dotenv.config()

export const client = new MongoClient(env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
})

export async function connectDB() {
    await client.connect()
    await client.db('admin').command({ ping: 1 })
    console.log('MongoDB connected')
}
```
```js
// env.ts
import 'dotenv/config'

export const env = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI as string
}

if (!env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing in .env')
}
```
```js
// middlewares/validate.ts
import { Request, Response, NextFunction } from 'express'
import { ZodType } from "zod"

export const validate = <T>(schema: ZodType<T>) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
        return res.status(400).json({
            message: "Validation failed",
            errors: result.error.issues,
        })
    }

    req.body = result.data
    next()
}
```

## Example 2:
[Click here to see the project](./express-mongodb-ts-zod-1)

# Express + Mongoose + JS: 

## Setup: 
- step 1: 

```bash
npm init -y
npm i express mongoose nodemon cors dotenv
```

- step 2:

```json
{
  "name": "mongoose",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs",
  "dependencies": {
    "cors": "^2.8.6",
    "dotenv": "^17.3.1",
    "express": "^5.2.1",
    "mongoose": "^9.3.3",
    "nodemon": "^3.1.14"
  }
}
```

- step 3: 

```js
// index.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI);


// Mongoose Schema + Model
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
});

const UsersCollection = mongoose.model('User', userSchema);

// all cred operations 

app.get('/', (req, res) => {
    res.send('Hello World!');
});


// Server Start
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
```

we can use this function when we works on modular architecture:
```js
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected with Mongoose');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}
```

- step 4:

```
MONGODB_URI=mongodb://localhost:27017/usersDB
```

## Example 1: 

```js
// index.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI);


// Mongoose Schema + Model
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
});

const UsersCollection = mongoose.model('User', userSchema);

// all cred operations 

// root
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// CREATE
app.post('/users', async (req, res) => {
    const user = req.body
    const result = await UsersCollection.create(user);
    res.send(result);
});

// READ ALL
app.get('/users', async (req, res) => {
    const result = await UsersCollection.find()
    res.send(result)
})

// READ ONE
app.get('/users/:id', async (req, res) => {
    const filter = req.params.id
    const result = await UsersCollection.findById(filter);
    res.send(result);
});

// PATCH UPDATE
app.patch('/users/:id', async (req, res) => {
    const filter = req.params.id
    const { name, email } = req.body
    const updatedData = { name, email }
    const updatedDoc = {
        new: true,
        runValidators: true
    }
    const result = await UsersCollection.findByIdAndUpdate(filter, updatedData, updatedDoc);
    res.send(result);
});

// PUT Replace
app.put('/users/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: id }
    const newData = req.body;
    const result = await usersCollection.replaceOne(filter, newData, {
        new: true,
        runValidators: true,
        upsert: true
    });
    res.send(result);
});

// DELETE
app.delete('/users/:id', async (req, res) => {
    const filter = req.params.id
    const result = await UsersCollection.findByIdAndDelete(filter)
    res.send(result)
});


// Server Start
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
```

# Express + PostgreSQL + TS:
## Setup:

- step 1: Install all require packages:

```bash
npm init -y
npm i express pg cors dotenv 
npm i -D typescript tsx @types/node @types/express @types/pg @types/cors
tsc --init
```

- step 2: Modify tsconfig.json and package.json:

```json
// tsconfig.json
{
  "compilerOptions": {
    "rootDir": "./src", 
    "outDir": "./dist", 
    "module": "nodenext",
    "target": "esnext",
    "lib": ["esnext"],
    "types": ["node"],
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "strict": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true,
  }
}
```

```json
// package.json

{
  "name": "express-ts-postgress",
  "version": "1.0.0",
  "description": "",
  "main": "./src/server.ts", 
  "scripts": {
    "dev": "tsx watch ./src/server.ts", 
    "build": "tsc",
    "start": "node ./dist/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs", 
  "dependencies": {
    "dotenv": "^17.4.1",
    "express": "^5.2.1",
    "pg": "^8.20.0"
  },
  "devDependencies": {
    "@types/express": "^5.0.6",
    "@types/node": "^25.5.2",
    "@types/pg": "^8.20.0",
    "tsx": "^4.21.0",
    "typescript": "^6.0.2"
  }
}
```

- step 3: create project on neonDB and add neonDB connection string to env file: 

```js
// .env
CONNECTION_STR=postgresql://username:password@host:port/databaseName
PORT=3000
```

- step 4: Use this boilerplate code:

```js
// src/server.ts

import express, { Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv"
import path from "path"

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
dotenv.config({ path: path.join(process.cwd(), ".env") })
const pool = new Pool({ connectionString: `${process.env.CONNECTION_STR}` });

const initDB = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS notes (
        -- your query
        )`)
}
initDB()

app.get("/", (req: Request, res: Response) => {
    res.send("PostgreSQL + TypeScript API is running!");
});

app.use((req: Request, res: Response) => {
    res.status(404).json({
        error: "Route not found",
        path: req.path,
    });
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
```


## Example 1:

```js
// src/server.ts

import express, { Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv"
import path from "path"

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
dotenv.config({ path: path.join(process.cwd(), ".env") })
const pool = new Pool({ connectionString: `${process.env.CONNECTION_STR}` });


const initDB = async () => {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL
    )`)
}
initDB()


// CREATE note
app.post("/notes", async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;

        const result = await pool.query(
            "INSERT INTO notes (name, description) VALUES($1, $2) RETURNING *",
            [name, description]
        );

        res.status(201).send({
            success: true,
            message: "Note created",
            data: result.rows[0]
        });

    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// GET all notes
app.get("/notes", async (req: Request, res: Response) => {
    try {
        const result = await pool.query("SELECT * FROM notes");

        res.send({
            success: true,
            message: "Notes fetched",
            data: result.rows
        });

    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// GET single note
app.get("/notes/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const result = await pool.query(
            "SELECT * FROM notes WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).send({
                success: false,
                message: "Note not found"
            });
        }

        res.send({
            success: true,
            message: "Note fetched",
            data: result.rows[0]
        });

    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// PATCH - partial update
app.patch("/notes/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const { name, description } = req.body;

        const result = await pool.query(
            `UPDATE notes 
             SET 
                name = COALESCE($1, name),
                description = COALESCE($2, description)
             WHERE id = $3
             RETURNING *`,
            [name ?? null, description ?? null, id]
        );

        res.send({
            success: true,
            message: "Note updated",
            data: result.rows[0]
        });

    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// PUT - full replace (upsert)
app.put("/notes/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const { name, description } = req.body;

        const result = await pool.query(
            `INSERT INTO notes (id, name, description)
             VALUES ($1, $2, $3)
             ON CONFLICT (id)
             DO UPDATE SET
                name = EXCLUDED.name,
                description = EXCLUDED.description
             RETURNING *`,
            [id, name, description]
        );

        res.send({
            success: true,
            message: "Note replaced",
            data: result.rows[0]
        });

    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// DELETE note
app.delete("/notes/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const result = await pool.query(
            "DELETE FROM notes WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).send({
                success: false,
                message: "Note not found"
            });
        }

        res.send({
            success: true,
            message: "Note deleted",
            data: result.rows[0]
        });

    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});


app.get("/", (req: Request, res: Response) => {
    res.send("PostgreSQL + TypeScript API is running!");
});

app.use((req: Request, res: Response) => {
    res.status(404).send({
        error: "Route not found",
        path: req.path,
    });
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
```

# Express + PostgreSQL + TS (Modular pattern): 

## Setup:

- step 1: Install all require packages:

```bash
npm init -y
npm i express pg dotenv cors
npm i -D typescript tsx @types/node @types/express @types/pg @types/cors 
tsc --init
```

- step 2: Modify tsconfig.json and package.json:

```json
// tsconfig.json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "module": "nodenext",
    "target": "esnext",
    "lib": [
      "esnext"
    ],
    "types": [
      "node"
    ],
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "strict": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true,
  }
}
```

```json
// package.json

{
  "name": "express-ts-postgress",
  "version": "1.0.0",
  "description": "",
  "main": "./src/server.ts", 
  "scripts": {
    "dev": "tsx watch ./src/server.ts",
    "build": "tsc",
    "start": "node ./dist/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "pg": "^8.21.0"
  },
  "devDependencies": {
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.6",
    "@types/node": "^25.9.1",
    "@types/pg": "^8.20.0",
    "tsx": "^4.22.3",
    "typescript": "^6.0.3"
  }
}
```

- step 3: create project on neonDB and add neonDB connection string to env file: 

```js
// .env
# CONNECTION_STR=CONNECTION_STR=postgresql://postgres:YOUR_PASSWORD@localhost:5432/todo_app
CONNECTION_STR=CONNECTION_STR=postgresql://postgres:hello@localhost:5432/vehiclesDB
PORT=3000
```

## Example 1: 

```js
src/
│
├── config/
│ ├── db.ts 
│ └── env.ts 
│
├── modules/
│ └── todo/
│ ├── todo.controllers.ts # Handles HTTP requests & responses
│ ├── todo.routes.ts # Defines API routes
│ ├── todo.services.ts # Business logic & DB queries
│ └── todo.types.ts # TypeScript types
│
├── app.ts # Express app configuration (middlewares, routes)
└── server.ts # Server entry point (listen on port)
```

```js
// src/config/env.ts

import dotenv from "dotenv"
// import path from "path"


dotenv.config()

// or
// dotenv.config({ path: path.join(process.cwd(), ".env") })
// console.log(process.cwd())
// /home/muhammad-tamim/programming/programming hero/lavel-2/module-12
// console.log(path.join(process.cwd(), '.env'))
// /home/muhammad-tamim/programming/programming hero/lavel-2/module-12/.env



const envConfig = {
    connectionStr: process.env.CONNECTION_STR,
    port: process.env.PORT,
}

export default envConfig
```

```js
// src/config/db.ts
import { Pool } from "pg";
import envConfig from "./env.js";

export const pool = new Pool({ connectionString: envConfig.connectionStr });

export const initDB = async () => {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS notes (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL
    )
  `);
};
```

```ts
// src/app.ts

import express, { Request, Response } from "express";
import cors from "cors";
import { initDB } from "./config/db.js";
import { todoRoutes } from "./modules/todo/todo.routes.js";

const app = express();

// Middlewares
app.use(cors({
    origin: ["http://localhost:3000", "others-allowed-origins.com"],
    credentials: true,
}));
app.use(express.json());

initDB()


app.use("/todos", todoRoutes)

app.get("/", (_req: Request, res: Response) => {
    res.send("Hello Express!");
});

app.use((req: Request, res: Response) => {
    res.status(404).send({
        error: "Route Not Found",
        path: req.path
    })
})

export default app
```

```ts
// src/server.ts

import app from "./app.js";
import envConfig from "./config/env.js";

const port = envConfig.port || 3000;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
```

```ts
// src/utils/apiResponse.ts

export const apiResponse = {
    success(res: any, data: any, message = "OK") {
        return res.status(200).send({
            success: true,
            message,
            data
        });
    },

    created(res: any, data: any, message = "Created") {
        return res.status(201).send({
            success: true,
            message,
            data
        });
    },

    error(res: any, message = "Something went wrong", status = 500) {
        return res.status(status).send({
            success: false,
            message
        });
    }
};
```

```ts
// src/modules/todo/todo.types.ts

export type Create = {
    name: string,
    description: string
}

export type Update = {
    name?: string,
    description?: string
}
```

```js
// src/modules/todo/todo.services.ts

import { pool } from "../../config/db.js";
import { Create, Update } from "./todo.types.js";

export const todoServices = {
    async create(car: Create) {
        const { name, description } = car
        const result = await pool.query(
            "INSERT INTO notes (name, description) VALUES($1, $2) RETURNING *",
            [name, description]
        );
        return result
    },

    async findAll() {
        const result = await pool.query("SELECT * FROM notes");
        return result;
    },

    async findOne(id: string) {
        const result = await pool.query(
            "SELECT * FROM notes WHERE id = $1",
            [id]
        );
        return result;
    },

    async updateOne(id: string, data: Update) {
        const { name, description } = data;
        const result = await pool.query(
            `UPDATE notes 
             SET 
                name = COALESCE($1, name), 
                description = COALESCE($2, description) 
             WHERE id = $3 
             RETURNING *`,
            [name ?? null, description ?? null, id]
        );
        return result;
    },

    async replaceOne(id: string, data: Update) {
        const { name, description } = data;

        const result = await pool.query(
            `INSERT INTO notes (id, name, description)
             VALUES ($1, $2, $3)
             ON CONFLICT (id)
             DO UPDATE SET 
                name = EXCLUDED.name, 
                description = EXCLUDED.description
             RETURNING *`,
            [id, name, description]
        );
        return result;
    },

    async deleteOne(id: string) {
        const result = await pool.query(
            "DELETE FROM notes WHERE id = $1 RETURNING *",
            [id]
        );
        return result;
    }
}
```

```ts
// src/modules/todo/todo.controllers.ts

import { Request, Response } from "express"
import { todoServices } from "./todo.services.js"
import { Update } from "./todo.types.js"
import { apiResponse } from "../../utils/apiResponse.js"

export const todoControllers = {
    async createTodo(req: Request, res: Response) {
        try {
            const result = await todoServices.create(req.body)
            return apiResponse.created(res, result.rows[0], "Note created");
        }
        catch (err: any) {
            return apiResponse.error(res, err.message);
        }
    },

    async findAllTodo(req: Request, res: Response) {
        try {
            const result = await todoServices.findAll()
            return apiResponse.success(res, result.rows, "Todos fetched");
        }
        catch (err: any) {
            return apiResponse.error(res, err.message);
        }
    },

    async findOneTodo(req: Request, res: Response) {
        try {
            const id = req.params.id as string
            const result = await todoServices.findOne(id)
            return apiResponse.success(res, result.rows[0], "Todo fetched")
        }
        catch (err: any) {
            return apiResponse.error(res, err.message);
        }
    },

    async updateOneTodo(req: Request, res: Response) {
        try {
            const id = req.params.id as string
            const { name, description } = req.body
            const updatedData: Update = { name, description }
            const result = await todoServices.updateOne(id, updatedData)
            return apiResponse.success(res, result.rows[0], "Todo updated");
        }
        catch (err: any) {
            return apiResponse.error(res, err.message);
        }
    },

    async replaceOneTodo(req: Request, res: Response) {
        try {
            const id = req.params.id as string
            const { name, description } = req.body
            const updatedData: Update = { name, description }
            const result = await todoServices.replaceOne(id, updatedData)
            return apiResponse.success(res, result.rows[0], "Todo replaced");
        }
        catch (err: any) {
            return apiResponse.error(res, err.message);
        }
    },

    async deleteOneTodo(req: Request, res: Response) {
        try {
            const id = req.params.id as string
            const result = await todoServices.deleteOne(id)
            return apiResponse.success(res, result.rows[0], "Todo deleted");
        }
        catch (err: any) {
            return apiResponse.error(res, err.message);
        }
    }
}
```

```ts
// src/modules/todo/todo.routes.ts


import { Router } from "express";
import { todoControllers } from "./todo.controllers.js";

const router = Router()

router.post("/", todoControllers.createTodo)
router.get("/", todoControllers.findAllTodo)
router.get("/:id", todoControllers.findOneTodo)
router.patch("/:id", todoControllers.updateOneTodo)
router.put("/:id", todoControllers.replaceOneTodo)
router.delete("/:id", todoControllers.deleteOneTodo)

export const todoRoutes = router
```

## Example 2: 

https://github.com/tamim-111/b6a2


# Express + PostgreSQL + Prisma + Ts: 
## Setup: 
- Step 1: Install dependencies

```bash
npm init -y
npm i express pg dotenv cors @prisma/client @prisma/adapter-pg
npm i -D typescript tsx prisma @types/node @types/express @types/pg @types/cors
npx tsc --init
```

here, 
  - prisma - The Prisma CLI for running commands like prisma init, prisma migrate, and prisma generate
  - @prisma/client - The Prisma Client library for querying your database
  - @prisma/adapter-pg - The node-postgres driver adapter that connects Prisma Client to your database


- Step 2: Configure ESM support: 

```json
// tsconfig.json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2023",
    "strict": true,
    "esModuleInterop": true,
    "ignoreDeprecations": "6.0"
  }
}
```

```json
// package.json
{
  "type": "module"
}
"scripts": {
    "dev": "tsx watch ./index.ts",
    "build": "tsc",
    "start": "node ./dist/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
},
```

- Step 3:  Initialize Prisma ORM: 

```bash
npx prisma init --datasource-provider postgresql --output ../generated/prisma
```

This command does a few things:
  - Creates a prisma/ directory with a schema.prisma file containing your database connection and schema models
  - Creates a .env file in the root directory for environment variables
  - Creates a prisma.config.ts file for Prisma configuration 

- Step 4: update env file with database connection string: 

```js
DATABASE_URL="postgresql://username:password@localhost:5432/mydb?schema=public"
```

- Step 5: Define data model: 

Open prisma/schema.prisma and add the following models:

```js
// prisma/schema.prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model User { 
  id    Int     @id @default(autoincrement()) 
  name  String?
  email String  @unique
} 
```

- step 6: Create and apply your first migration: 

Create and apply your first migration

```bash
npx prisma migrate dev --name init
```

This command creates the database tables based on your schema. Now run the following command to generate the Prisma Client:

```bash
npx prisma generate
```

- Step 7: Instantiate Prisma Client: 

Now that you have all the dependencies installed, you can instantiate Prisma Client. You need to pass an instance of the Prisma ORM driver adapter adapter to the PrismaClient constructor:

```js
// lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
```

- step 8: use this boilerplate code to test setup: 

```ts
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { prisma } from "./lib/prisma";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;


app.get("/", (req: Request, res: Response) => {
    res.send("Prisma + PostgreSQL + TypeScript API is running!");
});



/*
add all crud routes here
*/



app.use((req: Request, res: Response) => {
    res.status(404).send({
        error: "Route not found",
        path: req.path,
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
```

step 9: We can explore our data with Prisma Studio

```bash
npx prisma studio
```

## Example 1: 

```ts
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { prisma } from "./lib/prisma";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

/**
 * CREATE user
 */
app.post("/users", async (req: Request, res: Response) => {
    try {

        const user = await prisma.user.create({ data: req.body });

        res.status(201).send({
            success: true,
            message: "User created",
            data: user,
        });

    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

/**
 * GET all users
 */
app.get("/users", async (_req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();

        res.send({
            success: true,
            message: "Users fetched",
            data: users,
        });

    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

/**
 * GET single user by ID
 */
app.get("/users/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        res.send({
            success: true,
            message: "User fetched",
            data: user,
        });

    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

/**
 * PATCH - partial update
 */
app.patch("/users/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { name, email } = req.body;

        const user = await prisma.user.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(email !== undefined && { email }),
            },
        });

        res.send({
            success: true,
            message: "User updated",
            data: user,
        });

    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

/**
 * PUT - full replace (UPSERT)
 */
app.put("/users/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { name, email } = req.body;

        const user = await prisma.user.upsert({
            where: { id },
            update: { name, email },
            create: { id, name, email },
        });

        res.send({
            success: true,
            message: "User replaced",
            data: user,
        });

    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

/**
 * DELETE user
 */
app.delete("/users/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const user = await prisma.user.delete({
            where: { id },
        });

        res.send({
            success: true,
            message: "User deleted",
            data: user,
        });

    } catch (error: any) {
        res.status(404).send({
            success: false,
            message: "User not found",
        });
    }
});

app.get("/", (_req: Request, res: Response) => {
    res.send("Prisma + PostgreSQL + TypeScript API is running!");
});

app.use((req: Request, res: Response) => {
    res.status(404).send({
        error: "Route not found",
        path: req.path,
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
```

# Express + PostgreSQL + Prisma + Ts (Modular Pattern): 
## Setup: 
- Step 1: Install dependencies

```bash
npm init -y
npm i express pg dotenv cors @prisma/client @prisma/adapter-pg
npm i -D typescript tsx prisma @types/node @types/express @types/pg @types/cors 
npx tsc --init
```

- Step 2: Modify tsconfig.json and package.json:
```json
// tsconfig.json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "module": "esnext",
    "target": "es2023",
    "types": [
      "node"
    ],
    "lib": [
      "esnext"
    ],
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "strict": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true,
    "ignoreDeprecations": "6.0",
    "esModuleInterop": true,
    "moduleResolution": "node",
  },
  "include": [
    "src/**/*",
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

```json
// package.json
{
  "name": "prisma-8",
  "version": "1.0.0",
  "description": "",
  "main": "dist/server.js",
  "scripts": {
    "dev": "tsx watch ./src/server.ts",
    "build": "tsc",
    "start": "node ./dist/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "dependencies": {
    "@prisma/adapter-pg": "^7.8.0",
    "@prisma/client": "^7.8.0",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "pg": "^8.20.0"
  },
  "devDependencies": {
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.6",
    "@types/node": "^25.6.0",
    "@types/pg": "^8.20.0",
    "prisma": "^7.8.0",
    "tsx": "^4.21.0",
    "typescript": "^6.0.3"
  }
}

```

- Step 3:  Initialize Prisma ORM: 

```bash
npx prisma init --datasource-provider postgresql --output ../generated/prisma
```

- Step 4: update env file with database connection string: 

```js
DATABASE_URL="postgresql://username:password@localhost:5432/mydb?schema=public"\
// DATABASE_URL="postgresql://postgres:hello@localhost:5432/test?schema=public"
// port=3000
```

- Step 5: Define data model: 

```js
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model Note {
  id          Int    @id @default(autoincrement())
  name        String
  description String
}
```

- step 6: Create and apply your first migration: 

```bash
npx prisma migrate dev --name init
npx prisma generate
```

- Step 7: Instantiate Prisma Client: 

Now that you have all the dependencies installed, you can instantiate Prisma Client. You need to pass an instance of the Prisma ORM driver adapter adapter to the PrismaClient constructor:

```js
// src/lib/prisma.ts

import { PrismaPg } from "@prisma/adapter-pg";
import config from "../config/env";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = config.databaseUrl;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
```

step 8: We can explore our data with Prisma Studio

```bash
npx prisma studio
```

## Example 1:  

```
node_modules
prisma/
    schema.prisma
src/
    config/
        env.ts
    generated
    lib/
        prisma.ts
    modules/
        notes/ 
            note.types.ts
            note.services.ts
            note.controllers.ts
            note.routes.ts
    utils/
        apiResponse.ts
    app.ts
    server.ts
```

```ts
// src/config/env.ts

import dotenv from "dotenv";

dotenv.config();

const config = {
    port: process.env.PORT || "3000",
    databaseUrl: process.env.DATABASE_URL,
};

export default config;
```

```ts
// src/utils/apiResponse.ts

export const apiResponse = {
    success(res: any, data: any, message = "OK") {
        return res.status(200).send({
            success: true,
            message,
            data
        });
    },

    created(res: any, data: any, message = "Created") {
        return res.status(201).send({
            success: true,
            message,
            data
        });
    },

    error(res: any, message = "Something went wrong", status = 500) {
        return res.status(status).send({
            success: false,
            message
        });
    }
};
```

```ts
// src/modules/note/note.types.ts

export type CreateNote = {
    name: string;
    description: string;
};

export type UpdateNote = {
    name?: string;
    description?: string;
};
```

```ts
// src/modules/note/note.services.ts

import { prisma } from "../../lib/prisma.js";
import { CreateNote, UpdateNote } from "./note.types.js";

export const noteServices = {
    create(data: CreateNote) {
        return prisma.note.create({ data });
    },

    findAll() {
        return prisma.note.findMany();
    },

    findOne(id: number) {
        return prisma.note.findUnique({ where: { id } });
    },

    updateOne(id: number, data: UpdateNote) {
        return prisma.note.update({
            where: { id },
            data,
        });
    },

    replaceOne(id: number, data: CreateNote) {
        return prisma.note.upsert({
            where: { id },
            update: data,
            create: { id, ...data },
        });
    },

    deleteOne(id: number) {
        return prisma.note.delete({
            where: { id },
        });
    },
};
```

```ts
// src/modules/note/note.controllers.ts

import { Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse";
import { noteServices } from "./note.controllers";

export const noteControllers = {
    async create(req: Request, res: Response) {
        try {
            const result = await noteServices.create(req.body);
            return apiResponse.created(res, result, "Note created");
        } catch (err: any) {
            return apiResponse.error(res, err.message);
        }
    },

    async findAll(_req: Request, res: Response) {
        try {
            const result = await noteServices.findAll();
            return apiResponse.success(res, result, "Notes retrieved");
        } catch (err: any) {
            return apiResponse.error(res, err.message);
        }
    },

    async findOne(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const result = await noteServices.findOne(id);
            return apiResponse.success(res, result, "Note retrieved");
        } catch (err: any) {
            return apiResponse.error(res, err.message);
        }
    },

    async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const result = await noteServices.updateOne(id, req.body);
            return apiResponse.success(res, result, "Note updated");
        } catch (err: any) {
            return apiResponse.error(res, err.message);
        }
    },

    async replace(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const result = await noteServices.replaceOne(id, req.body);
            return apiResponse.success(res, result, "Note replaced");
        } catch (err: any) {
            return apiResponse.error(res, err.message);
        }
    },

    async delete(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const result = await noteServices.deleteOne(id);
            return apiResponse.success(res, result, "Note deleted");
        } catch (err: any) {
            return apiResponse.error(res, err.message);
        }
    },
};
```


```ts
// src/modules/note/note.routes.ts

import { Router } from "express";
import { noteControllers } from "./note.services";

const router = Router();

router.post("/", noteControllers.create);
router.get("/", noteControllers.findAll);
router.get("/:id", noteControllers.findOne);
router.patch("/:id", noteControllers.update);
router.put("/:id", noteControllers.replace);
router.delete("/:id", noteControllers.delete);

export const noteRoutes = router;
```

```ts
// src/app.ts

import express, { Request, Response } from "express";
import cors from "cors";
import { noteRoutes } from "./modules/note/note.routes";

const app = express();
app.use(express.json());

app.use(cors({
    origin: "*", // change this in production
    credentials: true,
})
);

app.use("/notes", noteRoutes);

app.get("/", (_req: Request, res: Response) => {
    res.send("Hello Prisma!");
});

app.use((req: Request, res: Response) => {
    res.status(404).send({
        error: "Route Not Found",
        path: req.path,
    });
});

export default app;
```

```ts
// src/server.ts

import app from "./app.js";
import config from "./config/env.js";
import { prisma } from "./lib/prisma.js";

const port = Number(config.port) || 3000;

async function startServer() {
    try {
        await prisma.$connect();
        console.log("Connected to the database successfully.");

        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error("An error occurred:", error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

startServer()
```

```js
// simplified

import app from "./app.js";
import config from "./config/env.js";

const port = Number(config.port) || 3000;


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
```