const { compareSync } = require('bcrypt');
const { format } = require('path');
const db = require('../models')
const StaffUser = db.staff;
const Shift = db.shift;
const Availability = db.availbilty;
const Notification = db.notification;
dashboard=(req,res,next)=>{
    if(req.session.isManager){
        StaffUser.find({}).lean().exec((err,staffDbData)=>{
            if(err){
                res.status(500).send({message:err})
            }
            else{
                Shift.find({assigned_by:req.session.user_id}).lean().exec((err,shiftDbData)=>{
                    if(err){
                        res.status(500).send({message:err});
                    }
                    else{
                        var shifts=shiftDbData.map(shift=>shift);
                        var staffs = staffDbData.map(staff=>staff);
                        res.render('dashboard',{ shifts , staffs , isManager:req.session.isManager});
                    }
                })
            }
        })
        
      
    }
    else{
        Availability.find({user_id:req.session.user_id,isAccepted:true})
        .populate("shift")
        .select("shift")
        .lean()
        .exec((err,shifts)=>{
            if(err){
                res.status(500).send({message:err})
            }
            else{
                Notification.find({staff:req.session.user_id,isChecked:false}).lean().exec((err,notif)=>{
                    if(err){
                        res.status(500).send({message:err})
                    }
                    
                    let isNotification=false;
                    if(notif.length!=0){
                     isNotification = true
                    }
                    res.render('dashboard',{shifts,isManager:req.session.isManager,isNotification})
                })
                
            }
        })
        
    }
    
}

const dashCont ={
    dashboard
}
module.exports=dashCont;