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
    - [Backend:](#backend)
    - [Frontend V1 with fetch:](#frontend-v1-with-fetch)
    - [Frontend V2 with axios:](#frontend-v2-with-axios)
    - [Frontend V3 with axios + tanstack query:](#frontend-v3-with-axios--tanstack-query)
  - [Example 2:](#example-2)
    - [Backend:](#backend-1)
    - [Frontend:](#frontend)
- [Express + MongoDB + TS:](#express--mongodb--ts)
  - [Setup:](#setup-2)
  - [Example 1:](#example-1-1)
- [Express + MongoDB + TS + Zod:](#express--mongodb--ts--zod)
  - [Setup:](#setup-3)
  - [Example 1:](#example-1-2)
- [Express + MongoDB + TS + Zod (Modular Pattern):](#express--mongodb--ts--zod-modular-pattern)
  - [Setup:](#setup-4)
  - [Example 1:](#example-1-3)
- [Express + Mongoose + JS:](#express--mongoose--js)
  - [Setup:](#setup-5)
  - [Example 1:](#example-1-4)
- [Express + Mongoose + TS:](#express--mongoose--ts)
  - [Setup:](#setup-6)
  - [Example 1:](#example-1-5)
- [Express + Mongoose + TS + Zod (Modular Pattern):](#express--mongoose--ts--zod-modular-pattern)
  - [Setup:](#setup-7)
  - [Example 1:](#example-1-6)
- [Express + PostgreSQL + TS:](#express--postgresql--ts)
  - [Setup:](#setup-8)
  - [Example 1:](#example-1-7)
- [Express + PostgreSQL + TS + Zod (Modular Pattern):](#express--postgresql--ts--zod-modular-pattern)
  - [Setup:](#setup-9)
  - [Example 1:](#example-1-8)
- [Express + PostgreSQL + Prisma + Ts:](#express--postgresql--prisma--ts)
  - [Setup:](#setup-10)
  - [Example 1:](#example-1-9)
- [Express + PostgreSQL + Prisma + Zod +  Ts (Modular Pattern):](#express--postgresql--prisma--zod---ts-modular-pattern)
  - [Setup:](#setup-11)
  - [Example 1:](#example-1-10)


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

**step 1:** 

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
// .env
MONGODB_URI=mongodb://localhost:27017/
PORT=3000
```


## Example 1:

### Backend:

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
})) 
app.use(express.json()) 


const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {

    const notesCollection = client.db("notesDB").collection('notes')

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
    return res.status(200).send({
        success: true,
        message: "Server is running"
    })
})

app.use((req: Request, res: Response) => {
    res.status(404).send({
        success: false,
        message: "Route Not Found",
        path: req.path
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
```

### Frontend V1 with fetch:

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

### Frontend V2 with axios:

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

### Frontend V3 with axios + tanstack query: 

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

### Backend:

```js
const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 3000

const app = express()

app.use(cors({
    origin: ['http://localhost:5173', 'add other frontend urls'],
    credentials: true
})) 
app.use(express.json()) 


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

### Frontend: 

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

```js
// .env: 
MONGODB_URI=mongodb://localhost:27017/
PORT=3000
```

## Example 1:

```ts
// index.ts

import express, { Request, Response } from 'express'
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

type Note = {
    _id?: ObjectId;
    name: string;
    description: string;
}

type CreateNoteInput = {
    name: string;
    description: string;
}
type UpdateNoteInput = {
    name?: string;
    description?: string;
}

async function run() {

    const notesCollection = client.db("notesDB").collection<Note>('notes')

    // create note
    app.post('/note', async (req: Request, res: Response) => {
        try {
            const note: CreateNoteInput = req.body;
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
    app.get('/notes', async (req: Request, res: Response) => {
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
    app.get('/note/:id', async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string

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
    app.patch('/note/:id', async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string

            if (!ObjectId.isValid(id)) {
                return res.status(400).send({
                    success: false,
                    message: "Invalid note id",
                });
            }

            const filter = { _id: new ObjectId(id) }
            const updateData: UpdateNoteInput = req.body;
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
    app.delete('/note/:id', async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string

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


app.get('/', (_req, res: Response) => {
    return res.status(200).send({
        success: true,
        message: "Server is running"
    })
})

app.use((req: Request, res: Response) => {
    res.status(404).send({
        success: false,
        message: "Route Not Found",
        path: req.path
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
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

```ts
// .env
MONGODB_URI=mongodb://localhost:27017/
PORT=3000
```

## Example 1: 

```ts
// index.ts

import express, { Request, Response } from 'express'
import cors from 'cors'
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()
import z from "zod";

const port = process.env.PORT || 3000

const app = express()

app.use(cors({
    origin: ['http://localhost:5173', 'add other frontend urls'],
    credentials: true
})) 
app.use(express.json())

const client = new MongoClient(process.env.MONGODB_URI as string, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const createNoteSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().min(5, "Description must be at least 5 characters"),
});

const updateNoteSchema = createNoteSchema.partial();

type Note = {
    _id: ObjectId;
    name: string;
    description: string;
}
type CreateNoteInput = z.infer<typeof createNoteSchema>;
type UpdateNoteInput = z.infer<typeof updateNoteSchema>;

async function run() {

    const notesCollection = client.db("notesDB").collection<Note>('notes')

    // Create Note
    app.post('/note', async (req: Request, res: Response) => {
        try {
            const data: CreateNoteInput = req.body
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
    app.get('/notes', async (req: Request, res: Response) => {
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
    app.get('/note/:id', async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string

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
    app.patch('/note/:id', async (req: Request, res: Response) => {
        try {
            const data: UpdateNoteInput = req.body
            const validation = updateNoteSchema.safeParse(data);

            if (!validation.success) {
                return res.status(400).send({
                    success: false,
                    message: "Validation failed",
                    errors: validation.error.flatten()
                });
            }

            const id = req.params.id as string;

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
    app.delete('/note/:id', async (req: Request, res: Response) => {
        try { 
            const id = req.params.id as string

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

app.use((req: Request, res: Response) => {
    res.status(404).send({
        success: false,
        message: "Route Not Found",
        path: req.path
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
```

# Express + MongoDB + TS + Zod (Modular Pattern):

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

| Layer      | Main Responsibility                   |
| ---------- | ------------------------------------- |
| Service    | handle business logic + DB operations |
| Controller | handle HTTP request/response          |
| Route      | handle API endpoint                   |


## Setup: 

```bash
npm init -y
npm i express mongodb cors dotenv zod
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

```ts
// env
MONGODB_URI=mongodb://localhost:27017/
PORT=3000
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
│       ├── notes.validations.ts
│       └── notes.types.ts
│
├── middlewares/
│   └── validate.ts
```


```ts
// src/config/db.ts

import { MongoClient, ServerApiVersion } from "mongodb";
import envConfig from "./env.js";

const client = new MongoClient(envConfig.mongodbUri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export const notesCollection = client.db("notesDB").collection("notes");

export async function initDB() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("MongoDB connected successfully");
    }
    catch (error) {
        console.log("MongoDB connection failed", error);
    }
}
```

```ts
// src/config.env.ts

import dotenv from "dotenv";

dotenv.config();

const envConfig = {
    mongodbUri: process.env.MONGODB_URI as string,
    port: process.env.PORT,
};

export default envConfig;
```

```ts
// src/middleware/validate.ts

import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export const validate = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {

    const validation = schema.safeParse(req.body);

    if (!validation.success) {

        const errors = validation.error.issues.map(issue => ({
            field: issue.path.join("."),
            message: issue.message,
        }));

        return res.status(400).send({
            success: false,
            message: "Validation failed",
            errors: errors,
        });
    }

    req.body = validation.data;

    next();
};
```

```ts
// src/app.ts

import express, { Request, Response } from "express";
import cors from "cors";
import { initDB } from "./config/db.js";
import { notesRoutes } from "./modules/notes/notes.routes.js";

const app = express();

// Middlewares
app.use(cors({
    origin: ["http://localhost:5173", "add others url"],
    credentials: true,
}));
app.use(express.json());

// Initialize DB
initDB();

// Routes
app.use("/notes", notesRoutes);

app.get('/', (req, res) => {
    return res.status(200).send({
        success: true,
        message: "Server is running"
    })
})

app.use((req: Request, res: Response) => {
    res.status(404).send({
        success: false,
        message: "Route Not Found",
        path: req.path
    });
});

export default app;
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
// src/modules/notes.types.ts

import z from "zod";
import { createNoteSchema, updateNoteSchema } from "./notes.validations.js";

/*
export type CreateNoteInput = {
    name: string;
    description: string;
}

export type UpdateNoteInput = {
    name?: string;
    description?: string;
}
*/

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
```

```ts
// src/modules/notes.validations.ts

import z from "zod";

export const createNoteSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().min(5, "Description must be at least 5 characters"),
});

export const updateNoteSchema = createNoteSchema.partial();

```

```ts
// src/modules/notes.service.ts

import { ObjectId } from "mongodb";
import { notesCollection } from "../../config/db.js";
import { CreateNoteInput, UpdateNoteInput } from "./notes.types.js";

export const notesService = {
    async createNote(payload: CreateNoteInput) {
        const result = await notesCollection.insertOne(payload);
        return result;
    },

    async getAllNotes() {
        const result = await notesCollection.find({}).toArray();
        return result;
    },

    async getSingleNote(id: string) {
        const filter = { _id: new ObjectId(id) }
        const result = await notesCollection.findOne(filter)
        return result
    },

    async updateNote(id: string, payload: UpdateNoteInput) {
        const filter = { _id: new ObjectId(id) }
        const updateData = payload
        const updateDoc = {
            $set: updateData
        }
        const result = await notesCollection.updateOne(filter, updateDoc)
        return result;
    },

    async deleteNote(id: string) {
        const filter = { _id: new ObjectId(id) }
        const result = await notesCollection.deleteOne(filter)
        return result
    }
}
```

```ts 
// src/modules/notes.controller.ts

import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { notesService } from "./notes.service.js";

export const notesController = {
    async createNote(req: Request, res: Response) {
        try {
            const result = await notesService.createNote(req.body);

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
    },

    async getAllNotes(_req: Request, res: Response) {
        try {
            const result = await notesService.getAllNotes();

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
    },

    async getSingleNote(req: Request, res: Response) {
        try {
            const id = req.params.id as string;

            if (!ObjectId.isValid(id)) {
                return res.status(400).send({
                    success: false,
                    message: "Invalid note id",
                });
            }

            const result = await notesService.getSingleNote(id);

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
    },

    async updateNote(req: Request, res: Response) {
        try {
            const id = req.params.id as string;

            if (!ObjectId.isValid(id)) {
                return res.status(400).send({
                    success: false,
                    message: "Invalid note id",
                });
            }

            const result = await notesService.updateNote(id, req.body);

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
    },

    async deleteNote(req: Request, res: Response) {
        try {
            const id = req.params.id as string;

            if (!ObjectId.isValid(id)) {
                return res.status(400).send({
                    success: false,
                    message: "Invalid note id",
                });
            }

            const result = await notesService.deleteNote(id);

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
    }
}
```

```ts
// src/modules/notes.routes.ts

import { Router } from "express";
import { createNoteSchema, updateNoteSchema } from "./notes.validations.js";
import { validate } from "../../middlewares/validate.js";
import { notesController } from "./notes.controller.js";

export const notesRoutes = Router();

notesRoutes.post("/", validate(createNoteSchema), notesController.createNote);
notesRoutes.get("/", notesController.getAllNotes);
notesRoutes.get("/:id", notesController.getSingleNote);
notesRoutes.patch("/:id", validate(updateNoteSchema), notesController.updateNote);
notesRoutes.delete("/:id", notesController.deleteNote);
```

# Express + Mongoose + JS: 

## Setup: 

```bash
npm init -y
npm i express mongoose nodemon cors dotenv
```

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

```js
// .env
MONGODB_URI=mongodb://localhost:27017/usersDB
PORT=300
```

## Example 1: 


```ts
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const port = process.env.PORT || 3000;

const app = express();

// MIDDLEWARES
app.use(cors({
        origin: ["http://localhost:5173", "add more frontend urls"],
        credentials: true,
    })
);
app.use(express.json());

async function initDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected successfully");
    }
    catch (error) {
        console.log("MongoDB connection failed", error);
        process.exit(1);
    }
}

initDB();

// mongoose schema
const userSchema = new mongoose.Schema({
    name: String,
    description: String,
});

const Note = mongoose.model("Note", noteSchema);

// CREATE NOTE
app.post("/note", async (req, res) => {
    try {
        const note = await Note.create(req.body);

        return res.status(201).send({
            success: true,
            message: "Note created successfully",
            data: note,
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


// GET ALL NOTES
app.get("/notes", async (req, res) => {
    try {
        const notes = await Note.find();

        return res.status(200).send({
            success: true,
            message: "Notes retrieved successfully",
            data: notes,
        });
    }
    catch (error) {
        console.log(error);

        return res.status(500).send({
            success: false,
            message: "Failed to retrieve notes",
        });
    }
});


// GET SINGLE NOTE
app.get("/note/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({
                success: false,
                message: "Invalid note id",
            });
        }

        const note = await Note.findById(id);

        if (!note) {
            return res.status(404).send({
                success: false,
                message: "Note not found",
            });
        }

        return res.status(200).send({
            success: true,
            message: "Note retrieved successfully",
            data: note,
        });
    }
    catch (error) {
        console.log(error);

        return res.status(500).send({
            success: false,
            message: "Failed to retrieve note",
        });
    }
});


// UPDATE NOTE
app.patch("/note/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({
                success: false,
                message: "Invalid note id",
            });
        }

        const updatedNote = await Note.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true,
                // upsert: true; // if we used PUT
            }
        );

        if (!updatedNote) {
            return res.status(404).send({
                success: false,
                message: "Note not found",
            });
        }

        return res.status(200).send({
            success: true,
            message: "Note updated successfully",
            data: updatedNote,
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


// DELETE NOTE
app.delete("/note/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({
                success: false,
                message: "Invalid note id",
            });
        }

        const deletedNote = await Note.findByIdAndDelete(id);

        if (!deletedNote) {
            return res.status(404).send({
                success: false,
                message: "Note not found",
            });
        }

        return res.status(200).send({
            success: true,
            message: "Note deleted successfully",
            data: deletedNote,
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


app.get("/", (req, res) => {
    return res.status(200).send({
        success: true,
        message: "Server is running",
    });
});


app.use((req: Request, res: Response) => {
    res.status(404).send({
        success: false,
        message: "Route Not Found",
        path: req.path
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
```

# Express + Mongoose + TS: 
## Setup: 

```bash
npm init -y
npm i express mongoose cors dotenv 
npm i -D typescript tsx @types/node @types/express @types/cors 
npx tsc --init
```

```json
// package.json
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

```js
// .env
MONGODB_URI=mongodb://localhost:27017/usersDB
PORT=300
```

## Example 1: 

```ts
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

// MIDDLEWARES
app.use(cors({
        origin: ["http://localhost:5173", "add more frontend urls"],
        credentials: true,
    })
);
app.use(express.json());

async function initDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("MongoDB connected successfully");
    }
    catch (error) {
        console.log("MongoDB connection failed", error);
        process.exit(1);
    }
}

initDB();

// mongoose schema
const noteSchema = new mongoose.Schema({
    name: String,
    description: String,
});

const Note = mongoose.model("Note", noteSchema);

type CreateNoteInput = {
    name: string;
    description: string;
}
type UpdateNoteInput = {
    name?: string;
    description?: string;
}

// CREATE NOTE
app.post("/note", async (req: Request, res: Response) => {
    try {
        const data: CreateNoteInput = req.body;
        const note = await Note.create(data);

        return res.status(201).send({
            success: true,
            message: "Note created successfully",
            data: note,
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


// GET ALL NOTES
app.get("/notes", async (req: Request, res: Response) => {
    try {
        const notes = await Note.find();

        return res.status(200).send({
            success: true,
            message: "Notes retrieved successfully",
            data: notes,
        });
    }
    catch (error) {
        console.log(error);

        return res.status(500).send({
            success: false,
            message: "Failed to retrieve notes",
        });
    }
});


// GET SINGLE NOTE
app.get("/note/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params as string;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({
                success: false,
                message: "Invalid note id",
            });
        }

        const note = await Note.findById(id);

        if (!note) {
            return res.status(404).send({
                success: false,
                message: "Note not found",
            });
        }

        return res.status(200).send({
            success: true,
            message: "Note retrieved successfully",
            data: note,
        });
    }
    catch (error) {
        console.log(error);

        return res.status(500).send({
            success: false,
            message: "Failed to retrieve note",
        });
    }
});


// UPDATE NOTE
app.patch("/note/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params as string;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({
                success: false,
                message: "Invalid note id",
            });
        }

        const updateData: UpdateNoteInput = req.body;
        const updatedNote = await Note.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true,
                // upsert: true; // if we used PUT
            }
        );

        if (!updatedNote) {
            return res.status(404).send({
                success: false,
                message: "Note not found",
            });
        }

        return res.status(200).send({
            success: true,
            message: "Note updated successfully",
            data: updatedNote,
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


// DELETE NOTE
app.delete("/note/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params as string;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({
                success: false,
                message: "Invalid note id",
            });
        }

        const deletedNote = await Note.findByIdAndDelete(id);

        if (!deletedNote) {
            return res.status(404).send({
                success: false,
                message: "Note not found",
            });
        }

        return res.status(200).send({
            success: true,
            message: "Note deleted successfully",
            data: deletedNote,
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


app.get("/", (_req, res: Response) => {
    return res.status(200).send({
        success: true,
        message: "Server is running",
    });
});


app.use((req: Request, res: Response) => {
    res.status(404).send({
        success: false,
        message: "Route Not Found",
        path: req.path
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
```



# Express + Mongoose + TS + Zod (Modular Pattern):

```
Zod Validation
  ⬇️
Types
  ⬇️
Mongoose Model
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

| Layer      | Main Responsibility                   |
| ---------- | ------------------------------------- |
| Service    | handle business logic + DB operations |
| Controller | handle HTTP request/response          |
| Route      | handle API endpoint                   |


## Setup: 

```bash
npm init -y
npm i express mongoose cors dotenv zod
npm i -D typescript tsx @types/node @types/express @types/cors 
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
    "mongoose": "^7.0.0",
    "zod": "^4.3.6"
  },
  "devDependencies": {
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.6",
    "tsx": "^4.21.0",
    "typescript": "^5.9.3"
  }
}
```

```ts
// env
MONGODB_URI=mongodb://localhost:27017/notesDB
PORT=3000
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
│       ├── notes.validations.ts
│       ├── notes.model.ts
│       └── notes.types.ts
│
├── middlewares/
│   └── validate.ts
```


```ts
// src/config/db.ts

import mongoose from "mongoose";
import envConfig from "./env.js";

export async function initDB() {
    try {
        await mongoose.connect(envConfig.mongodbUri);

        console.log("MongoDB connected successfully");
    }
    catch (error) {
        console.log("MongoDB connection failed", error);

        process.exit(1);
    }
}
```

```ts
// src/config.env.ts

import dotenv from "dotenv";

dotenv.config();

const envConfig = {
    mongodbUri: process.env.MONGODB_URI as string,
    port: process.env.PORT,
};

export default envConfig;
```

```ts
// src/middleware/validate.ts

import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export const validate = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {

    const validation = schema.safeParse(req.body);

    if (!validation.success) {

        const errors = validation.error.issues.map(issue => ({
            field: issue.path.join("."),
            message: issue.message,
        }));

        return res.status(400).send({
            success: false,
            message: "Validation failed",
            errors: errors,
        });
    }

    req.body = validation.data;

    next();
};
```


```ts
// src/app.ts

import express, { Request, Response } from "express";
import cors from "cors";
import { initDB } from "./config/db.js";
import { notesRoutes } from "./modules/notes/notes.routes.js";

const app = express();

// Middlewares
app.use(cors({
    origin: ["http://localhost:5173", "add others url"],
    credentials: true,
}));
app.use(express.json());

// Initialize DB
initDB();

// Routes
app.use("/notes", notesRoutes);

app.get('/', (req, res) => {
    return res.status(200).send({
        success: true,
        message: "Server is running"
    })
})

app.use((req: Request, res: Response) => {
    res.status(404).send({
        success: false,
        message: "Route Not Found",
        path: req.path
    });
});

export default app;
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
// src/modules/notes.types.ts

import z from "zod";
import { createNoteSchema, updateNoteSchema } from "./notes.validations.js";

/*
export type CreateNoteInput = {
    name: string;
    description: string;
}

export type UpdateNoteInput = {
    name?: string;
    description?: string;
}
*/

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
```

```ts
// src/modules/notes.validations.ts

import z from "zod";

export const createNoteSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().min(5, "Description must be at least 5 characters"),
});

export const updateNoteSchema = createNoteSchema.partial();
```

```ts
// src/modules/notes/notes.model.ts

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
});

export const Note = mongoose.model("Note", noteSchema);
```

```ts
// src/modules/notes/notes.service.ts

import { Note } from "./notes.model.js";
import { CreateNoteInput, UpdateNoteInput } from "./notes.types.js";

export const notesService = {
    async createNote(payload: CreateNoteInput) {
        const result = await Note.create(payload);
        return result;
    },

    async getAllNotes() {
        const result = await Note.find();
        return result;
    },

    async getSingleNote(id: string) {
        const result = await Note.findById(id);
        return result;
    },

    async updateNote( id: string, payload: UpdateNoteInput) {
        const result = await Note.findByIdAndUpdate(id,payload,{new: true, runValidators: true, });
        return result;
    },

    async deleteNote(id: string) {
        const result = await Note.findByIdAndDelete(id);
        return result;
    },
};
```

```ts 
// src/modules/notes/notes.controller.ts

import { Request, Response } from "express";
import mongoose from "mongoose";

import { notesService } from "./notes.service.js";

export const notesController = {
    async createNote(req: Request, res: Response) {
        try {
            const result = await notesService.createNote(req.body);

            return res.status(201).send({
                success: true,
                message: "Note created successfully",
                data: result,
            });
        }
        catch (error) {
            console.log(error);

            return res.status(500).send({
                success: false,
                message: "Failed to create note",
            });
        }
    },

    async getAllNotes(_req: Request, res: Response) {
        try {
            const result = await notesService.getAllNotes();

            return res.status(200).send({
                success: true,
                message: "Notes fetched successfully",
                data: result,
            });
        }
        catch (error) {
            console.log(error);

            return res.status(500).send({
                success: false,
                message: "Failed to fetch notes",
            });
        }
    },

    async getSingleNote(req: Request, res: Response) {
        try {
            const id = req.params.id;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).send({
                    success: false,
                    message: "Invalid note id",
                });
            }

            const result = await notesService.getSingleNote(id);

            if (!result) {
                return res.status(404).send({
                    success: false,
                    message: "Note not found",
                });
            }

            return res.status(200).send({
                success: true,
                message: "Note fetched successfully",
                data: result,
            });
        }
        catch (error) {
            console.log(error);

            return res.status(500).send({
                success: false,
                message: "Failed to fetch note",
            });
        }
    },

    async updateNote(req: Request, res: Response) {
        try {
            const id = req.params.id;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).send({
                    success: false,
                    message: "Invalid note id",
                });
            }

            const result = await notesService.updateNote(id, req.body);

            if (!result) {
                return res.status(404).send({
                    success: false,
                    message: "Note not found",
                });
            }

            return res.status(200).send({
                success: true,
                message: "Note updated successfully",
                data: result,
            });
        }
        catch (error) {
            console.log(error);

            return res.status(500).send({
                success: false,
                message: "Failed to update note",
            });
        }
    },

    async deleteNote(req: Request, res: Response) {
        try {
            const id = req.params.id;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).send({
                    success: false,
                    message: "Invalid note id",
                });
            }

            const result =
                await notesService.deleteNote(id);

            if (!result) {
                return res.status(404).send({
                    success: false,
                    message: "Note not found",
                });
            }

            return res.status(200).send({
                success: true,
                message: "Note deleted successfully",
                data: result,
            });
        }
        catch (error) {
            console.log(error);

            return res.status(500).send({
                success: false,
                message: "Failed to delete note",
            });
        }
    },
};
```

```ts
// src/modules/notes.routes.ts

import { Router } from "express";
import { createNoteSchema, updateNoteSchema } from "./notes.validations.js";
import { validate } from "../../middlewares/validate.js";
import { notesController } from "./notes.controller.js";

export const notesRoutes = Router();

notesRoutes.post("/", validate(createNoteSchema), notesController.createNote);
notesRoutes.get("/", notesController.getAllNotes);
notesRoutes.get("/:id", notesController.getSingleNote);
notesRoutes.patch("/:id", validate(updateNoteSchema), notesController.updateNote);
notesRoutes.delete("/:id", notesController.deleteNote);
```


# Express + PostgreSQL + TS:
## Setup:

```bash
npm init -y
npm i express pg cors dotenv 
npm i -D typescript tsx @types/node @types/express @types/pg @types/cors
tsc --init
```

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
  "type": "module", 
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


```js
// .env
# DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/database_name
DATABASE_URL=postgresql://postgres:hello@localhost:5432/notesDB
PORT=3000
```


## Example 1:

```js
// src/server.ts

import express, { Request, Response } from "express";
import cors from "cors";
import { Pool } from "pg";
import dotenv from 'dotenv'
dotenv.config()

const port = process.env.PORT || 3000

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "add others urls"],
    credentials: true,
}));
app.use(express.json());


const pool = new Pool({ connectionString: `${process.env.DATABASE_URL}` });


const initDB = async () => {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL
    )`)
}
initDB()

type CreateNoteInput = {
    name: string;
    description: string;
}
type UpdateNoteInput = {
    name?: string;
    description?: string;
}

// CREATE note
app.post("/notes", async (req: Request, res: Response) => {
    try {
        const data: CreateNoteInput = req.body;

        const result = await pool.query(
            "INSERT INTO notes (name, description) VALUES($1, $2) RETURNING *", [data.name, data.description]);

        return res.status(201).send({
            success: true,
            message: "Note created successfully",
            data: result.rows[0],
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

// GET all notes
app.get("/notes", async (req: Request, res: Response) => {
    try {
        const result = await pool.query("SELECT * FROM notes");

        return res.status(200).send({
            success: true,
            message: "Notes retrieved successfully",
            data: result.rows,
        });

    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Failed to retrieve notes",
        });
    }
});

// GET single note
app.get("/notes/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id) as number;

        const result = await pool.query("SELECT * FROM notes WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).send({
                success: false,
                message: "Note not found"
            });
        }

        return res.status(200).send({
            success: true,
            message: "Note retrieved successfully",
            data: result.rows[0],
        });

    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Failed to retrieve note",
        });
    }
});

// PATCH - partial update
app.patch("/notes/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id) as number;
        const data: UpdateNoteInput = req.body;

        const result = await pool.query(
            `UPDATE notes 
             SET 
                name = COALESCE($1, name),
                description = COALESCE($2, description)
             WHERE id = $3
             RETURNING *`,
            [data.name, data.description, data.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).send({
                success: false,
                message: "Note not found",
            });
        }

        return res.status(200).send({
            success: true,
            message: "Note updated successfully",
            data: result.rows[0],
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

// PUT - full replace (upsert)
app.put("/notes/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id) as number;
        const data: UpdateNoteInput = req.body;

        const result = await pool.query(
            `INSERT INTO notes (id, name, description)
             VALUES ($1, $2, $3)
             ON CONFLICT (id)
             DO UPDATE SET
                name = EXCLUDED.name,
                description = EXCLUDED.description
             RETURNING *`,
            [data.id, data.name, data.description]
        );

        if (result.rows.length === 0) {
            return res.status(404).send({
                success: false,
                message: "Note not found",
            });
        }

        return res.status(200).send({
            success: true,
            message: "Note updated successfully",
            data: result.rows[0],
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

// DELETE note
app.delete("/notes/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id) as number;

        const result = await pool.query("DELETE FROM notes WHERE id = $1 RETURNING *", [id]);

        if (result.rows.length === 0) {
            return res.status(404).send({
                success: false,
                message: "Note not found"
            });
        }

        return res.status(200).send({
            success: true,
            message: "Note deleted successfully",
            data: result.rows[0],
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


app.get('/', (_req, res) => {
    return res.status(200).send({
        success: true,
        message: "Server is running",
    });
})

app.use((req: Request, res: Response) => {
    res.status(404).send({
        success: false,
        message: "Route Not Found",
        path: req.path
    });
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
```



# Express + PostgreSQL + TS + Zod (Modular Pattern): 

**Note:** For modular architecture follow this golden rule: 
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

| Layer      | Main Responsibility                   |
| ---------- | ------------------------------------- |
| Service    | handle business logic + DB operations |
| Controller | handle HTTP request/response          |
| Route      | handle API endpoint                   |


## Setup:

```bash
npm init -y
npm i express pg dotenv cors zod
npm i -D typescript tsx @types/node @types/express @types/pg @types/cors 
tsc --init
```

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

```js
// .env
# DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/database_name
DATABASE_URL=CONNECTION_STR=postgresql://postgres:hello@localhost:5432/notesDB
PORT=3000
```

## Example 1: 

```js
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
│       ├── notes.routes.ts
│       ├── notes.controller.ts
│       ├── notes.service.ts
│       ├── notes.validations.ts
│       └── notes.types.ts
│
├── middlewares/
│   └── validate.ts
```

```ts
// src/config/db.ts

import { Pool } from "pg";
import envConfig from "./env.js";

export const pool = new Pool({connectionString: envConfig.databaseUrl});

export async function initDB() {
    try {

        await pool.query(`
            CREATE TABLE IF NOT EXISTS notes (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT NOT NULL
            )
        `);

        console.log("PostgreSQL connected successfully");
    }
    catch (error) {
        console.log("PostgreSQL connection failed", error);

        process.exit(1);
    }
}
```

```ts
// src/config/env.ts

import dotenv from "dotenv";

dotenv.config();

const envConfig = {
    databaseUrl: process.env.DATABASE_URL as string,
    port: process.env.PORT,
};

export default envConfig;
```

```ts
// src/middlewares/validate.ts

import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export const validate = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {

    const validation = schema.safeParse(req.body);

    if (!validation.success) {

        const errors = validation.error.issues.map(issue => ({
            field: issue.path.join("."),
            message: issue.message,
        }));

        return res.status(400).send({
            success: false,
            message: "Validation failed",
            errors,
        });
    }

    req.body = validation.data;

    next();
};
```

```ts
// src/app.ts

import express, { Request, Response } from "express";
import cors from "cors";
import { initDB } from "./config/db.js";
import { notesRoutes } from "./modules/notes/notes.route.js";

const app = express();

app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
}));
app.use(express.json());

initDB();

app.use("/notes", notesRoutes);

app.get("/", (_req, res) => {
    return res.status(200).send({
        success: true,
        message: "Server is running",
    });
});

app.use((req: Request, res: Response) => {
    return res.status(404).send({
        success: false,
        message: "Route Not Found",
        path: req.path,
    });
});

export default app;
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
// src/modules/notes/notes.validations.ts

import z from "zod";

export const createNoteSchema = z.object({
    name: z.string().min(2),
    description: z.string().min(5),
});

export const updateNoteSchema = createNoteSchema.partial();
```

```ts
// src/modules/notes/notes.types.ts

import z from "zod";
import { createNoteSchema,updateNoteSchema,} from "./notes.validations.js";

export type CreateNoteInput = z.infer<typeof createNoteSchema>;

export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
```

```ts
// src/modules/notes/notes.service.ts

import { pool } from "../../config/db.js";

import { CreateNoteInput, UpdateNoteInput,} from "./notes.types.js";

export const notesService = {

    async createNote(payload: CreateNoteInput) {

        const result = await pool.query(
            `
            INSERT INTO notes (name, description)
            VALUES ($1, $2)
            RETURNING *
            `,
            [payload.name, payload.description]
        );

        return result.rows[0];
    },

    async getAllNotes() {

        const result = await pool.query(`
            SELECT * FROM notes
            ORDER BY id DESC
        `);

        return result.rows;
    },

    async getSingleNote(id: number) {

        const result = await pool.query(
            `
            SELECT * FROM notes
            WHERE id = $1
            `,
            [id]
        );

        return result.rows[0];
    },

    async updateNote(id: number, payload: UpdateNoteInput) {

        const result = await pool.query(
            `
            UPDATE notes
            SET
                name = COALESCE($1, name),
                description = COALESCE($2, description)
            WHERE id = $3
            RETURNING *
            `,
            [payload.name, payload.description, id]
        );

        return result.rows[0];
    },

    async deleteNote(id: number) {

        const result = await pool.query(
            `
            DELETE FROM notes
            WHERE id = $1
            RETURNING *
            `,
            [id]
        );

        return result.rows[0];
    },
};
```

```ts
// src/modules/notes/notes.controller.ts

import { Request, Response } from "express";
import { notesService } from "./notes.service.js";

export const notesController = {
    async createNote(req: Request, res: Response) {
        try {
            const result =
                await notesService.createNote(req.body);

            return res.status(201).send({
                success: true,
                message: "Note created successfully",
                data: result,
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: "Failed to create note",
            });
        }
    },

    async getAllNotes(_req: Request, res: Response) {
        try {
            const result = await notesService.getAllNotes();

            return res.status(200).send({
                success: true,
                message: "Notes fetched successfully",
                data: result,
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: "Failed to fetch notes",
            });
        }
    },

    async getSingleNote( req: Request, res: Response) {
        try {
            const id = Number(req.params.id);

            const result = await notesService.getSingleNote(id);

            if (!result) {
                return res.status(404).send({
                    success: false,
                    message: "Note not found",
                });
            }

            return res.status(200).send({
                success: true,
                message: "Note fetched successfully",
                data: result,
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: "Failed to fetch note",
            });
        }
    },

    async updateNote(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);

            const result = await notesService.updateNote(id, req.body);

            if (!result) {
                return res.status(404).send({
                    success: false,
                    message: "Note not found",
                });
            }

            return res.status(200).send({
                success: true,
                message: "Note updated successfully",
                data: result,
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: "Failed to update note",
            });
        }
    },

    async deleteNote(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);

            const result = await notesService.deleteNote(id);

            if (!result) {
                return res.status(404).send({
                    success: false,
                    message: "Note not found",
                });
            }

            return res.status(200).send({
                success: true,
                message: "Note deleted successfully",
                data: result,
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: "Failed to delete note",
            });
        }
    },
};
```

```ts
// src/modules/notes/notes.routes.ts

import { Router } from "express";
import { createNoteSchema, updateNoteSchema } from "./notes.validations.js";
import { validate } from "../../middlewares/validate.js";
import { notesController } from "./notes.controller.js";

export const notesRoutes = Router();

notesRoutes.post("/", validate(createNoteSchema), notesController.createNote);
notesRoutes.get("/", notesController.getAllNotes);
notesRoutes.get("/:id", notesController.getSingleNote);
notesRoutes.patch("/:id", validate(updateNoteSchema), notesController.updateNote);
notesRoutes.delete("/:id", notesController.deleteNote);
```

# Express + PostgreSQL + Prisma + Ts: 

## Setup: 

**Step 1:**

```bash
npm init -y
npm i express pg dotenv cors @prisma/client @prisma/adapter-pg
npm i -D typescript tsx prisma @types/node @types/express @types/pg @types/cors
npx tsc --init
```

here, 
- prisma - The Prisma CLI for running commands like prisma init, prisma migrate, and prisma generate
- @prisma/client - The Prisma Client library for querying our database
- @prisma/adapter-pg - The node-postgres driver adapter that connects Prisma Client to our database


**Step 2:** 

```json
// tsconfig.json
{
  "compilerOptions": {
    "rootDir": "./",
    "outDir": "./dist",
    "module": "esnext",
    "target": "es2023",
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
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "ignoreDeprecations": "6.0"
  }
}
```

```json
// package.json
{
  "name": "express-pg-prisma-ts",
  "version": "1.0.0",
  "description": "",
  "main": "./index.ts",
  "scripts": {
    "dev": "tsx watch ./index.ts",
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
    "pg": "^8.21.0"
  },
  "devDependencies": {
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.6",
    "@types/node": "^25.9.1",
    "@types/pg": "^8.20.0",
    "prisma": "^7.8.0",
    "tsx": "^4.22.3",
    "typescript": "^6.0.3"
  }
}
```

**Step 3:**  Initialize Prisma ORM: 

```bash
npx prisma init --datasource-provider postgresql --output ../generated/prisma
```

This command does few things:
- Creates a `prisma` directory with a `schema.prisma` file containing our database connection and schema models: 
- Creates a `.env` file in the root directory for environment variables
- Creates a `prisma.config.ts` file for Prisma configuration 

**Step 4:**

```js
// .env
# DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
DATABASE_URL="postgresql://postgres:hello@localhost:5432/notesDB?schema=public"
PORT=3000
```

**Step 5:** Define database model

```js
// prisma/schema.prisma

generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

// database models
model Note {
  id          Int    @id @default(autoincrement())
  name        String
  description String
}
```

**Step 6:** Create and apply first migration and generate

```bash
npx prisma migrate dev --name init
npx prisma generate
```

here:
- `npx prisma migrate dev --name init`: Runs database migrations from schema.prisma data model and creates raw PostgreSQL queries on this directory `prisma/migrations`.
- `npx prisma generate`: Generates the TypeScript for Prisma Client

**Step 7:** Instantiate Prisma Client

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

**step 8:** Now we can explore our data with Prisma Studio

```bash
npx prisma studio
```

## Example 1: 

```ts
// index.ts

import express, { Request, Response } from "express";
import cors from "cors";
import { prisma } from "./lib/prisma";
import dotenv from 'dotenv'
dotenv.config()

const port = process.env.PORT || 3000

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "add others urls"],
    credentials: true,
}));
app.use(express.json());

type CreateNoteInput = {
    name: string;
    description: string;
}
type UpdateNoteInput = {
    name?: string;
    description?: string;
}

// CREATE note
app.post("/notes", async (req: Request, res: Response) => {
    try {
        const inputData: CreateNoteInput = req.body;


        const result = await prisma.note.create({ data: inputData });

        return res.status(201).send({
            success: true,
            message: "Note created successfully",
            data: result,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).send({
            success: false,
            message: "Failed to create note",
        });
    }
});

// GET all notes
app.get("/notes", async (_req: Request, res: Response) => {
    try {
        const result = await prisma.note.findMany();

        return res.status(200).send({
            success: true,
            message: "Notes retrieved successfully",
            data: result,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).send({
            success: false,
            message: "Failed to retrieve notes",
        });
    }
});

// GET single note
app.get("/notes/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id) as number;

        const result = await prisma.note.findUnique({
            where: { id }
        });

        if (!result) {
            return res.status(404).send({
                success: false,
                message: "Note not found",
            });
        }

        return res.status(200).send({
            success: true,
            message: "Note retrieved successfully",
            data: result,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).send({
            success: false,
            message: "Failed to retrieve note",
        });
    }
});
// PATCH - partial update
app.patch("/notes/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id) as number;
        const updateData: UpdateNoteInput = req.body;

        const existingNote = await prisma.note.findUnique({
            where: { id },
        });

        if (!existingNote) {
            return res.status(404).send({
                success: false,
                message: "Note not found",
            });
        }

        const result = await prisma.note.update({
            where: {
                id,
            },
            data: {
                ...(data.name !== undefined && { data.name }),
                ...(data.description !== undefined && { data.description }),
            },
        });

        return res.status(200).send({
            success: true,
            message: "Note updated successfully",
            data: result,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).send({
            success: false,
            message: "Failed to update note",
        });
    }
});


app.put("/notes/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const updateData: UpdateNoteInput = req.body;

        const existingNote = await prisma.note.findUnique({
            where: { id },
        });

        if (!existingNote) {
            return res.status(404).send({
                success: false,
                message: "Note not found",
            });
        }

        const result = await prisma.note.update({
            where: {
                id,
            },
            data: updateData,
        });

        return res.status(200).send({
            success: true,
            message: "Note replaced successfully",
            data: result,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).send({
            success: false,
            message: "Failed to replace note",
        });
    }
});

// DELETE note
app.delete("/notes/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id) as number;

        const existingNote = await prisma.note.findUnique({
            where: { id },
        });

        if (!existingNote) {
            return res.status(404).send({
                success: false,
                message: "Note not found",
            });
        }

        const result = await prisma.note.delete({
            where: { id },
        });

        return res.status(200).send({
            success: true,
            message: "Note deleted successfully",
            data: result,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).send({
            success: false,
            message: "Failed to delete note",
        });
    }
});


app.get('/', (_req, res: Response) => {
    return res.status(200).send({
        success: true,
        message: "Server is running",
    });
})

app.use((req: Request, res: Response) => {
    res.status(404).send({
        success: false,
        message: "Route Not Found",
        path: req.path
    });
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
```

# Express + PostgreSQL + Prisma + Zod +  Ts (Modular Pattern): 

```
Zod Validation
  ⬇️
Types
  ⬇️
Database Model (prisma)
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

| Layer      | Main Responsibility                   |
| ---------- | ------------------------------------- |
| Service    | handle business logic + DB operations |
| Controller | handle HTTP request/response          |
| Route      | handle API endpoint                   |



## Setup: 
**Step 1:**

```bash
npm init -y
npm i express pg dotenv cors zod @prisma/client @prisma/adapter-pg
npm i -D typescript tsx prisma @types/node @types/express @types/pg @types/cors 
npx tsc --init
```

**Step 2:**

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

- Step 4: update env file: 

```js
// .env
DATABASE_URL="postgresql://postgres:hello@localhost:5432/notesDB?schema=public"
port=3000
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

- step 6: Create and apply your first migration and generate Prisma Client: 

```bash
npx prisma migrate dev --name init
npx prisma generate
```

- Step 7: Instantiate Prisma Client: 

```js
// src/lib/prisma.ts

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import envConfig from "../config/env";

const connectionString = envConfig.databaseUrl;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
```

step 8: We can explore our data with Prisma Studio

```bash
npx prisma studio
```

## Example 1:  

```js
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
            note.validations.ts
            note.service.ts
            note.controller.ts
            note.routes.ts
    app.ts
    server.ts
```

```ts
// src/config/env.ts

import dotenv from "dotenv";

dotenv.config();

const envConfig = {
    port: process.env.PORT || 3000,
    databaseUrl: process.env.DATABASE_URL
};

export default envConfig;
```

```ts
// src/middleware/validate.ts

import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export const validate = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {

    const validation = schema.safeParse(req.body);

    if (!validation.success) {

        const errors = validation.error.issues.map(issue => ({
            field: issue.path.join("."),
            message: issue.message,
        }));

        return res.status(400).send({
            success: false,
            message: "Validation failed",
            errors: errors,
        });
    }

    req.body = validation.data;

    next();
};
```

```ts
// src/app.ts

import express, { Request, Response } from "express";
import cors from "cors";
import { notesRoutes } from "./modules/notes/notes.routes.js";

const app = express();

app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
}));
app.use(express.json());

app.use("/notes", notesRoutes);

app.get("/", (_req, res) => {
    return res.status(200).send({
        success: true,
        message: "Server is running",
    });
});

app.use((req: Request, res: Response) => {
    return res.status(404).send({
        success: false,
        message: "Route Not Found",
        path: req.path,
    });
});

export default app;
```

```ts
// src/server.ts

import app from "./app.js";
import envConfig from "./config/env.js";

const port = Number(envConfig.port);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
```

```ts
// src/modules/notes/notes.validations.ts

import z from "zod";

export const createNoteSchema = z.object({
    name: z.string().min(2),
    description: z.string().min(5),
});

export const updateNoteSchema = createNoteSchema.partial();
```

```ts
// src/modules/notes/notes.types.ts
import z from "zod";
import { createNoteSchema, updateNoteSchema, } from "./notes.validations.js";

export type CreateNoteInput = z.infer<typeof createNoteSchema>;

export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
```

```ts
// src/modules/notes/notes.service.ts

import { prisma } from "../../lib/prisma.js";
import { CreateNoteInput, UpdateNoteInput, } from "./notes.types.js";

export const notesService = {

    async createNote(payload: CreateNoteInput) {
        const result = await prisma.note.create({ data: payload });
        return result;
    },

    async getAllNotes() {
        const result = prisma.note.findMany({
            orderBy: {
                id: "desc",
            },
        });
        return result
    },

    async getSingleNote(id: number) {
        const result = prisma.note.findUnique({
            where: { id },
        });
        return result
    },

    async updateNote(id: number, payload: UpdateNoteInput) {
        const result = prisma.note.update({
            where: { id },
            data: payload,
        });
        return result
    },

    async deleteNote(id: number) {
        const result = prisma.note.delete({
            where: { id },
        });
        return result
    },
};
```

```ts
// src/modules/notes/notes.controller.ts

import { Request, Response } from "express";
import { notesService } from "./notes.service.js";

export const notesController = {
    async createNote(req: Request, res: Response) {
        try {
            const result = await notesService.createNote(req.body);

            return res.status(201).send({
                success: true,
                message: "Note created successfully",
                data: result,
            });

        } catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: "Failed to create note",
            });
        }
    },

    async getAllNotes(_req: Request, res: Response) {
        try {
            const result = await notesService.getAllNotes();

            return res.status(200).send({
                success: true,
                message: "Notes retrieved successfully",
                data: result,
            });

        } catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: "Failed to retrieve notes",
            });
        }
    },

    async getSingleNote(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);

            const result = await notesService.getSingleNote(id);

            if (!result) {
                return res.status(404).send({
                    success: false,
                    message: "Note not found",
                });
            }

            return res.status(200).send({
                success: true,
                message: "Note retrieved successfully",
                data: result,
            });

        } catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: "Failed to retrieve note",
            });
        }
    },

    async updateNote(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);

            const existing = await notesService.getSingleNote(id);

            if (!existing) {
                return res.status(404).send({
                    success: false,
                    message: "Note not found",
                });
            }

            const result = await notesService.updateNote(id, req.body);

            return res.status(200).send({
                success: true,
                message: "Note updated successfully",
                data: result,
            });

        } catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: "Failed to update note",
            });
        }
    },

    async deleteNote(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);

            const existing = await notesService.getSingleNote(id);

            if (!existing) {
                return res.status(404).send({
                    success: false,
                    message: "Note not found",
                });
            }

            const result = await notesService.deleteNote(id);

            return res.status(200).send({
                success: true,
                message: "Note deleted successfully",
                data: result,
            });

        } catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: "Failed to delete note",
            });
        }
    },
};
```

```ts
// src/modules/notes/notes.routes.ts

import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { createNoteSchema, updateNoteSchema } from "./notes.validations.js";
import { notesController } from "./notes.controller.js";

export const notesRoutes = Router();

notesRoutes.post( "/", validate(createNoteSchema), notesController.createNote);
notesRoutes.get("/", notesController.getAllNotes);
notesRoutes.get("/:id", notesController.getSingleNote);
notesRoutes.patch("/:id", validate(updateNoteSchema), notesController.updateNote);
notesRoutes.delete("/:id", notesController.deleteNote);
```