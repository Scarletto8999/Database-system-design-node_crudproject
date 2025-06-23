const express = require('express');
const router = express.Router();
const Red = require('../models/Red');
const multer = require('multer');
const fs = require('fs');

//insert person into database route 
router.post('/add', (req, res) => {
    const user = new Red({
        _id: req.body._id,
        name: req.body.name,
        Date_of_birth: req.body.Date_of_birth,
        Place_of_birth: req.body.Place_of_birth,
        Gender : req.body.Gender,
        Status : req.body.Status,
        Resource : req.body.Resource,
        Nationality: req.body.Nationality,
        Description: req.body.Description,
        Charges: req.body.Charges
    });
    console.log(req.body);

    user.save()
        .then(() => {
            req.session.message = {
                type: 'success',
                message: 'Operation carried out successfully'
            };
            res.redirect('/');
        })
        .catch(err => {
            res.json({ message: err.message, type: 'danger' });
        });
});



router.get('/', async (req, res) => {
    try {
        const criminallist = await Red.find();
        res.render('index', {
            title: 'home page',
            users: criminallist
        });
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});


router.get('/add', (req,res)=> {
    res.render("add_person",{title:"Add Person"})
});

// edit a user
router.get('/edit/:id', async (req, res) => {
    let id = req.params.id;
    try {
        let user = await Red.findById(id);
        if(user == null){
            res.redirect('/');
        } else {
            res.render('edit_users',{
                title: "Edit user",
                user: user,
            });
        }
    } catch (err) {
        res.redirect('/');
    }
});

// update user route
router.post('/update/:id', async (req, res) => {
    let id = req.params.id;
    try {
        let result = await Red.findByIdAndUpdate(id, {
            _id: req.body._id,
            name: req.body.name,
            Date_of_birth: req.body.Date_of_birth,
            Place_of_birth: req.body.Place_of_birth,
            Gender : req.body.Gender,
            Status : req.body.Status,
            Resource : req.body.Resource,
            Nationality: req.body.Nationality,
            Description: req.body.Description,
            Charges: req.body.Charges
        });
        req.session.message = {
            type : 'success',
            message : 'user updated successfully'
        };
        res.redirect('/');
    } catch (err) {
        res.json({message: err.message , type:'danger'});
    }
});

// delete user route 
router.get('/delete/:id' , (req,res)=>{
    let id = req.params.id;
    Red.findByIdAndDelete(id)
    .then(result => {
        req.session.message = {
            type: 'info',
            message: 'user deleted successfully !'
        };
        res.redirect('/')
    })
    .catch(err => {
        res.json({message : err.message});
    });
})


module.exports =router;