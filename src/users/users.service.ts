import { Injectable } from '@nestjs/common';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./user.entity";

@Injectable()
export class UsersService {
  // repo: Repository<User>;
  // constructor(repo: Repository<User>) {
  //   this.repo = repo;
  // }

  //Repository -> ORM in DB
  //@InjectRepository(User) -> используем потому что дальше идёт generic
  //Обобщения (англ. generics) или дженерики - это инструмент, который позволяет писать на TypeScript компоненты,
  // способные работать с различными типами данных.
  // В то же время они позволяют сохранить строгость кода и работоспособность проверки типов.
  // Repository<User> - по сути, мы создаём репозиторий от orm для сущности user.
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password});
    return this.repo.save(user);
  }
}
