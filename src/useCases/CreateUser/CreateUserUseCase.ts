import { User } from "../../entities/User";
import { IMailProvider } from "../../providers/IMailProvider";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserRequestDTO } from "./CreateUserDTO";

export class CreateUserUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private mailProvider: IMailProvider,
  ) {}
  //
  async execute(data: CreateUserRequestDTO) {
    const userAlreadyExists = await this.usersRepository.findByEmail(
      data.email
    );
    if (userAlreadyExists) {
      throw new Error("User already exists.");
    }
    const user = new User(data);
    await this.usersRepository.save(user);

    await this.mailProvider.sendMail({
      to:{
        name: data.name,
        email: data.email
      },
      from:{
        name: 'Your Name',
        email: 'YourEmail@email.com'
      },
      subject: 'Acess granted',
      body:'<p>You can already use our platform</p>'
    })

  }
}
