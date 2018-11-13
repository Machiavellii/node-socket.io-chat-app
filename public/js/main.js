let socket = io();
let formMessage = document.querySelector('#message-form');
let inputField = document.querySelector('#input-message');
let ul = document.querySelector('#message');
let locationBtn = document.querySelector('#send-location');

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
  li.className = 'message';

  let mustacheMessage = document.querySelector('#message-mustache').innerHTML;

  let html = Mustache.render(mustacheMessage, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  li.innerHTML = html;

  ul.appendChild(li);
});

//Location
socket.on('newLocationMessage', message => {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  let li = document.createElement('li');
  li.className = 'message';

  let mustacheLocation = document.querySelector('#location-message-mustache')
    .innerHTML;

  let htmlLocation = Mustache.render(mustacheLocation, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime,
    url: message.url
  });

  li.innerHTML = htmlLocation;

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
