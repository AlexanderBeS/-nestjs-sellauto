import {Test} from "@nestjs/testing";
import {AuthService} from "./auth.service";
import {UsersService} from "./users.service";
import {User} from "./user.entity";
import {BadRequestException, NotFoundException} from "@nestjs/common";

describe('AuthService', () => { //просто добавляет имя в вывод теста
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    //Promise.resolve - потому что вызов из auth.service асинхрронный, а тут сразу он и выполнен с результатом
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter(user => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = { id: Math.floor(Math.random() * 9999), email, password} as User;
        users.push(user)
        return Promise.resolve(user)
      }
    }

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { //если кто-то запросит UsersService, предоставь ему fakeUsersService
          provide: UsersService,
          useValue: fakeUsersService
        }
      ]
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  })

  it('creates a new user with salted and hashed password', async () => {
    const user = await service.signup("test2@gmail.com", "qwerty");

    expect(user.password).not.toEqual('qwerty');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  })

  it('throws error when user with this email exists', async () => {
    fakeUsersService.find = () => Promise.resolve([{id: 1, email: 'asda', password: 'awa'} as User])

    //async (done) => {
    // try {
    //   await service.signup('asd@faa.com', 'paww');
    // } catch (err) {
    //   done();
    // }

    // await expect(service.signup('asda@asda.com', 'asdf')).rejects.toThrowError(
    //   BadRequestException,
    // );

    //service.signup('asdf@asdf.com', 'asdf').catch(e => done());

    // await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
    //   'Email is in use',
    // );


    expect.assertions(2);

    try {
      await service.signup('a@a.pl', 'pass');
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message).toBe('Email is in use');
    }

  });

  it('throw error if signin with an unused email', async () => {
    try {
      await service.signin('asda@aeda', 'asda');
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('User not found');
    }
  });

  it('password doesn\'t match', async () => {
    fakeUsersService.find = () => Promise.resolve([{id: 1, email: 'test@gmail.com', password: 'qwerty'} as User])
    try {
      await service.signin('test@gmail.com', 'asda');
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message).toBe('Bad password');
    }
  })

  it('password doesn\'t match2', async () => {
    await service.signup('test@gmail.com', 'qwerty');
    try {
      await service.signin('test@gmail.com', 'asda');
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message).toBe('Bad password');
    }
  })

  it('return user if correct sign in data', async () => {
    fakeUsersService.find = () => Promise.resolve([{id: 1, email: 'test@gmail.com', password: '08882f9e42ecdb3d.90191ae70f94ce476f302df751d85c6817a3f9765887f4515900c17c85ec378c'} as User])

    const user = await service.signin('test@gmail.com', 'qwerty');
    expect(user).toBeDefined();
  })

  it('return user if correct sign in data2', async () => {
    await service.signup('test@gmail.com', 'qwerty');
    const user = await service.signin('test@gmail.com', 'qwerty');
    expect(user).toBeDefined();
  })

  it('signup with already used email', async () => {
    await service.signup('test@gmail.com', 'qwerty');

    try {
      await service.signup('test@gmail.com', 'qwerty');
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message).toBe('Email is in use');
    }
  })

})
