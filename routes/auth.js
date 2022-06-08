var express = require('express');
var router = express.Router();
var conn = require('../lib/db');


/*-------------------- ADMIN AUTHENTICATION --------------------*/

  /* GET USER-LOGIN-FORM. */
router.get('/admin', (req, res) => {
  res.render('admin/adm_login', { title: 'Amber Fitness | Admin Login', my_session: req.session});
});

// USER LOGIN Authentication
router.post('/admin/check', function(req, res, next) {
       
    var email = req.body.email;
    var password = req.body.password;
   
    conn.query('SELECT * FROM admin WHERE adm_email = ? AND BINARY adm_pss = ?', [email, password], function(err, results, fields) {
         
      // if login is incorrect or not found
      // console.log(results.length);
      if (results.length <= 0) {
          req.flash('error', 'Invalid credentials Please try again!');
          res.redirect('/auth/admin')
      }
      else { // if login found
          //Assign session variables based on login credentials                
          req.session.loggedin = true;
          req.session.adm_id = results[0].id;
          req.session.adm_fnm = results[0].adm_fnm;
          req.session.adm_lnm = results[0].adm_lnm;
          req.flash('success', 'Welcome Admin!');
          res.redirect('/admin');
          console.log(req.session.adm_fnm);
      }            
    });
  });
/*----------------------------------------------------------------------------------------------------*/

/*-------------------- USER AUTHENTICATION --------------------*/

  /* GET USER-LOGIN-FORM. */
router.get('/user', (req, res) => {
  res.render('user/usr_login', { title: 'Amber Fitness | User Login', my_session: req.session});
});

// USER LOGIN Authentication
router.post('/user/check', function(req, res, next) {
       
    var email = req.body.email;
    var password = req.body.password;
   
    conn.query('SELECT * FROM members WHERE mbr_email = ? AND BINARY mbr_pss = ?', [email, password], function(err, results, fields) {
         
      // if login is incorrect or not found
      // console.log(results.length);
      if (results.length <= 0) {
          req.flash('error', 'Invalid credentials Please try again!')
          res.redirect('/auth/user')
      }
      else { // if login found
          //Assign session variables based on login credentials                
          req.session.loggedin = true;
          req.session.usr_id = results[0].id;
          req.session.mbr_fnm = results[0].mbr_fnm;
          req.session.mbr_lnm = results[0].mbr_lnm;
          req.session.mbrshp_id = results[0].mbrshp_id;
          req.session.mbrshp_sts = results[0].mbrshp_sts;
          res.redirect('/');
          console.log(req.session.usr_id);
      }            
    });
  });
/*----------------------------------------------------------------------------------------------------*/

// Logout user
router.get('/logout', function (req, res) {
  req.session.destroy();
//   req.flash('success', 'Enter Your Login Credentials');
  res.redirect('/');
});


module.exports = router;
