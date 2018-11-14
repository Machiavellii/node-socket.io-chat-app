const expect = require('expect');
const { Users } = require('./users');

describe('Users', () => {
  let users;
  beforeEach(() => {
    users = new Users();
    users.users = [
      {
        id: '1',
        name: 'Mike',
        room: 'Nodes'
      },
      {
        id: '2',
        name: 'Jen',
        room: 'React'
      },
      {
        id: '3',
        name: 'John',
        room: 'Nodes'
      }
    ];
  });

  it('should add new user', () => {
    let users = new Users();
    let user = {
      id: '123',
      name: 'Jen',
      room: 'NodeJS fans'
    };

    let resUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });

  it('should remove a user', () => {
    let userId = '1';
    let user = users.removeUser(userId);

    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });

  it('should remove user', () => {
    let userId = '22';
    let user = users.removeUser(userId);

    expect(user).toBeFalsy();
    expect(users.users.length).toBe(3);
  });

  it('should find user', () => {
    let userId = '2';
    let user = users.getUser(userId);

    expect(user.id).toBe(userId);
  });

  it('should not find user', () => {
    let userId = '88';
    let user = users.getUser(userId);

    expect(user).toBeFalsy();
  });

  it('should retuns names for nodes room', () => {
    let userList = users.getUserList('Nodes');

    expect(userList).toEqual(['Mike', 'John']);
  });

  it('should retuns names for nodes room', () => {
    let userList = users.getUserList('React');

    expect(userList).toEqual(['Jen']);
  });
});
