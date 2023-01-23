import prisma from './prisma';
import { NewTrainee } from "../types/NewTrainee";
import { NextApiHandler } from 'next';



let TEMPORARYtrainee = [{
  id: 1,
  name: 'Gabriel Freitas',
  email: 'gabriel@gmail.com',
  birthDate: '15/05/1992',
  password: '1223',
  instagram: '@gabriel.freitasc',
  celPhone: '(35)991911232',
  cpf: 111111111,
  status: true,
  gender: 'masculino',
  contractPlan: 'Basic',
  avatar: '/tmp/gabs.jpg',
}, 
{
  id: 2,
  name: 'Gustavo Esporte',
  email: 'gustavo@gmail.com',
  birthDate: '15/05/1992',
  password: '1223',
  instagram: '@gustavo',
  celPhone: '(35)991911232',
  cpf: 111111111,
  status: false,
  gender: 'masculino',
  contractPlan: 'Basic',
  avatar: '/tmp/gustavo.jpg',
}]

  const useApi = (tenantId: number) => ({

   //Get Tenant
  getTenant: async () => {
    switch (tenantId) {
      case 1:
        return {
          id: 1,
          name: 'Bruno',
          email: 'bruno@gmail.com',
          dataExpiracao: '31/12/2022',
          avatar: '/tmp/IMG_9018.png',
        }
      default: return false;
    }
  }, 

  //Get all Trainees
  getAllTrainees: async () => {
    /* let trainees = [];
    for(let i=0; i < 2; i++)
      trainees.push(TEMPORARYtrainee) */
    return TEMPORARYtrainee;
  },

  //Get one trainee
  getTrainee: async (id: number) => {
    const searchTrainee = TEMPORARYtrainee.find(t => t.id == id);
    return searchTrainee;
  },

  //Add new trainee
  addTrainee: async (trainee: NewTrainee) => {
    console.log(trainee);
    return { ...trainee, id: 7};
  },

});

export default useApi;