interface ICreateUserDTO {
    id?: string;
    name: string;
    password: string;
    avatar?: string;
    email: string;
    driver_license: string;
}

export { ICreateUserDTO }