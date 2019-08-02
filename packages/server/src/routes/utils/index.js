const appRouter = function (app, couch) {
  app.get('/api/utils/ensure_indices', (req, res) => {
    couch.supertest_ottoman.ensureIndices(function (error) {
      if (error) {
        return res.send({error})
      }
      res.send({message: 'Ensure indices places!'})
    })
  })
  app.get('/api/utils/build_indices', (req, res) => {
    couch.supertest_bucket.manager().buildDeferredIndexes(function (error) {
      if (error) {
        return res.send({error})
      }
      res.send({message: 'Built indices!'})
    })
  })
  app.get('/api/utils/test', async (req, res) => {
    res.send('prova')
  })
}

export default appRouter