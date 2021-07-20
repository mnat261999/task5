const router = require('express').Router()
const auth = require('../middleware/authen')

const userCtrl = require('../controllers/userCtrl')
const passport = require('passport');

router.post('/register', userCtrl.register)

router.post('/login',(req, res, next) => {
    passport.authenticate('login', {
      successRedirect: 'https://res.cloudinary.com/lucy2619288/image/upload/v1626764234/success_qjrvr4.jpg',
      failureRedirect: 'https://res.cloudinary.com/lucy2619288/image/upload/v1626764202/err_zunxon.png',
      failureFlash: true
    })(req, res, next);
  });

  router.get('/infor', auth, userCtrl.getInformationUser)
  router.get('/all', auth, userCtrl.getAllUser)
  router.delete('/delete/:id', auth, userCtrl.deleteUser)
  router.get('/access_token', (req, res) => {
    res.send(req.flash('accesstoken'));
});
router.patch('/update', auth, userCtrl.updateUser)


module.exports = router