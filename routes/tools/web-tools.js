const { Router } = require("express");

const router = Router();

router.get('/generate_password', (req, res)=> {
    res.json({password: ""})
})

module.exports.webTools = router;
