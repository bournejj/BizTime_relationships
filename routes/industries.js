const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");

router.get('/', async (req, res, next) => {
     
    try {
        const results = await db.query(`
        SELECT i.in_code, i.industry, c.code
        FROM industries AS i 
        LEFT JOIN industries_companies AS ic
        ON i.in_code = ic.industry_code
        LEFT JOIN companies AS c
        ON ic.comp_code = c.code        
        `);

        const {in_code, industry, code} = results.rows[0];

        const companies = results.rows.map(c => c.code)
        return res.json({ in_code, industry, companies })
      } catch (e) {
        return next(e);
      }

});
router.post('/', async (req, res, next) => {
    try {
      const { code, industry } = req.body;
      const results = await db.query('INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING code, industry', [code, industry]);
      return res.status(201).json({ company: results.rows[0] })
    } catch (e) {
      return next(e)
    }
  })

module.exports = router;