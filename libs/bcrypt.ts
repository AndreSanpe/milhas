import bcrypt from 'bcrypt';

// eslint-disable-next-line import/no-anonymous-default-export
export default {

  hashPass: async (unHassPass: string) => {
    const hash = await bcrypt.hash(unHassPass, 10)
    return hash; 
  },

}