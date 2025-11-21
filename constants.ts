import { Step, StepId } from './types';

export const QUIZ_FLOW: Record<StepId, Step> = {
  START: {
    id: 'START',
    type: 'single_choice',
    question: 'Como posso te ajudar hoje?',
    options: [
      { label: 'Quero aprender marketing digital com o JP', value: 'learn' }, // Logic handled in App.tsx
      { label: 'Já vivo do digital e quero escalar', value: 'scale', nextStep: 'PATH_B_AREA' },
      { label: 'Contratar o JP para um serviço', value: 'hire', nextStep: 'PATH_C_AREA' },
    ],
  },

  // --- PATH A: LEARN ---
  PATH_A_LEVEL: {
    id: 'PATH_A_LEVEL',
    type: 'single_choice',
    question: 'Qual seu nível de conhecimento no digital?',
    options: [
      { label: 'Zero', value: 'zero' }, // Logic in App.tsx -> Interest
      { label: 'Não produzo conteúdo. Sei fazer algumas coisas, mas ainda não consegui fazer dinheiro', value: 'beginner' }, // -> Interest
      { label: 'Produzo conteúdo, tenho audiência, mas ainda não consegui fazer dinheiro', value: 'intermediate' }, // -> Interest
      // CRITICAL CHANGE: This option now jumps directly to Funnel B (PATH_B_AREA)
      { label: 'Já faturo bem e quero escalar', value: 'advanced', nextStep: 'PATH_B_AREA' },
    ],
  },
  PATH_A_INTEREST: {
    id: 'PATH_A_INTEREST',
    type: 'single_choice',
    question: 'Você gostaria de fazer dinheiro com o quê?',
    options: [
      { label: 'Automação e IA', value: 'automation', nextStep: 'RESULT_ELECTI' },
      { label: 'Criação de Conteúdo', value: 'content', nextStep: 'RESULT_ELECTI' },
      { label: 'Tráfego Pago', value: 'ads', nextStep: 'RESULT_ELECTI' },
      { label: 'Social Media / Design', value: 'design', nextStep: 'RESULT_ELECTI' },
      { label: 'Todas alternativas anteriores', value: 'all', nextStep: 'RESULT_ELECTI' },
    ],
  },
  
  // --- PATH B: SCALE (UPDATED LOGIC) ---
  PATH_B_AREA: {
    id: 'PATH_B_AREA',
    type: 'single_choice',
    question: 'Você ganha dinheiro com qual área?',
    options: [
      // Group 1: Service -> Goes to Client Question
      { label: 'Prestação de serviço (Tráfego Pago / Social Media / Design / Editor de vídeo)', value: 'service', nextStep: 'PATH_B_SERVICE_CLIENTS' },
      // Group 2: Product/SaaS -> Goes to Revenue Question
      { label: 'Infoproduto (Ebook, curso)', value: 'infoproduct', nextStep: 'PATH_B_PRODUCT_REVENUE' },
      { label: 'SaaS', value: 'saas', nextStep: 'PATH_B_PRODUCT_REVENUE' },
      { label: 'Outros', value: 'others', nextStep: 'PATH_B_PRODUCT_REVENUE' },
    ],
  },

  // Branch B1: Service
  PATH_B_SERVICE_CLIENTS: {
    id: 'PATH_B_SERVICE_CLIENTS',
    type: 'single_choice',
    question: 'Quantos clientes você tem hoje?',
    options: [
      { label: '0 a 5 clientes', value: '0-5', nextStep: 'PATH_B_SERVICE_DIFFICULTY' },
      { label: '5 a 10 clientes', value: '5-10', nextStep: 'PATH_B_SERVICE_DIFFICULTY' },
      { label: '10 a 20 clientes', value: '10-20', nextStep: 'PATH_B_SERVICE_DIFFICULTY' },
      { label: 'Mais de 20 clientes', value: '20+', nextStep: 'PATH_B_SERVICE_DIFFICULTY' },
    ],
  },
  PATH_B_SERVICE_DIFFICULTY: {
    id: 'PATH_B_SERVICE_DIFFICULTY',
    type: 'single_choice',
    question: 'Qual sua maior dificuldade hoje para escalar?',
    options: [
      { label: 'Trazer novos clientes para minha operação', value: 'clients', nextStep: 'RESULT_CALENDLY' },
      { label: 'Tenho dificuldade na hora da call', value: 'sales_call', nextStep: 'RESULT_CALENDLY' },
      { label: 'Outro', value: 'other', nextStep: 'RESULT_CALENDLY' },
    ],
  },

  // Branch B2: Product/SaaS/Other
  PATH_B_PRODUCT_REVENUE: {
    id: 'PATH_B_PRODUCT_REVENUE',
    type: 'single_choice',
    question: 'Qual sua média de faturamento mensal?',
    options: [
      { label: '0 a 5k/mês', value: '0-5k', nextStep: 'PATH_B_PRODUCT_DIFFICULTY' },
      { label: '5k a 10k/mês', value: '5-10k', nextStep: 'PATH_B_PRODUCT_DIFFICULTY' },
      { label: '10k a 20k/mês', value: '10-20k', nextStep: 'PATH_B_PRODUCT_DIFFICULTY' },
      { label: 'Mais de 20k/mês', value: '20k+', nextStep: 'PATH_B_PRODUCT_DIFFICULTY' },
    ],
  },
  PATH_B_PRODUCT_DIFFICULTY: {
    id: 'PATH_B_PRODUCT_DIFFICULTY',
    type: 'single_choice',
    question: 'Qual sua maior dificuldade hoje para escalar?',
    options: [
      { label: 'Não sei o que tenho que fazer para escalar', value: 'unknown', nextStep: 'RESULT_CALENDLY' },
      { label: 'Tráfego Pago', value: 'ads', nextStep: 'RESULT_CALENDLY' },
      { label: 'Automação', value: 'automation', nextStep: 'RESULT_CALENDLY' },
      { label: 'Não sei / outras opções', value: 'other', nextStep: 'RESULT_CALENDLY' },
    ],
  },

  // --- PATH C: HIRE ---
  PATH_C_AREA: {
    id: 'PATH_C_AREA',
    type: 'single_choice',
    question: 'Em qual área você atua?',
    options: [
      { label: 'Negócio Local', value: 'local', nextStep: 'PATH_C_DESC' },
      { label: 'Infoprodutor', value: 'infoproduct', nextStep: 'PATH_C_DESC' },
      { label: 'SaaS', value: 'saas', nextStep: 'PATH_C_DESC' },
      { label: 'Outro', value: 'other', nextStep: 'PATH_C_DESC' },
    ],
  },
  PATH_C_DESC: {
    id: 'PATH_C_DESC',
    type: 'text_input',
    question: 'Escreva uma breve descrição da sua empresa',
    placeholder: 'Ex: Sou um consultório odontológico...',
    options: [
      { label: 'Continuar', value: 'next', nextStep: 'PATH_C_REVENUE' } // Value ignored for text input
    ]
  },
  PATH_C_REVENUE: {
    id: 'PATH_C_REVENUE',
    type: 'single_choice',
    question: 'Qual sua média de faturamento mensal?',
    options: [
      { label: '0 a 10k/mês', value: '0-10k', nextStep: 'RESULT_CALENDLY' },
      { label: '10k a 50k/mês', value: '10-50k', nextStep: 'RESULT_CALENDLY' },
      { label: '50k a 100k/mês', value: '50-100k', nextStep: 'RESULT_CALENDLY' },
      { label: 'Mais de 100k/mês', value: '100k+', nextStep: 'RESULT_CALENDLY' },
    ],
  },

  // --- RESULTS ---
  RESULT_ELECTI: {
    id: 'RESULT_ELECTI',
    type: 'info',
    question: 'Recomendação Perfeita',
    description: 'Baseado no seu perfil, a melhor opção para você começar e alavancar no digital é a Electi Club.',
    ctaText: 'Acessar Electi Club',
    ctaLink: '#', // Placeholder
  },
  RESULT_CALENDLY: {
    id: 'RESULT_CALENDLY',
    type: 'info',
    question: 'Próximo Passo',
    description: 'Você tem o perfil ideal para nossa consultoria avançada. Vamos agendar uma conversa estratégica.',
    ctaText: 'Agendar Consultoria',
    ctaLink: '#', // Placeholder
  }
};