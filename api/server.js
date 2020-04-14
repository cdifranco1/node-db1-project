const express = require("express");

const db = require("../data/dbConfig.js");

const server = express();
const router = express.Router()

server.use(express.json());
server.use('/api/accounts', router);


router.get('/', (req, res) => {
  db('accounts')
  .then(accounts => {
    res.status(200).json(accounts)
  })
})

router.get('/:id', (req, res) => {
  const { id } = req.params
  db('accounts')
  .first()
  .where('id', id)
  .then(account => {
    if (account){
      res.status(200).json(account)
    } else {
      res.status(404).json({ message: `Account with specified ID of ${id} not found.`})
    }
  })
  .catch(err => {
    res.status(500).json({ message: err.message})
  })
})

router.post('/', (req, res) => {
  const account = req.body
  db
    .insert(account)
    .into('accounts')
    .then(ids => {
      db('accounts')
      .where({id: ids[0]})
      .first()
      .then(account => {
        res.status(200).json(account)
      })
    })
    .catch(err => {
      res.status(500).json({ message: err.message})
    })
  })

router.put('/:id', (req, res) => {
  const { id } = req.params
  db('accounts')
    .where({id: id})
    .update(req.body)
    .then(count => {
      if (count){
        db('accounts')
          .where({ id: id })
          .then(account => res.json(account))
      }
      else {
        res.status(404).json({ message: "Account with specified ID not found."})
      }
    })
    .catch(err => {
      res.status(500).json({ message: err.message})
    })
  })

router.delete('/:id', (req, res) => {
  const { id } = req.params
  db('accounts')
    .where({id: id})
    .del()
    .then(count => {
      if (count){
        res.status(200).json({ message: `Account with ID of ${id} removed.`})
      }
      else {
        res.status(404).json({ message: "Account with specified ID not found."})
      }
    })
    .catch(err => {
      res.status(500).json({ message: err.message})
    })
  })


module.exports = server;
