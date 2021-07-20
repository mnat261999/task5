const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const userCtrl ={
    register: async (req, res) => {
        const {name, email, password} = req.body
        
        if(!name || !email || !password)
        return res.status(400).json({msg: "Please fill in all fields."})
        
        if(!validateEmail(email))
        return res.status(400).json({msg: "Invalid emails."})

        const passwordHash = await bcrypt.hash(password, 10)
        const newUser = new Users({
            name, email, password: passwordHash
        })

        await newUser.save()

        //const accesstoken = createAccessToken({id: newUser._id})

        res.json({
                msg:'Register success'
               // accesstoken
            })
    },
    getInformationUser: async (req, res)=>{
        try {
            const user = await Users.findById(req.user.id).select('-password')
            console.log("test"+ user)

            res.json(user)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getAllUser: async (req, res) => {
        try {
            const users = await Users.find().select('-password')

            res.json(users)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteUser: async (req, res) => {
        try {
            const id = req.params.id
            if(req.user.id == id){
                return res.status(400).json({msg: "Can't delete myself"})
            }
            await Users.findByIdAndDelete(req.params.id)

            res.json({msg: "Deleted Success!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateUser: async (req, res) => {
        try {
            const {name} = req.body

            await Users.findOneAndUpdate({_id: req.user.id}, {
                name
            })

            res.json({msg: "Update Success!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}




function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '5m'})
}



module.exports = userCtrl