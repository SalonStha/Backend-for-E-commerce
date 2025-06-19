const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: true }), // session: true is default and usually desired
  (req, res) => {
    // Successful authentication, redirect home or to a dashboard.
    // res.redirect('/');
    res.json({ message: "Google authentication successful", user: req.user });
  }
);

// Facebook Auth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login', session: true }),
  (req, res) => {
    res.json({ message: "Facebook authentication successful", user: req.user });
  }
);

// Apple Auth
router.get('/apple', passport.authenticate('apple'));

router.post('/apple/callback', // Apple uses POST for callback
  passport.authenticate('apple', { failureRedirect: '/login', session: true }),
  (req, res) => {
    res.json({ message: "Apple authentication successful", user: req.user });
  }
);

// GitHub Auth
router.get('/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login', session: true }),
  (req, res) => {
    res.json({ message: "GitHub authentication successful", user: req.user });
  }
);

// LinkedIn Auth (Add if you set up LinkedIn)
/*
router.get('/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE'  })); // Add state for CSRF protection

router.get('/linkedin/callback',
  passport.authenticate('linkedin', { failureRedirect: '/login', session: true }),
  (req, res) => {
    res.json({ message: "LinkedIn authentication successful", user: req.user });
  }
);
*/

// Example Logout Route (optional)
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    // res.redirect('/');
    res.json({ message: "Logout successful" });
  });
});

// Example Protected Route (optional)
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
  // Or redirect to login page: res.redirect('/login');
}

router.get('/profile', ensureAuthenticated, (req, res) => {
  res.json({ user: req.user });
});


module.exports = router; 