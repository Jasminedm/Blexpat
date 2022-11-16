const cloudinary = require("../config/cloudinary");
const upload = require("../config/multer")
const ObjectId = require("mongodb").ObjectId;
module.exports = function (app, passport, db) {
  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get("/", function (req, res) {
    res.render("index.ejs");
  });

  // PROFILE SECTION =========================
  app.get("/profile", isLoggedIn, function (req, res) {
        res.render("profile.ejs", {
          user: req.user
        });
      });
  

  // LOGOUT ==============================
  app.get("/blex", isLoggedIn, function (req, res) {
    console.log('get/blex')
    db.collection('blog').find().toArray((err, result) => {
      if (err) return console.log(err)
      console.log(req.user.local.img)
      res.render('blex.ejs', {
        user : req.user,
        blexdata: result,
        img: req.user.local.img
      })
    })
  });
  
  app.get("/nexthome", isLoggedIn, function (req, res) {
    res.render("nexthome.ejs");
  });

  app.get("/findexperience", isLoggedIn, function (req, res) {
    res.render("findexperience.ejs");
  });

  app.get("/connect", isLoggedIn, function (req, res) {
    res.render("connect.ejs");
  });

  // app.get('/blex', async (req, res) => {

  // })
  // message board routes ===============================================================

  app.post("/blog", isLoggedIn, upload.single('blexImg'), async (req, res) => {
    const image = await cloudinary.uploader.upload(req.file.path)
    console.log(req.body)
    db.collection("blog").save(      
      { user: req.user.local.email, destination: req.body.destination, date: req.body.date, personalEx: req.body.personalExperience, header: req.body.blexHeading, img: image.url },
      (err, result) => {     
        if (err) return console.log(err);
       // console.log("saved to database");
        res.redirect("/blex");
      }
    );
  });

  app.post("/profilePic", isLoggedIn, upload.single('profilePic'), async (req, res) => {
    const image = await cloudinary.uploader.upload(req.file.path)
    console.log(req.body)
    db.collection("users").findOneAndUpdate(      
      { _id: req.user._id },
      {
        $set: {
          'local.img': image.url
        }
        
      },
      {
        sort: { _id: -1 }
      },
      (err, result) => {     
        if (err) return console.log(err);
       // console.log("saved to database");
        res.redirect("/blex");
      }
    );
  });

  app.put("/edit", (req, res) => {
    db.collection("blog").findOneAndUpdate(
      { _id: ObjectId(req.body._id)},
      {
        $set: {
          personalEx: req.body.newText
        }
      },
      {
        sort: { _id: -1 }
      },
      (err, result) => {
        if (err) return res.send(err);
        res.send(result);
      }
    );
  });

  // app.put('/thumbdown', (req, res) => {
  //   db.collection('messages')
  //   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
  //     $set: {
  //       thumbDown:req.body.thumbDown + 1
  //     }
  //   }, {
  //     sort: {_id: -1},
  //     upsert: true
  //   }, (err, result) => {
  //     if (err) return res.send(err)
  //     res.send(result)
  //   })
  // })

  app.delete("/trashd", async (req, res) => {
   console.log(req.body)
    await cloudinary.uploader.destroy(req.body.cloudinaryid)
    console.log(req.body)
    await db.collection("blog").deleteOne(
      {_id: ObjectId(req.body._id)},
      (err, result) => {
        if (err) return res.send(500, err);
        res.redirect("/blex");
      });
  });

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get("/login", function (req, res) {
    res.render("login.ejs", { message: req.flash("loginMessage") });
  });

  // process the login form
  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // SIGNUP =================================
  // show the signup form
  app.get("/signup", function (req, res) {
    res.render("signup.ejs", { message: req.flash("signupMessage") });
  });

  // process the signup form
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/signup", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get("/unlink/local", isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect("/profile");
    });
  });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/");
}
