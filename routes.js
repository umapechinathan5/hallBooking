import express from 'express';

const router = express.Router();

let rooms = [
  {
    roomNo: 1,
    room_status: "available",
    amenities: "Tv,Washing Machine,Iron Box",
    seats: 5,
    price: 2500,
  },
  {
    roomNo: 2,
    room_status: "available",
    amenities: "Tv,Washing Machine,Iron Box",
    seats: 4,
    price: 2000,
  },
  {
    roomNo: 3,
    room_status: "Booked",
    amenities: "Tv,Washing Machine,Iron Box",
    seats: 6,
    price: 3000,
  },
  {
    roomNo: 4,
    room_status: "available",
    amenities: "Tv,Washing Machine,Iron Box",
    seats: 2,
    price: 1000,
  },
];

let BookingRoom=[]


router.get('/rooms',(req,res)=>{
  res.status(200).json({message:"All Rooms fetched Successfully", List_of_Rooms : rooms})
})

router.post('/room/create',(req, res)=>{
  const{ room_status, amenities, seats, price} = req.body
  const NewRoomData = {
      roomNo : rooms.length+1,
      room_status : room_status,
      amenities : amenities,
      seats : seats,
      price : price
  }
  rooms.push(NewRoomData)
  res.status(200).json({message:"create new Room Successfully", New_Room:rooms})
})


router.post('/room/book',(req, res)=>{
  const{customer_name, date, arrival, departure, roomId} = req.body

  let room = rooms.filter((e)=>e.room_status == "available" && e.roomNo === roomId)
  if(!room){
    return  res.status(400).json({message:"Room is Not Available"})
  }
  else{
      let BookingDate = BookingRoom.filter((room)=>{room.booking_date === date})
      if(BookingRoom>0){
        return  res.status(400).json({message:"Room Already Booked"})
      }
  
  else{
      let booking = {
          roomId: BookingRoom.length+1,
          customer_name,
          arrival,
          departure,
          Date:date,
          booking_id : BookingRoom.length+1,
          booking_date :date,
          status:"Booked"
      }
      BookingRoom.push(booking)
      return res.status(400).json({message:"Room Booked Successfully", BookedRoom:BookingRoom})
  }

}
})

router.get('/rooms/booked',(req,res)=>{
  // Responds with data of all booked rooms
 res.status(200).json({
     message:"Successfully Fetched All Room Data",
     BookingRoom
 })
})
router.get('/customers', (req,res)=>{
const customerData = BookingRoom.map((booking)=>{
  const Room = rooms.find((i)=>i.roomNo === booking.roomId)
  return{
    roomNo:booking.roomId,
    Customer_Name:booking.customer_name,
    Date:booking.date,
    Arrival:booking.arrival,
    Departure:booking.departure
  }
})
res.status(200).json({message:"All Customer and their BookedRoom details",customerData})
})
router.get('/customers/booking',(req,res)=>{
const customerBooking = {}

BookingRoom.forEach(booking=>{
  const {roomId, customer_name, booking_date, arrival, departure,booking_id,status}=booking
  if(!customerBooking[customer_name]){
    customerBooking[customer_name]=[]
  }
  customerBooking[customer_name].push({roomId,booking_date,arrival,departure,booking_id,status})
})

const customerdata = Object.keys(customerBooking).map(customer_name=>{
  const bookings = customerBooking[customer_name]
  const count = bookings.length
  return {customer_name, bookings, count}
})

res.status(200).json({message:"Customer Booked Count", customerdata})
})


export default router;