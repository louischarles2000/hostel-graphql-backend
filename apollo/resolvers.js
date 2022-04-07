const User = require('../models/user');
const College = require('../models/college');
const Owner = require('../models/owner');
const Hostel = require('../models/hostel');
const bcrypt = require('bcryptjs');
const Room = require('../models/room');

const checkingNumberExistance = async phone => {
    const userExists = await User.findOne({ phone: phone });
    console.log(userExists);
    return userExists !== null;
}

const getDocs = (list) => list.map(item => ({ ...item._doc, id: item._id.toString() }));

const resolvers = {
    Query: {
        hello: () => 'Hello world!',
        numberExists: async (_, { phone }) => {
            const userExists = await User.findOne({ phone: phone });
            return {
                numberExists: userExists !== null,
                user: userExists ? {...userExists._doc, id: userExists._id.toString()} : userExists
            }
        },
        getHostels: async () => {
            try {
                const hostels = await Hostel.find().populate({ path: 'owner', select: ['firstName', 'lastName'] });
                console.log(hostels);
                return hostels.map(async hostel => {
                    const rm = await Room.find({ hostel: hostel._id });
                    
                    // console.log(rm)
                    return { 
                        ...hostel._doc, 
                        id: hostel._id.toString(), 
                        tenants: rm.length > 0 ? rm[0].attributes.tenants : 0,
                        priceRange: hostel.priceRange,
                        price: rm.length > 0 ? rm[0].price : 0,
                        owner: hostel.owner.firstName + ' ' + hostel.owner.lastName,
                        location: hostel.location.coordinates 
                    }
                })
            } catch (error) {
                throw error;
            }
        },
        getHostel: async (_, { hostelId }) => {
            try {
                const hostel = await Hostel.findById(hostelId);
                const rooms = await Room.find({ hostel: hostelId });
                return {
                    hostel: {
                        ...hostel._doc,
                        id: hostel._id.toString(),
                    },
                    rooms: [
                        ...getDocs(rooms)
                    ]
                }
            } catch (error) {
                throw error;
            }
        },
        getOwner: async (_, { ownerId }) => {
            try {
                const owner = await Owner.findById(ownerId);
                const hostel = await Hostel.findOne({owner: ownerId});
                return {
                    owner: {
                        ...owner._doc,
                        id: owner._id.toString(),
                    },
                    hostel: hostel.name,
                }
            } catch (error) {
                throw error;
            }
        },
        getRoom: async (_, { roomId }) => {
            try {
                const room = await Room.findById( roomId );
                const hostel = await Hostel.findById( room.hostel ).populate({ path: 'owner', select: ['firstName', 'lastName', 'phone', 'email'] });
                // console.log(hostel)
                return {
                    room: {
                        ...room._doc,
                        id: room._id.toString(),
                    },
                    hostel: {
                        id: hostel._id.toString(),
                        restrictedPayment: hostel.restrictedPayment,
                        paymentDetails: hostel.paymentDetails,
                        name: hostel.name,
                        ownerName: hostel.owner.firstName + ' ' + hostel.owner.lastName,
                        phone: hostel.owner.phone,
                        bookingRate: hostel.bookingRate
                    },
                };
            } catch (error) {
                throw error;
            }
        },
        getSaved: async (_, { userId }) => {
            try {
                const user = await User.findById(userId);
                return user.saved.map(async rid => {
                    const rm = await Room.findById(rid).populate({ path: 'hostel', select: ['id', 'name'] });
                    return {
                        roomName: rm.name,
                        hostelId: rm.hostel._id.toString(),
                        roomId: rm._id.toString(),
                        hostelName: rm.hostel.name,
                        image: rm.images[0]
                    };
                })
            } catch (error) {
                throw error;
            }

        },
        checkHostelExists: async (_, { ownerId }) => {
            const hostelExists = await Hostel.findOne({ owner: ownerId });
            return {
                exists: hostelExists !== null,
                hostelId: hostelExists ? hostelExists.id.toString() : null
            }
        }
    },
    Mutation: {
        signUp: async (_, { userInput }) => {
            console.log(userInput);
            const userExists = await checkingNumberExistance(userInput.phone);
            if(userExists){
                const error = new Error();
                error.message = 'User already exists!';
                error.user = userExists;
                throw error;
            }
            // console.log(userExists);
            
            const newUser = new User({
                ...userInput,
                birthday: userInput.birthday ? new Date(userInput.birthday) : userInput.birthday
            });

            try {
                const user = await newUser.save();
                const college = await College.findById(user.college);
                return {
                    ...user._doc,
                    college: college._doc,
                    id: user._id.toString()
                }
            } catch (error) {
                throw error;
            }
        },
        registerOwner: async (_, { ownerInput }) => {
            const ownerExists =  await Owner.findOne({ email: ownerInput.email });
            console.log(ownerInput);
            if(ownerExists){
                // console.log(ownerExists)
                const error = new Error('User already exists!')
                throw error;
            }     
            const salt = await bcrypt.genSalt(10);       
            const owner = new Owner({
                ...ownerInput,
                password: bcrypt.hashSync(ownerInput.password, salt)
            })
            try {
                const newOwner = await owner.save();
                console.log(newOwner)
                return {
                    ...newOwner._doc,
                    id: newOwner._id.toString()
                }
            } catch (error) {
                error.message = 'Faild to create owner!';
                throw error;
            }
        },
        registerHostel: async (_, { hostelInput }) => {
            const hostelNew = await Hostel.findOne({ owner: hostelInput.owner });
            if(hostelNew){
                const error = new Error('Hostel already exists');
                throw error;
            }
            
            const hostelLocation = { type: 'Point', coordinates: [...hostelInput.location] };
            const hostel = new Hostel({
                ...hostelInput,
                priceRange: {
                    minimmumPrice: hostelInput.priceRange[0],
                    maximmumPrice: hostelInput.priceRange[1],
                },
                location: hostelLocation
            });
            try {
                const newHostel = await hostel.save();
                return {
                    ...newHostel._doc,
                    id: newHostel._id.toString(),
                    location: [...newHostel.location.coordinates]
                }
            } catch (error) {
                throw error;
            }
        },
        addRoom: async (_, { roomInput }) => {
            try {
                const room = new Room({ ...roomInput, attributes: { 
                    tenants: roomInput.tenants,
                    privateBathroom: roomInput.privateBathroom,
                    bedsProvided: roomInput.bedsProvided,
                 } });
                const newRoom = await room.save();
                if(!newRoom){
                    throw new Error('Faild to add room!')
                }
                const rooms = await Room.find();
                return getDocs(rooms);
            } catch (error) {
                console.log(error)
                throw error;
            }
        },
        saveRoom: async (_, { roomId, userId }) => {
            try {
                const user = await User.findById(userId);
                const room = await Room.findById(roomId);
                const isAlreadySaved = user.saved.findIndex(svd => svd === roomId);
                console.log(isAlreadySaved);
                if(isAlreadySaved != -1){
                    user.saved.splice(isAlreadySaved, 1);
                }else{
                    user.saved.push(room);
                }
                
                const updatedUser = await user.save();
                return updatedUser.saved.map(async rid => {
                    const rm = await Room.findById(rid);
                    return {
                        ...rm._doc,
                        id: rm._id.toString()
                    };
                })
            } catch (error) {
                throw error;
            }

        },
    }
}

module.exports = resolvers;





            // Checking if college exists
            // const collageExists = await College.find({ name: userInput.college.name });

            // const collageLocation = { type: 'Point', coordinates: [-104.9903, 39.7392] };
            // const checkCollege = new College({ 
            //     name: userInput.college.name,
            //     location: collageLocation
            // });
            
            // const college = await checkCollege.save();