var express = require('express');
var router = express.Router();
var conn = require('../lib/db');

/*------- GET ADMIN HOME page.-----------*/
router.get('/', (req, res) => {
  conn.query('SELECT (SELECT COUNT(id) FROM members) AS mbrs_cnt, (SELECT COUNT(id) FROM membership_types) AS pkgs_cnt', (err, results) => {
    if (err) {
      res.render('admin/adm_home', { title: 'Amber Fitness | Admin Dashboard', data: ''});
    }else {
      res.render('admin/adm_home', { title: 'Amber Fitness | Admin Dashboard', data: results[0], my_session: req.session});
    }
  });
});


/*--------- GET ADMIN MEMBERS LIST. ---------*/
router.get('/members', (req, res) => {
  conn.query('SELECT mbr.id, mbr.mbr_fnm, mbr.mbr_lnm, mbr.mbr_dob, mbr.mbr_gndr, mbr.mbr_phn, mbr.mbr_adrs, mbr.mbr_email, mbr.mbrshp_id, mbr.mbrshp_sts, gndr.gndr, mtp.mshp_nm, sts.sts FROM gym_app1.members mbr, gym_app1.gender gndr, gym_app1.membership_types mtp, gym_app1.membership_stats sts WHERE mbr.mbr_gndr = gndr.id AND mbr.mbrshp_id = mtp.id AND mbr.mbrshp_sts = sts.id;', (err, results) => {
    if (err) {
      res.render('admin/adm_members', { title: 'Amber Fitness | Members List', data: ''});
    }else {
      res.render('admin/adm_members', { title: 'Amber Fitness | Members List', data: results, my_session: req.session});
    }
  });
});

/*--------- SAVE NEW PACKAGE INFO. -----------*/
router.get('/member-search', function(req, res, next) {
  var mbr_fnm = req.query.mbr_fnm;
  var sql ="SELECT * From members WHERE mbr_fnm LIKE '%"+ mbr_fnm +"%';"
  conn.query(sql, (err, results) => {
    if (err) {
      // console.log(mbrs_srch)
      res.render('admin/adm_members', { title: 'Amber Fitness | Members List', data: '', my_session: req.session});
    }else {
      res.render('admin/adm_members', { title: 'Amber Fitness | Members List', data: results, my_session: req.session});
    }
  });    
});


/* ------ GET ADMIN PACKAGES LIST.-------- */
router.get('/manage-packages', (req, res) => {
  conn.query('SELECT * FROM membership_types', (err, results) => {
    if (err) {
      res.render('admin/adm_packages', { title: 'Amber Fitness | Admin Packages Manager', data: ''});
    }else {
      res.render('admin/adm_packages', { title: 'Amber Fitness | Admin Packages Manager', data: results, my_session: req.session});
    }
  });
});

/*--------- SAVE NEW PACKAGE INFO. -----------*/
router.post('/package/save', function(req, res, next) {
  let newPkgData = {
    mshp_nm: req.body.mshp_nm,
    gym_acs: req.body.gym_acs,
    pool_acs: req.body.pool_acs,
    free_class: req.body.free_class,
    mshp_dur: req.body.mshp_dur,
    mshp_prc: req.body.mshp_prc,
  };
  
  let sqlQuery = "INSERT INTO gym_app1.membership_types SET ?";

  conn.query(sqlQuery, newPkgData, function(err,rows){
      if(err){
          throw err;
      }
      req.flash('success', 'Package created Successfuly!'); 
      res.redirect('/auth/user');   
      next();                
  });    
});


/* GET ADMIN Edit PACKAGE PAGE. */
router.get('/edit-package/:id', (req, res, next) => {
  // conn.query('SELECT books.id AS id, books.bk_ttl AS bk_ttl, books.bk_desc AS bk_desc, books.bk_athr AS bk_athr, books.bk_cat FROM books WHERE id='+ req.params.id, (err, rows) => {
  conn.query('SELECT * FROM membership_types msptp WHERE msptp.id='+ req.params.id, (err, rows) => {
      if (err) {
        res.render('admin/adm_pkg_edit', { title: 'Amber Fitness | Admin Packages Edit', data: ''});
      }else {
        res.render('admin/adm_pkg_edit', { title: 'Amber Fitness | Admin Packages Edit', data: rows[0], my_session: req.session});
      }
  });
});

/*--- POST EDITED PACKAGE INFO ----*/
router.post('/update-package/', function(req, res, next) {
      
  let sqlQuery = "UPDATE membership_types SET mshp_nm ='" + req.body.mshp_nm + 
                                        "', gym_acs ='" + req.body.gym_acs + 
                                        "', pool_acs ='" + req.body.pool_acs + 
                                        "', free_class ='" + req.body.free_class + 
                                        "', mshp_dur ='" + req.body.mshp_dur + 
                                        "', mshp_prc  ='" + req.body.mshp_prc  +
                                        "' WHERE membership_types.id = " + req.body.id;

  conn.query(sqlQuery, function(err,rows){
    //req.flash('error', err); 
    res.redirect('/admin/manage-packages');   
    next();                
  });         
});

/*-------------------- DELETE MEMBERSHIP PACKAGE ------------------*/
/* DELETE SELECTED PACKAGE. */
router.get('/delete-package/:id', function(req, res, next) {
 
  conn.query("DELETE FROM membership_types WHERE id="+ req.params.id, function(err,row){
    if(err){
      //req.flash('error', err); 
      throw err   
    }else{
      res.redirect('/admin/manage-packages');
    }                         
  });      
});

module.exports = router;
