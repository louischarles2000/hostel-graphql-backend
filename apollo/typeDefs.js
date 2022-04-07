const { gql } = require('apollo-server');

const typeDefs = gql `
    type User{
        id: ID!
        firstName: String!
        lastName: String!
        email: String
        college: College!
        phone: String!
        birthday: String
        gender: String
    }
    type Owner{
        id: ID!
        firstName: String!
        lastName: String!
        email: String
        password: String
        phone: [String]!
        gender: String
    }
    type College {
        name: String!
    }
    input UserInputData {
        firstName: String!
        lastName: String!
        email: String
        college: String!
        phone: String!
        birthday: String,
        gender: String!
    }
    type Hostel {
        id: ID
        name: String!
        address: String!
        category: String!
        owner: String!
        gender: String!
        tenants: Int
        price: Int
        images: [String]
        bookingRate: Int!
        restrictedPayment: Boolean!
        paymentDetails: String
        priceRange: priceRange!
        reportingInstructions: [String]
        rules: [String]
        services: [String]!
        location: [Float]
        rating: Int
    }
    type attributes{
        tenants: Int!
        bedsProvided: Boolean!
        privateBathroom: Boolean!
        hasWardrobe: Boolean
        hasBalcony: Boolean
    }
    input attributesInput{
        tenants: Int!
        bedsProvided: Boolean!
        privateBathroom: Boolean!
        hasWardrobe: Boolean
        hasBalcony: Boolean
    }
    type Room {
        id: ID
        name: String!
        hostel: String!
        quantity: Int!
        booked: Boolean!
        price: Int!
        images: [String]!
        attributes: attributes!
    }
    type priceRange {
        minimmumPrice: Int!
        maximmumPrice: Int!
    }
    input OwnerInput {
        firstName: String!
        lastName: String!
        email: String!
        password: String!
        phone: [String]!
        gender: String
    }
    input HostelInput {
        name: String!
        address: String!
        owner: String!
        category: String!
        gender: String!
        bookingRate: Int!
        restrictedPayment: Boolean!
        paymentDetails: String
        priceRange: [Int]!
        reportingInstructions: [String]
        rules: [String]
        images: [String]
        phone: [String]
        services: [String]!
        location: [Float]
    }
    # input RoomInput {
    #     name: String!
    #     hostel: String!
    #     quantity: Int!
    #     price: Int!
    #     images: [String]!
    #     attributes: attributesInput!
    # }
    
    input RoomInput {
        name: String!
        hostel: String!
        quantity: Int!
        price: Int!
        images: [String]!
        tenants: Int!
        bedsProvided: Boolean!
        privateBathroom: Boolean!
        hasWardrobe: Boolean
        hasBalcony: Boolean
    }
    type HostelDetails {
        hostel: Hostel
        rooms: [Room]!
    }
    type AuthUser {
        id: ID
        firstName: String
        lastName: String
        email: String
        phone: String
        gender: String
    }
    type userExists {
        numberExists: Boolean,
        user: AuthUser,
    }
    type FullHostel {
        id: ID
        restrictedPayment: Boolean
        paymentDetails: String
        name: String
        ownerName: String
        phone: [String]
        bookingRate: Int!
    }
    type RoomDetails{
        room: Room
        hostel: FullHostel
    }
    type SavedList {
        image: String
        hostelName: String
        roomName: String
        hostelId: ID
        roomId: ID
    }
    type CheckRes{
        exists: Boolean!
        hostelId: ID
    }
    
    type ownerData{
        owner: Owner!
        hostel: String
    }
    type Mutation {
        signUp(userInput: UserInputData): User!
        registerOwner(ownerInput: OwnerInput): Owner!
        registerHostel(hostelInput: HostelInput): Hostel!
        addRoom(roomInput: RoomInput): [Room]!
        # addRoom(roomInput: RoomInput): Hostel
        saveRoom(roomId: String!, userId: String!): [Room]
    }
    type Query{
        hello: String
        numberExists(phone: String): userExists
        getHostels: [Hostel]!
        getHostel(hostelId: String!): HostelDetails
        getRoom(roomId: String!): RoomDetails!
        getSaved(userId: String!): [SavedList]
        getOwner(ownerId: String!): ownerData!
        checkHostelExists( ownerId: String! ): CheckRes!
    }
`;

module.exports = typeDefs;