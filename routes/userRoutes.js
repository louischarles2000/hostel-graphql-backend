const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(204).json({
        message: 'Reached server successfully!'
    });
});


module.exports = router;