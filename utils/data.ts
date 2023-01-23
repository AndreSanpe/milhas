import home from '../components/Sidebar-teste/home.svg'

export const navigatorLinks = [
  { label: 'Página inicial', path: '/dashboard', icon: 'home'},
  { label: 'Trainees', path: '/trainees', icon: 'person'},
  { label: 'Criador de planos', path: '/planos', icon: 'plans'},
  { label: 'Agenda', path: '/agenda', icon: 'calendar'},
  { label: 'Meus favoritos', path: '/favoritos', icon: 'favorites'},
  { label: 'Videos', path: '/videos', icon: 'play'},
  { label: 'Listas personalizadas', path: '/listas', icon: 'list'},
  { label: 'Material extra', path: '/extra', icon: 'extra'},
  { label: 'Financeiro', path: '/financeiro', icon: 'finances'},
];

export const actionLinks = [
  { label: 'Anamnese' , path:'/trainee/[id]/anamnese' , icon: 'anamnese' },
  { label: 'Avaliação antropométrica', path: '/traine/[id]/avaliacao', icon: 'avaliacao' },
  { label: 'Planejamento de treinamento' , path:'/trainee/[id]/planejamento' , icon: 'planejamento' },
  { label: 'Planejamento de metas' , path:'/trainee/[id]/metas' , icon: 'metas' },
  { label: 'Exames laboratoriais' , path:'/trainee/[id]/exames' , icon: 'exames' },
  { label: 'Questionários de saúde' , path:'/trainee/[id]/questionarios' , icon: 'questionarios' },
  { label: 'Orientações em geral' , path:'/trainee/[id]/orientacoes' , icon: 'orientacoes' },
  { label: 'Feedbacks do trainee' , path:'/trainee/[id]/feedbacks' , icon: 'feedback' },
  { label: 'Recebimentos e financeiro' , path:'/trainee/[id]/financeiro' , icon: 'financeiro' }
]

