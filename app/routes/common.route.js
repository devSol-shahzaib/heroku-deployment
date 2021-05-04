const {dashCont} = require('../controllers');
module.exports = function(app){
    app.use(function(res,req,next){
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    })
    app.get('/logout',(req,res)=>{
        console.log(req.session.isLoggedIn);
    if (req.session.isLoggedIn) {
        req.session.destroy(() => {
          res.render('index',{layout:false})
        });
       
      }
      else {
        res.status(404).end();
      }
    });
    app.get('/dashboard',[dashCont.dashboard]);

}