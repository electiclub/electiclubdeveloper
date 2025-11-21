import React, { useState, useEffect, useRef } from 'react';
import { QUIZ_FLOW } from './constants';
import { QuizState, StepId } from './types';
import GridBackground from './components/GridBackground';
import { ProgressBar } from './components/ProgressBar';

const App: React.FC = () => {
  // State Management
  const [state, setState] = useState<QuizState>({
    currentStepId: 'START',
    history: [],
    answers: {},
  });

  const [inputText, setInputText] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Modal & Lead Form State
  const [showModal, setShowModal] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const currentStep = QUIZ_FLOW[state.currentStepId];

  // Helper to smooth scroll to top on step change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [state.currentStepId]);

  // Navigation Logic
  const handleNext = (nextId: StepId, answerValue?: string, answerKey?: string) => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      setState(prev => ({
        currentStepId: nextId,
        history: [...prev.history, prev.currentStepId],
        answers: answerValue && answerKey 
          ? { ...prev.answers, [answerKey]: answerValue } 
          : prev.answers
      }));
      setInputText('');
      setIsTransitioning(false);
    }, 300);
  };

  // Logic for selecting an option
  const handleOptionSelect = (optionValue: string, nextStepOverride?: StepId) => {
    // Special Logic for Branching
    let nextStepId = nextStepOverride;

    // Logic: START -> Branch
    if (state.currentStepId === 'START') {
      if (optionValue === 'learn') nextStepId = 'PATH_A_LEVEL';
    }

    // Logic: Path A Level -> Branch
    if (state.currentStepId === 'PATH_A_LEVEL') {
      if (['zero', 'beginner', 'intermediate'].includes(optionValue)) {
        nextStepId = 'PATH_A_INTEREST';
      } else if (optionValue === 'advanced') {
        // Explicitly redirecting to Path B as requested
        nextStepId = 'PATH_B_AREA';
      }
    }

    if (nextStepId) {
      handleNext(nextStepId, optionValue, state.currentStepId);
    } else {
      console.error("No next step defined for this option");
    }
  };

  // Logic for submitting text input
  const handleTextSubmit = () => {
    if (!inputText.trim()) return;
    
    // Look for the 'next' option in the current step to determine destination
    const nextOption = currentStep.options?.find(opt => opt.value === 'next');
    if (nextOption?.nextStep) {
      handleNext(nextOption.nextStep, inputText, state.currentStepId);
    }
  };

  // Phone Masking Logic
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    let formattedValue = value;
    if (value.length > 2) {
      formattedValue = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length > 7) {
      formattedValue = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    }

    setLeadPhone(formattedValue);
  };

  // Lead Submission Logic
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || leadPhone.length < 14) return; // Simple validation

    setIsSubmitting(true);

    const payload = {
      name: leadName,
      phone: leadPhone,
      quizData: state.answers,
      finalStep: state.currentStepId
    };

    try {
      // Fire and forget webhook or await if strictly needed. 
      // Using await ensures data is sent before redirect, but might delay UX.
      // Using no-cors to avoid browser CORS blocks since we can't control the n8n server headers from here easily
      // usually n8n webhooks accept POST.
      await fetch('https://www.n8n.conversanaweb.top/webhook/electi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      }).catch(err => console.error("Webhook Error:", err));
      
    } catch (error) {
      console.error("Submission error", error);
    } finally {
      // Always redirect
      window.location.href = 'https://wa.link/3ddvr0';
    }
  };

  // Estimated progress map
  const progressMap: Record<StepId, number> = {
    'START': 1,
    'PATH_A_LEVEL': 2,
    'PATH_A_INTEREST': 3,
    'PATH_B_AREA': 3,
    'PATH_B_SERVICE_CLIENTS': 4,
    'PATH_B_SERVICE_DIFFICULTY': 5,
    'PATH_B_PRODUCT_REVENUE': 4,
    'PATH_B_PRODUCT_DIFFICULTY': 5,
    'PATH_C_AREA': 2,
    'PATH_C_DESC': 3,
    'PATH_C_REVENUE': 4,
    'RESULT_ELECTI': 5,
    'RESULT_CALENDLY': 6
  };

  const currentProgress = progressMap[state.currentStepId] || 1;
  const totalProgress = 6;

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col relative overflow-hidden">
      <GridBackground />
      <ProgressBar current={currentProgress} total={totalProgress} />

      {/* Main Content Area */}
      <div 
        ref={scrollRef}
        className="flex-1 flex flex-col items-center justify-center z-10 w-full max-w-2xl mx-auto px-6 py-12 overflow-y-auto"
      >
        
        {/* Transition Container */}
        <div className={`w-full transition-all duration-500 ease-out ${isTransitioning ? 'opacity-0 translate-y-8 blur-sm' : 'opacity-100 translate-y-0 blur-0'}`}>
          
          {/* Question / Title */}
          <h1 className="text-3xl md:text-5xl font-bold text-center mb-6 leading-tight tracking-tight">
            {currentStep.question}
          </h1>

          {/* Description (for results mainly) */}
          {currentStep.description && (
            <p className="text-gray-400 text-center mb-12 text-lg md:text-xl max-w-lg mx-auto leading-relaxed font-light">
              {currentStep.description}
            </p>
          )}

          {/* OPTIONS: Single Choice */}
          {currentStep.type === 'single_choice' && (
            <div className="space-y-4 w-full mt-10">
              {currentStep.options?.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(opt.value, opt.nextStep)}
                  className="w-full bg-white text-black font-medium py-5 px-8 rounded-2xl shadow-lg hover:bg-gray-100 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 text-left flex items-center justify-between group border border-transparent"
                >
                  <span className="text-lg md:text-xl">{opt.label}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              ))}
            </div>
          )}

          {/* OPTIONS: Text Input */}
          {currentStep.type === 'text_input' && (
            <div className="w-full mt-10 animate-fade-in">
              <div className="relative group">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={currentStep.placeholder}
                  rows={4}
                  className="w-full bg-transparent border-b border-white/20 text-xl md:text-2xl py-4 focus:outline-none focus:border-white transition-all duration-300 resize-none placeholder-gray-700 font-light"
                  autoFocus
                />
              </div>
              <div className="mt-10 flex justify-end">
                <button
                  onClick={handleTextSubmit}
                  disabled={!inputText.trim()}
                  className={`bg-white text-black font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 flex items-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.1)] ${
                    !inputText.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]'
                  }`}
                >
                  Continuar
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 14 0"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          )}

          {/* OPTIONS: Result / Info */}
          {currentStep.type === 'info' && (
            <div className="mt-12 flex justify-center animate-fade-in">
              <button
                onClick={() => setShowModal(true)}
                className="bg-white text-black font-bold text-xl md:text-2xl py-5 px-12 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] hover:-translate-y-1 transition-all duration-300"
              >
                {currentStep.ctaText}
              </button>
            </div>
          )}

        </div>
      </div>
      
      {/* Lead Capture Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setShowModal(false)} 
          />
          
          {/* Modal Content */}
          <div className="relative bg-[#111] border border-white/10 w-full max-w-md p-8 rounded-3xl shadow-2xl animate-fade-in">
            <h2 className="text-2xl font-bold text-center mb-2">Quase lá!</h2>
            <p className="text-gray-400 text-center mb-8 text-sm">Preencha seus dados para receber o direcionamento exclusivo.</p>
            
            <form onSubmit={handleLeadSubmit} className="space-y-6">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500 ml-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="Digite seu nome"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all"
                />
              </div>

              {/* Phone Input */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500 ml-1">WhatsApp com DDD</label>
                <input
                  type="tel"
                  required
                  value={leadPhone}
                  onChange={handlePhoneChange}
                  placeholder="(00) 00000-0000"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !leadName || leadPhone.length < 14}
                className={`w-full bg-white text-black font-bold text-lg py-4 rounded-xl mt-4 shadow-lg transition-all ${
                  isSubmitting || !leadName || leadPhone.length < 14
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:scale-[1.02] hover:shadow-white/20'
                }`}
              >
                {isSubmitting ? 'Enviando...' : 'Falar Com o JP Agora'}
              </button>
            </form>

            {/* Close Button (Optional) */}
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <div className="absolute bottom-6 w-full text-center z-10 opacity-40 text-[10px] tracking-[0.3em] uppercase font-light">
        JP Digital &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default App;