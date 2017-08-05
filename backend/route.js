const translate = require('google-translate-api');
const router = require('express').Router();

router.get('/hello', (req, res) => {
    res.send({hello: 'world'})
})

router.post('/', (req, res) => {
    translate(req.body.speechResult, {to: 'ja'})
    .then(result => {
        res.send(result.text)
    })
    .catch(err => console.error(err))
})


router.post('/nihongo', (req, res) => {
    translate(req.body.speechResult, {to: 'en'})
    .then(result => {
        res.send(result.text)
    })
    .catch(err => console.error(err))
})

module.exports = router;