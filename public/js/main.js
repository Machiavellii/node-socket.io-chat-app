let socket = io();
let formMessage = document.querySelector('#form-message');
let inputField = document.querySelector('#input-message');
let ul = document.querySelector('#message');
let locationBtn = document.querySelector('#share-location');

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnect from Server');
});

socket.on('newMessage', message => {
  console.log('NewMessage', message);
  const formattedTime = moment(message.createdAt).format('h:mm a');
  let li = document.createElement('li');
  li.textContent = `${message.from} ${formattedTime}: ${message.text}`;

  ul.appendChild(li);
});

//Location
socket.on('newLocationMessage', message => {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  let li = document.createElement('li');
  let a = document.createElement('a');
  a.textContent = 'My Current location';
  li.textContent = `${message.from} ${formattedTime}:`;
  a.setAttribute('href', message.url);
  a.setAttribute('target', '_blank');
  li.appendChild(a);

  ul.appendChild(li);
});

formMessage.addEventListener('submit', e => {
  e.preventDefault();

  socket.emit(
    'createMessage',
    {
      from: 'User',
      text: inputField.value
    },
    () => {
      inputField.value = '';
    }
  );
});

locationBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported');
  }

  locationBtn.setAttribute('disabled', 'disabled');
  locationBtn.textContent = 'Sending location..';

  navigator.geolocation.getCurrentPosition(
    position => {
      locationBtn.removeAttribute('disabled');
      locationBtn.textContent = 'Send location';
      console.log(position);
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    () => {
      alert('Unable to fetch location');
      locationBtn.removeAttribute('disabled');
      locationBtn.textContent = 'Send location';
    }
  );
});
