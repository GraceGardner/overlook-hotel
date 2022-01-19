import {hotel, bookRoom} from './scripts'

const loggedInAs = document.getElementById('loggedInAs');
const loggedInName = document.getElementById('loggedInName');
const loginDisplay = document.getElementById('loginDisplay');
const profileButton = document.getElementById('profileButton');
const usersProfile = document.getElementById('usersProfile');
const userBookings = document.getElementById('userBookings');
const userTotal = document.getElementById('userTotal');
const bookingButton = document.getElementById('bookingButton');
const bookingSection = document.getElementById('bookingSection');
const date = document.getElementById('date');
const singleRoom = document.getElementById('singleRoom');
const juniorSuite = document.getElementById('juniorSuite');
const suite = document.getElementById('suite');
const residentialSuite = document.getElementById('residentialSuite');
const checkAvailabilityButton = document.getElementById('checkAvailability');
const availabilityForDate = document.getElementById('availabilityForDate');
const roomDisplay = document.getElementById('roomDisplay');
const bookingForm = document.getElementById('bookingForm');
const bookedMessage = document.getElementById('bookedMessage');
const bookingPage = document.getElementById('bookingPage');
const modal = document.getElementById('modal');
const modalText = document.getElementById('modalText');
const close = document.getElementById("close");

let bookingButtons;


let selectedDate;
let selectedRoomTypes = [];

const hide = (toHide) => {
toHide.forEach(element => {
  element.classList.add('hidden');
})
};

const show = (toShow) => {
toShow.forEach(element => {
  element.classList.remove('hidden');
})
};

const showHide = (toShow, toHide) => {
  hide(toHide);
  show(toShow);
};

const displayBookings = () => {
  console.log(hotel.currentCustomer.bookings)
  userBookings.innerHTML = hotel.currentCustomer.bookings.reduce((acc, booking) => {
    acc += `<div class="reservation">
              <h3>Reservation for ${booking.date}</h3><br>
              <p>Room Number : ${booking.roomNumber}</p><br>
              <p>Reservation ID : ${booking.id}</p><br>
            </div>`
    return acc
  }, "")
};

const displayTotal = () => {
  userTotal.innerText = `Total Spent with Us: $${hotel.currentCustomer.total.toFixed(2)}`
};

const assignSelectedData = () => {
  selectedDate = date.value;
  let roomTypes = [singleRoom, juniorSuite, suite, residentialSuite]
  selectedRoomTypes = roomTypes.reduce((acc, type) => {
    if(type.checked){
    acc.push(type.value);
    }
    return acc
  }, [])
};

const clearForm = () => {
  date.value = "";
  let roomTypes = [singleRoom, juniorSuite, suite, residentialSuite]
  roomTypes.forEach(type => {
    type.checked = false
  })
}



const displayRooms = () => {
      availabilityForDate.innerText = `Rooms available for ${hotel.selectedDate}`
      roomAvailability.innerHTML = hotel.availableRooms.reduce((acc, room) => {
        acc += `<div class="available-rooms">
                  <h3>Type of room: ${room.roomType}</h3>
                  <p>Beds: ${room.numBeds} ${room.bedSize}</p>
                  <p>Bidet: ${room.bidet}</p>
                  <p>Room ${room.number} is ${room.costPerNight.toFixed(2)} per night</p>
                  <button class="book-button" value="${room.number}">Book Room</button>
                </div>`
        return acc
      }, '')
}


const createButtons = () => {
  bookingButtons = document.querySelectorAll('.book-button');
  bookingButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      bookRoom(event)
      .then(data => {
        showHide([bookedMessage], [bookingForm, roomDisplay])
      })
    })
  })
}


let domUpdates = {

displayButtons() {
  show([profileButton, bookingButton])
},

displayUserName() {
  loggedInName.innerText = `${hotel.currentCustomer.name}`;
  show([loggedInAs, loggedInName]);
},

showProfile() {
  displayBookings()
  displayTotal()
  showHide([usersProfile], [loginDisplay, bookingSection])
},

showAvailableBookings() {
  clearForm();
  showHide([bookingSection, bookingForm, bookingPage], [loginDisplay, usersProfile, bookedMessage])
},

displayErrorModal(message) {
  show([modal])
  modalText.innerText = `${message}`
},

};

const checkRoomAvailability = () => {
  event.preventDefault()
  assignSelectedData()
  if(selectedDate && selectedRoomTypes.length > 0){
    hotel.filterRooms(selectedRoomTypes, selectedDate)
    if(hotel.availableRooms.length > 0){
      displayRooms()
      createButtons()
      showHide([roomDisplay], [bookingForm, bookedMessage])
    } else {
      clearForm();
      domUpdates.displayErrorModal("Oh No! We are all booked on that date for that room type. Please select another date or room type.")
      showHide([bookingForm], [bookedMessage, roomDisplay])
    }
  } else {
    domUpdates.displayErrorModal("Oh No! Please select a room type and date")
    showHide([bookingForm], [bookedMessage, roomDisplay])
  }
}

window.onclick = function(event) {
  if (event.target == modal) {
    hide([modal])
  }
}

close.addEventListener('click', event => {
    hide([modal])
})

profileButton.addEventListener('click', domUpdates.showProfile);
bookingButton.addEventListener('click', domUpdates.showAvailableBookings);
checkAvailabilityButton.addEventListener('click', checkRoomAvailability)



export {domUpdates}
