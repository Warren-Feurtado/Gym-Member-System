var express = require('express');
var router = express.Router();
var conn = require('../lib/db');
var dateTime = require('node-datetime');

/* GET HOME page. */
router.get('/', (req, res) => {
res.render('user/index', { title: 'Amber Fitness | Home', my_session: req.session});
});


/* GET USER REGISTRATION page. */
router.get('/sign-up', (req, res) => {

    var todayDate = dateTime.create();
    var joinDtFrmtd = todayDate.format('Y-m-d H:M:S');
    // var expDtFrmtd = new Date(joinDtFrmtd.setDate(todayDate.getDate() + 30)).toISOString().slice(0, 19).replace ('T', ' ');

    var expDtFrmtd = new Date( );
        expDtFrmtd.setDate(expDtFrmtd.getDate() + 30);
    console.log(expDtFrmtd);


    function formatDate(date){
        var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    var endDate = formatDate(expDtFrmtd);

    res.render('user/usrSignUp', { title: 'Amber Fitness | Sign-Up', my_session: req.session, reg_dt: joinDtFrmtd, exp_dt: endDate});
});

/* SAVE USER REGISTRATION INFO. */
router.post('/save', function(req, res, next) {
    let newMbrData = {
      mbr_fnm: req.body.fname,
      mbr_lnm: req.body.lname,
      mbr_dob: req.body.dob,
      mbr_gndr: req.body.gender,
      mbr_phn: req.body.phone,
      mbr_adrs: req.body.adrs,
      mbr_email: req.body.email,
      mbr_pss: req.body.password,
    };
    
    let sqlQuery = "INSERT INTO gym_app1.members SET ?";
  
    conn.query(sqlQuery, newMbrData, function(err,rows){
        if(err){
            throw err;
        }
        req.flash('success', 'Your Registration was Successful!'); 
        res.redirect('/auth/user');   
        next();                
    });    
  });


  /* ----GET MEMBERSHIP PACKAGES PAGE.---- */
router.get('/membership-packages', (req, res) => {
    conn.query('SELECT * FROM membership_types mtp;', (err, results) => {
      if (err) {
        res.render('user/usr_membership', { title: 'Amber Fitness | Membership Packages', data: ''});
      }else {
        res.render('user/usr_membership', { title: 'Amber Fitness | Membership Packages', data: results, my_session: req.session});
      }
    });
  });


module.exports = router;
