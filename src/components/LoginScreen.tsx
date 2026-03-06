import React, { useState, useEffect } from 'react';

interface LoginScreenProps {
  onLogin: (pin: string) => void;
  onGoogleLogin: () => void;
  isLoading: boolean;
  isFirebaseAvailable: boolean;
  userProfile?: {
    email: string;
    pin: string;
    avatarUrl?: string;
  };
  pinError?: boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onGoogleLogin, isLoading, isFirebaseAvailable, userProfile, pinError }) => {
  const [pin, setPin] = useState('');

  useEffect(() => {
    if (pinError) {
      setPin('');
    }
  }, [pinError]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length === 4) {
      onLogin(pin);
    }
  };

  const isGoogleAuthenticated = !!userProfile?.email;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-4">
          <div className="h-20 w-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto border border-amber-500/20 text-amber-500 shadow-2xl">
            {isGoogleAuthenticated && userProfile?.avatarUrl ? (
              <img src={userProfile.avatarUrl} alt="Avatar" className="h-full w-full object-cover rounded-3xl" referrerPolicy="no-referrer" />
            ) : (
              <i className="fa-solid fa-gem text-3xl"></i>
            )}
          </div>
          <h1 className="text-white font-black text-4xl uppercase tracking-tighter">OASIS</h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Fundo de Arte Mobile</p>
        </div>

        {!isFirebaseAvailable && (
          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl text-amber-500 text-[10px] font-bold uppercase tracking-widest text-center animate-pulse">
            <i className="fa-solid fa-triangle-exclamation mr-2"></i>
            Firebase não configurado. Algumas funções podem estar limitadas.
          </div>
        )}

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
          <div className="space-y-4">
            {!isGoogleAuthenticated ? (
              <button 
                onClick={() => (window as any).setShowPhoneModal?.(true) || onGoogleLogin()}
                disabled={isLoading}
                className="w-full bg-white border-2 border-slate-100 rounded-[2rem] py-6 px-8 flex items-center justify-center gap-4 text-slate-800 font-black text-xs uppercase tracking-[0.15em] hover:bg-gray-50 transition-all active:scale-95 shadow-xl disabled:opacity-50"
              >
                <i className="fa-brands fa-whatsapp text-4xl text-[#25D366]"></i>
                <div className="flex flex-col items-start">
                  <span className="text-[9px] text-slate-400 font-bold mb-1">ENTRADA RÁPIDA</span>
                  REGISTRAR VIA WHATSAPP (PIN ÚNICO)
                </div>
              </button>
            ) : (
              <div className="text-center space-y-2">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Conectado como</p>
                <p className="text-white font-black text-xs truncate px-4">{userProfile.email}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="text-amber-500 text-[9px] font-black uppercase tracking-widest hover:underline"
                >
                  Trocar conta
                </button>
              </div>
            )}
            
            <div className="flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-slate-800"></div>
              <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
                {isGoogleAuthenticated ? 'SEGURANÇA' : 'OU PIN'}
              </span>
              <div className="h-[1px] flex-1 bg-slate-800"></div>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-6">
              <div className="space-y-4">
                <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest text-center">
                  {userProfile?.pin ? 'Insira seu PIN de acesso' : 'Defina seu PIN de 4 dígitos'}
                </p>
                
                <div className="flex justify-center gap-3 relative h-16">
                  {[0, 1, 2, 3].map((idx) => (
                    <div key={idx} className={`h-14 w-12 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 ${pin.length > idx ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-105' : 'border-slate-800 bg-slate-950'}`}>
                      {pin.length > idx && (
                        <span className="text-amber-500 text-2xl font-black animate-in zoom-in duration-300">
                          *
                        </span>
                      )}
                    </div>
                  ))}
                  
                  <input 
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    autoFocus
                    value={pin}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setPin(val);
                      if (val.length === 4) {
                        setTimeout(() => {
                          onLogin(val);
                        }, 300);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-default z-10 w-full h-full"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading || pin.length !== 4}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-4 rounded-2xl text-[11px] uppercase tracking-[0.3em] active:scale-95 transition-all shadow-lg disabled:opacity-50"
              >
                {isLoading ? 'PROCESSANDO...' : (userProfile?.pin ? 'DESBLOQUEAR' : 'CADASTRAR PIN')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
