import * as bcrypt from 'bcryptjs';

const saltRounds = 10;

export const hashPin = async (pin: string): Promise<string> => {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(pin, salt);
    return hash;
};
