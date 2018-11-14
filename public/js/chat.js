let socket = io();
let formMessage = document.querySelector('#message-form');
let inputField = document.querySelector('#input-message');
let ul = document.querySelector('#message');
let locationBtn = document.querySelector('#send-location');

//Autoscrolling
function scrollToBottom() {
  let clientHeight = ul.clientHeight;
  let scrollTop = ul.scrollTop;
  let scrollHeight = ul.scrollHeight;
  let newMessage = ul.lastElementChild;
  let newMessageHeight = newMessage.clientHeight;
  // let lastMessageHeight = newMessage.previousSibling.clientHeight;

  if (clientHeight + scrollTop + newMessageHeight >= scrollHeight) {
    message.scrollTop = scrollHeight;
  }
}

socket.on('connect', () => {
  console.log('Connected to server');
  let query = queryString();

  socket.emit('join', query, err => {
    if (err) {
      alert(err);
      location.href = '/';
    } else {
      console.log('No Error');
    }
  });
});

socket.on('disconnect', () => {
  console.log('Disconnect from Server');
});

socket.on('updateUserList', users => {
  console.log(users);
  let ul = document.createElement('ul');

  users.forEach(user => {
    console.log(user);
    let li = document.createElement('li');
    li.textContent = user;
    ul.appendChild(li);
  });

  let user = document.querySelector('#users');
  user.innerHTML = '';
  user.appendChild(ul);
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
  scrollToBottom();
});

//Location
socket.on('newLocationMessage', message => {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  let li = document.createElement('li');
  li.className = 'message';

  let mustacheLocation = document.querySelector('#location-message-mustache')
    .innerHTML;

  let htmlLocation = Mustache.render(mustacheLocation, {
    from: message.from,
    createdAt: formattedTime,
    url: message.url
  });

  li.innerHTML = htmlLocation;

  ul.appendChild(li);
  scrollToBottom();
});

formMessage.addEventListener('submit', e => {
  e.preventDefault();

  socket.emit(
    'createMessage',
    {
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

//Converting URL parameters to a JS object
function queryString() {
  let pairs = location.search.slice(1).split('&');

  let result = {};

  pairs.forEach(pair => {
    pair = pair.split('=');
    result[pair[0]] = decodeURIComponent(pair[1] || '');
  });

  return JSON.parse(JSON.stringify(result));
}

// console.log(query);
